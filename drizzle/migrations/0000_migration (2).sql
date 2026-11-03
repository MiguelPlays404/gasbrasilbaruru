create type public.app_role as enum ('admin', 'user');
create type public.review_status as enum ('pending', 'approved', 'rejected');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(btrim(comment)) between 10 and 1000),
  consent_to_publish boolean not null check (consent_to_publish = true),
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  moderated_at timestamptz,
  moderated_by uuid
);
create index reviews_status_created_idx on public.reviews (status, created_at desc);
grant select on public.reviews to anon;
grant select, update on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "Public reads approved reviews" on public.reviews for select to anon, authenticated using (status = 'approved');
create policy "Admins read all reviews" on public.reviews for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins moderate reviews" on public.reviews for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Admins may only change status; moderation fields are set automatically
create or replace function public.reviews_guard_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.display_name is distinct from old.display_name or new.rating is distinct from old.rating
     or new.comment is distinct from old.comment or new.created_at is distinct from old.created_at
     or new.consent_to_publish is distinct from old.consent_to_publish then
    raise exception 'Only status can be changed';
  end if;
  if new.status is distinct from old.status then
    new.moderated_at := now();
    new.moderated_by := auth.uid();
    insert into public.admin_audit_log (actor_id, action, review_id, details)
    values (auth.uid(), 'review_' || new.status::text, new.id, jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  return new;
end $$;

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  review_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);
grant select on public.admin_audit_log to authenticated;
grant all on public.admin_audit_log to service_role;
alter table public.admin_audit_log enable row level security;
create policy "Admins read audit log" on public.admin_audit_log for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create trigger reviews_guard_update before update on public.reviews for each row execute function public.reviews_guard_update();

-- Rate limiting: only a salted hash of the submitter, auto-pruned
create table public.review_submissions (
  id bigint generated always as identity primary key,
  submitter_hash text not null,
  created_at timestamptz not null default now()
);
create index review_submissions_hash_idx on public.review_submissions (submitter_hash, created_at desc);
grant all on public.review_submissions to service_role;
alter table public.review_submissions enable row level security;

create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins insert settings" on public.site_settings for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.site_settings (key, value) values ('GOOGLE_REVIEW_URL', null), ('REVIEWS_PUBLIC_ENABLED', 'true');

create or replace view public.review_stats with (security_invoker = on) as
select count(*)::int as total,
  coalesce(round(avg(rating)::numeric, 1), 0) as average,
  count(*) filter (where rating = 5)::int as r5,
  count(*) filter (where rating = 4)::int as r4,
  count(*) filter (where rating = 3)::int as r3,
  count(*) filter (where rating = 2)::int as r2,
  count(*) filter (where rating = 1)::int as r1
from public.reviews where status = 'approved';
grant select on public.review_stats to anon, authenticated;