create table public.agenttrap_workspaces (
 user_id uuid primary key references auth.users(id) on delete cascade,
 settings jsonb not null default '{"threshold":75,"minimum":70,"version":1}',
 revision integer not null default 0 check (revision >= 0),
 updated_at timestamptz not null default now()
);
create table public.agenttrap_assets (
 user_id uuid not null references public.agenttrap_workspaces(user_id) on delete cascade,
 id text not null, position integer not null, data jsonb not null check(jsonb_typeof(data)='object'),
 name text generated always as (data->>'name') stored,
 classification text generated always as (data->>'classification') stored,
 risk integer generated always as ((data->'result'->>'risk')::integer) stored,
 decision text generated always as (data->'result'->>'action') stored,
 primary key(user_id,id)
);
create table public.agenttrap_policies (
 user_id uuid not null references public.agenttrap_workspaces(user_id) on delete cascade,
 id text not null, position integer not null, data jsonb not null check(jsonb_typeof(data)='object'),
 primary key(user_id,id)
);
create table public.agenttrap_approvals (
 user_id uuid not null references public.agenttrap_workspaces(user_id) on delete cascade,
 id text not null, position integer not null, data jsonb not null check(jsonb_typeof(data)='object'),
 status text generated always as (data->>'status') stored,
 primary key(user_id,id)
);
create table public.agenttrap_audit_events (
 user_id uuid not null references public.agenttrap_workspaces(user_id) on delete cascade,
 id text not null, position integer not null, data jsonb not null check(jsonb_typeof(data)='object'),
 primary key(user_id,id), unique(user_id,position)
);
create table public.agenttrap_policy_templates (
 id text primary key, data jsonb not null check(jsonb_typeof(data)='object')
);
insert into public.agenttrap_policy_templates values
 ('POL-001','{"id":"POL-001","name":"External confidential training restriction","classification":"Confidential","purpose":"Model training","destination":"External AI","role":"Any","action":"BLOCK","priority":1,"enabled":true}'),
 ('POL-002','{"id":"POL-002","name":"Restricted data requires review","classification":"Restricted","purpose":"Any","destination":"Any","role":"Any","action":"APPROVAL_REQUIRED","priority":2,"enabled":true}');
alter table public.agenttrap_policy_templates enable row level security;
create policy template_read on public.agenttrap_policy_templates for select to anon,authenticated using(true);
grant select on public.agenttrap_policy_templates to anon,authenticated;
do $$ declare t text; begin
 foreach t in array array['agenttrap_workspaces','agenttrap_assets','agenttrap_policies','agenttrap_approvals','agenttrap_audit_events'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy own_select on public.%I for select to authenticated using ((select auth.uid()) = user_id)',t);
 execute format('create policy own_insert on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)',t);
 execute format('grant select, insert on public.%I to authenticated',t);
 if t <> 'agenttrap_audit_events' then
 execute format('create policy own_update on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',t);
 execute format('grant update on public.%I to authenticated',t);
 end if;
 execute format('revoke all on public.%I from anon',t);
 end loop;
end $$;
revoke update,delete on public.agenttrap_audit_events from authenticated;

create function public.save_agenttrap_workspace(expected_revision integer, assets jsonb, policies jsonb, approvals jsonb, events jsonb, settings jsonb)
returns integer language plpgsql security invoker set search_path='' as $$
declare uid uuid := auth.uid(); current_revision integer; item record;
begin
 if uid is null then raise exception 'Sign in required' using errcode='42501'; end if;
 if jsonb_typeof(assets)<>'array' or jsonb_typeof(policies)<>'array' or jsonb_typeof(approvals)<>'array' or jsonb_typeof(events)<>'array' or jsonb_typeof(settings)<>'object' then raise exception 'Invalid workspace'; end if;
 if jsonb_array_length(assets)>2000 or jsonb_array_length(events)>10000 or jsonb_array_length(policies)>500 or jsonb_array_length(approvals)>2000 then raise exception 'Workspace limit exceeded'; end if;
 insert into public.agenttrap_workspaces(user_id) values(uid) on conflict do nothing;
 select revision into current_revision from public.agenttrap_workspaces where user_id=uid for update;
 if current_revision<>expected_revision then raise exception 'Workspace changed in another tab. Export your changes and reload.' using errcode='40001'; end if;
 insert into public.agenttrap_assets(user_id,id,position,data) select uid,value->>'id',ordinality::integer,value from jsonb_array_elements(assets) with ordinality on conflict(user_id,id) do update set data=excluded.data, position=excluded.position;
 insert into public.agenttrap_policies(user_id,id,position,data) select uid,value->>'id',ordinality::integer,value from jsonb_array_elements(policies) with ordinality on conflict(user_id,id) do update set data=excluded.data, position=excluded.position;
 insert into public.agenttrap_approvals(user_id,id,position,data) select uid,value->>'id',ordinality::integer,value from jsonb_array_elements(approvals) with ordinality on conflict(user_id,id) do update set data=excluded.data, position=excluded.position;
 for item in select value,ordinality from jsonb_array_elements(events) with ordinality loop
 if exists(select 1 from public.agenttrap_audit_events where user_id=uid and id=item.value->>'digest' and (data<>item.value or position<>item.ordinality)) then raise exception 'Stored audit history cannot be replaced'; end if;
 insert into public.agenttrap_audit_events(user_id,id,position,data) values(uid,item.value->>'digest',item.ordinality,item.value) on conflict(user_id,id) do nothing;
 end loop;
 update public.agenttrap_workspaces set settings=save_agenttrap_workspace.settings,revision=current_revision+1,updated_at=now() where user_id=uid;
 return current_revision+1;
end $$;
revoke all on function public.save_agenttrap_workspace(integer,jsonb,jsonb,jsonb,jsonb,jsonb) from public,anon;
grant execute on function public.save_agenttrap_workspace(integer,jsonb,jsonb,jsonb,jsonb,jsonb) to authenticated;
