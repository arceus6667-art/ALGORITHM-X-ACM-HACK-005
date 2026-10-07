create function public.load_agenttrap_workspace()
returns jsonb language sql stable security invoker set search_path='' as $$
select coalesce((select jsonb_build_object(
'revision',w.revision,'settings',w.settings,
'assets',coalesce((select jsonb_agg(a.data order by a.position) from public.agenttrap_assets a where a.user_id=w.user_id),'[]'::jsonb),
'policies',coalesce((select jsonb_agg(p.data order by p.position) from public.agenttrap_policies p where p.user_id=w.user_id),'[]'::jsonb),
'approvals',coalesce((select jsonb_agg(r.data order by r.position) from public.agenttrap_approvals r where r.user_id=w.user_id),'[]'::jsonb),
'events',coalesce((select jsonb_agg(e.data order by e.position) from public.agenttrap_audit_events e where e.user_id=w.user_id),'[]'::jsonb)
) from public.agenttrap_workspaces w where w.user_id=(select auth.uid())),'{"revision":0,"empty":true}'::jsonb);
$$;
revoke all on function public.load_agenttrap_workspace() from public,anon;
grant execute on function public.load_agenttrap_workspace() to authenticated;
