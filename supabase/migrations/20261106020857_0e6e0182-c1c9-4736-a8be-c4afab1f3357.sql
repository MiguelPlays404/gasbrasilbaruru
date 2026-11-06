insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role from auth.users
where id = 'a4544ec7-5824-45b5-9a72-b7bf965c6843'::uuid and lower(email) = lower('laura78marinho@gmail.com')
and not exists (select 1 from public.user_roles where user_id = 'a4544ec7-5824-45b5-9a72-b7bf965c6843'::uuid and role = 'admin'::public.app_role);