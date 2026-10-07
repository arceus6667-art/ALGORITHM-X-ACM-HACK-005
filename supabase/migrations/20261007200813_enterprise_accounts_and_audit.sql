create schema if not exists agenttrap_private;
revoke all on schema agenttrap_private from public, anon;
grant usage on schema agenttrap_private to authenticated;
create table public.agenttrap_profiles (user_id uuid primary key references auth.users(id) on delete cascade, full_name text not null check(length(full_name) between 2 and 120), email text not null, analysis_count integer not null default 0, integrity_count integer not null default 0, created_at timestamptz not null default now());
create table public.agenttrap_companies (id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 2 and 160), domain text not null unique, threshold integer not null default 80 check(threshold between 25 and 100), block_enabled boolean not null default false, ownership_verified boolean not null default false, created_at timestamptz not null default now());
create table public.agenttrap_members (company_id uuid references public.agenttrap_companies(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade, role text not null check(role in ('owner','admin','member')), active boolean not null default true, primary key(company_id,user_id));
create index agenttrap_members_user on public.agenttrap_members(user_id,company_id);
create table public.agenttrap_invites (id uuid primary key default gen_random_uuid(), company_id uuid not null references public.agenttrap_companies(id) on delete cascade, email text not null, role text not null check(role in ('admin','member')), code_hash bytea not null, expires_at timestamptz not null default now()+interval '7 days', accepted_at timestamptz, created_by uuid not null references auth.users(id));
create index agenttrap_invites_company on public.agenttrap_invites(company_id);
create table public.agenttrap_licenses (company_id uuid primary key references public.agenttrap_companies(id) on delete cascade, plan text not null check(plan in ('evaluation','paid')), status text not null default 'active' check(status in ('active','revoked')), expires_at timestamptz, amount_paise bigint not null default 0, payment_reference text unique, verified_at timestamptz, check(plan<>'paid' or (amount_paise>=9000000 and payment_reference is not null and verified_at is not null)));
create table public.agenttrap_company_events (id uuid primary key default gen_random_uuid(), company_id uuid not null references public.agenttrap_companies(id), actor_id uuid not null references auth.users(id), device_id text not null, event_id text not null, event jsonb not null, risk integer not null check(risk between 0 and 100), action text not null check(action in ('ALLOW','MONITOR','BLOCK')), occurred_at timestamptz not null default now(), unique(company_id,actor_id,device_id,event_id));
create index agenttrap_company_events_time on public.agenttrap_company_events(company_id,occurred_at desc);
create index agenttrap_company_events_actor on public.agenttrap_company_events(actor_id);
create table public.agenttrap_admin_events (id uuid primary key default gen_random_uuid(), company_id uuid not null references public.agenttrap_companies(id), actor_id uuid not null references auth.users(id), action text not null, detail jsonb not null default '{}', created_at timestamptz not null default now());
create index agenttrap_admin_events_company on public.agenttrap_admin_events(company_id,created_at desc);
create index agenttrap_admin_events_actor on public.agenttrap_admin_events(actor_id);
create index agenttrap_invites_creator on public.agenttrap_invites(created_by);
create or replace function agenttrap_private.member_role(org uuid) returns text language sql stable security definer set search_path='' as $$ select role from public.agenttrap_members where company_id=org and user_id=(select auth.uid()) and active $$;
revoke all on function agenttrap_private.member_role(uuid) from public,anon;
grant execute on function agenttrap_private.member_role(uuid) to authenticated;
alter table public.agenttrap_profiles enable row level security;
alter table public.agenttrap_companies enable row level security;
alter table public.agenttrap_members enable row level security;
alter table public.agenttrap_invites enable row level security;
alter table public.agenttrap_licenses enable row level security;
alter table public.agenttrap_company_events enable row level security;
alter table public.agenttrap_admin_events enable row level security;
create policy profile_read on public.agenttrap_profiles for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.agenttrap_members m where m.user_id=agenttrap_profiles.user_id and agenttrap_private.member_role(m.company_id) in ('owner','admin')));
create policy company_read on public.agenttrap_companies for select to authenticated using(agenttrap_private.member_role(id) is not null);
create policy member_read on public.agenttrap_members for select to authenticated using(user_id=(select auth.uid()) or agenttrap_private.member_role(company_id) in ('owner','admin'));
create policy invite_read on public.agenttrap_invites for select to authenticated using(agenttrap_private.member_role(company_id) in ('owner','admin'));
create policy license_read on public.agenttrap_licenses for select to authenticated using(agenttrap_private.member_role(company_id) is not null);
create policy activity_read on public.agenttrap_company_events for select to authenticated using(agenttrap_private.member_role(company_id) in ('owner','admin') or actor_id=(select auth.uid()) and agenttrap_private.member_role(company_id) is not null);
create policy admin_event_read on public.agenttrap_admin_events for select to authenticated using(agenttrap_private.member_role(company_id) in ('owner','admin'));
revoke all on public.agenttrap_profiles,public.agenttrap_companies,public.agenttrap_members,public.agenttrap_invites,public.agenttrap_licenses,public.agenttrap_company_events,public.agenttrap_admin_events from anon,authenticated;
grant select on public.agenttrap_profiles,public.agenttrap_companies,public.agenttrap_members,public.agenttrap_invites,public.agenttrap_licenses,public.agenttrap_company_events,public.agenttrap_admin_events to authenticated;
create or replace function agenttrap_private.enterprise(action text,payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); mail text; org uuid; r text; out jsonb; code text; inv public.agenttrap_invites; prof public.agenttrap_profiles; risk_value integer; plan_record public.agenttrap_licenses;
begin
 if uid is null then raise exception 'Sign in required' using errcode='42501'; end if;
 select lower(email) into mail from auth.users where id=uid and email_confirmed_at is not null;
 if mail is null then raise exception 'Verified email required' using errcode='42501'; end if;
 if action='profile' then
  if length(trim(payload->>'name')) not between 2 and 120 then raise exception 'Enter your full name'; end if;
  insert into public.agenttrap_profiles(user_id,full_name,email) values(uid,trim(payload->>'name'),mail) on conflict(user_id) do update set full_name=excluded.full_name,email=excluded.email;
 elsif action='create_company' then
  if not exists(select 1 from public.agenttrap_profiles where user_id=uid) then raise exception 'Save your profile first'; end if;
  if split_part(mail,'@',2) in ('gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','proton.me') then raise exception 'Use your company email address'; end if;
  insert into public.agenttrap_companies(name,domain) values(trim(payload->>'name'),split_part(mail,'@',2)) returning id into org;
  insert into public.agenttrap_members values(org,uid,'owner',true);
  insert into public.agenttrap_licenses(company_id,plan,expires_at) values(org,'evaluation',now()+interval '7 days');
  insert into public.agenttrap_admin_events(company_id,actor_id,action) values(org,uid,'Company created; mailbox verified; domain ownership pending');
 elsif action='accept_invite' then
  select * into inv from public.agenttrap_invites where code_hash=extensions.digest(coalesce(payload->>'code',''),'sha256') and email=mail and expires_at>now() and accepted_at is null for update;
  if inv.id is null then raise exception 'Invite does not match your verified email or is expired'; end if;
  insert into public.agenttrap_members values(inv.company_id,uid,inv.role,true) on conflict(company_id,user_id) do update set role=excluded.role,active=true;
  update public.agenttrap_invites set accepted_at=now() where id=inv.id;
  insert into public.agenttrap_admin_events(company_id,actor_id,action) values(inv.company_id,uid,'Invite accepted');
 end if;
 if action in ('profile','create_company','accept_invite','me') then
  return jsonb_build_object('userId',uid,'email',mail,'profile',(select to_jsonb(p) from public.agenttrap_profiles p where user_id=uid),'companies',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'domain',c.domain,'role',m.role,'threshold',c.threshold,'block_enabled',c.block_enabled,'ownership_verified',c.ownership_verified,'license',(select to_jsonb(l) from public.agenttrap_licenses l where l.company_id=c.id))) from public.agenttrap_companies c join public.agenttrap_members m on c.id=m.company_id where m.user_id=uid and m.active),'[]'::jsonb));
 end if;
 org:=(payload->>'companyId')::uuid;r:=agenttrap_private.member_role(org);
 if r is null then raise exception 'Company access denied' using errcode='42501'; end if;
 select * into plan_record from public.agenttrap_licenses where company_id=org;
 if action='authorize' then
  if payload->>'edition'='full' then
   if plan_record.status is distinct from 'active' or plan_record.expires_at is not null and plan_record.expires_at<=now() then raise exception 'An active evaluation or verified paid license is required';end if;
  else
   select * into prof from public.agenttrap_profiles where user_id=uid for update;
   if payload->>'operation'='analysis' then
    if prof.analysis_count>=5 then raise exception 'Trial analysis quota reached';end if;update public.agenttrap_profiles set analysis_count=analysis_count+1 where user_id=uid;
   elsif payload->>'operation'='integrity' then
    if prof.integrity_count>=3 then raise exception 'Trial integrity quota reached';end if;update public.agenttrap_profiles set integrity_count=integrity_count+1 where user_id=uid;
   else raise exception 'Full edition required';end if;
  end if; return jsonb_build_object('allowed',true);
 end if;
 if action='dashboard' then
  return jsonb_build_object('members',(select coalesce(jsonb_agg(jsonb_build_object('userId',m.user_id,'email',p.email,'name',p.full_name,'role',m.role,'active',m.active)),'[]') from public.agenttrap_members m left join public.agenttrap_profiles p on p.user_id=m.user_id where m.company_id=org and (r in ('owner','admin') or m.user_id=uid)), 'events',(select coalesce(jsonb_agg(to_jsonb(e) order by e.occurred_at desc),'[]') from (select * from public.agenttrap_company_events where company_id=org and (r in ('owner','admin') or actor_id=uid) order by occurred_at desc limit 500) e), 'adminEvents',case when r in ('owner','admin') then (select coalesce(jsonb_agg(to_jsonb(e)),'[]') from (select * from public.agenttrap_admin_events where company_id=org order by created_at desc limit 100) e) else '[]'::jsonb end);
 end if;
 if action='record' then
  if plan_record.status is distinct from 'active' or plan_record.expires_at is not null and plan_record.expires_at<=now() then raise exception 'License is inactive';end if;
  risk_value:=greatest(0,least(100,(payload->>'risk')::integer));
  if payload->>'decision' not in ('ALLOW','MONITOR','BLOCK') then raise exception 'Invalid decision';end if;
  insert into public.agenttrap_company_events(company_id,actor_id,device_id,event_id,event,risk,action) values(org,uid,left(payload->>'deviceId',80),left(payload->>'eventId',80),jsonb_build_object('kind',left(payload->>'kind',50),'provider',left(payload->>'provider',253),'fingerprint',left(payload->>'fingerprint',64),'fileName',left(payload->>'fileName',254),'preview',left(payload->>'preview',160),'signals',payload->'signals','consent',payload->'consent','localDigest',left(payload->>'digest',64)),risk_value,payload->>'decision') on conflict(company_id,actor_id,device_id,event_id) do nothing;
  return '{"recorded":true}'::jsonb;
 end if;
 if r not in ('owner','admin') then raise exception 'Administrator permission required' using errcode='42501';end if;
 if action='invite' then
  if split_part(lower(payload->>'email'),'@',2)<>(select domain from public.agenttrap_companies where id=org) then raise exception 'Invite a verified company-domain email';end if;
  if payload->>'role' not in ('member','admin') or payload->>'role'='admin' and r<>'owner' then raise exception 'Role assignment denied';end if;
  code:=encode(extensions.gen_random_bytes(24),'hex');
  insert into public.agenttrap_invites(company_id,email,role,code_hash,created_by) values(org,lower(payload->>'email'),payload->>'role',extensions.digest(code,'sha256'),uid);
  insert into public.agenttrap_admin_events(company_id,actor_id,action,detail) values(org,uid,'Member invited',jsonb_build_object('email',lower(payload->>'email'),'role',payload->>'role'));
  return jsonb_build_object('code',code,'expiresInDays',7);
 elsif action='policy' then
  update public.agenttrap_companies set threshold=(payload->>'threshold')::integer,block_enabled=(payload->>'blockEnabled')::boolean where id=org;
  insert into public.agenttrap_admin_events(company_id,actor_id,action,detail) values(org,uid,'Risk boundary updated',payload-'companyId');
 elsif action='remove_member' then
  if (payload->>'userId')::uuid=uid then raise exception 'Cannot remove yourself';end if;
  if exists(select 1 from public.agenttrap_members where company_id=org and user_id=(payload->>'userId')::uuid and (role='owner' or role='admin' and r<>'owner')) then raise exception 'Member removal denied';end if;
  update public.agenttrap_members set active=false where company_id=org and user_id=(payload->>'userId')::uuid;
  insert into public.agenttrap_admin_events(company_id,actor_id,action,detail) values(org,uid,'Member access revoked',jsonb_build_object('userId',payload->>'userId'));
 else raise exception 'Unknown action';end if;
 return '{"saved":true}'::jsonb;
end $$;
revoke all on function agenttrap_private.enterprise(text,jsonb) from public,anon;
grant execute on function agenttrap_private.enterprise(text,jsonb) to authenticated;
create or replace function public.agenttrap_enterprise(action text,payload jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$ select agenttrap_private.enterprise(action,payload) $$;
revoke all on function public.agenttrap_enterprise(text,jsonb) from public,anon;
grant execute on function public.agenttrap_enterprise(text,jsonb) to authenticated;
