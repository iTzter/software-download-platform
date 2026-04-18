-- Extensions
create extension if not exists pgcrypto;

-- Helper function: admin check
create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

-- Admin mapping table
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon_name text,
  created_at timestamptz not null default now()
);

-- Software
create table if not exists public.software (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  version text,
  size text,
  os_type text not null check (os_type in ('windows', 'mac', 'linux', 'android', 'ios')),
  download_url text not null,
  thumbnail_url text,
  category_id uuid not null references public.categories(id) on delete restrict,
  is_featured boolean not null default false,
  is_hidden boolean not null default false,
  download_count bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists software_category_idx on public.software(category_id);
create index if not exists software_featured_idx on public.software(is_featured) where is_hidden = false;
create index if not exists software_created_idx on public.software(created_at desc);

-- RLS
alter table public.categories enable row level security;
alter table public.software enable row level security;
alter table public.admin_users enable row level security;

-- Public read policies
create policy "Public read categories"
on public.categories
for select
using (true);

create policy "Public read software"
on public.software
for select
using (is_hidden = false);

-- Admin write policies
create policy "Admin write categories"
on public.categories
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Admin write software"
on public.software
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Admin read admin_users"
on public.admin_users
for select
using (public.is_admin_user());

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('files', 'files', true), ('images', 'images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read files"
on storage.objects
for select
using (bucket_id in ('files', 'images'));

create policy "Admin write files"
on storage.objects
for insert
with check (bucket_id in ('files', 'images') and public.is_admin_user());

create policy "Admin update files"
on storage.objects
for update
using (bucket_id in ('files', 'images') and public.is_admin_user())
with check (bucket_id in ('files', 'images') and public.is_admin_user());

create policy "Admin delete files"
on storage.objects
for delete
using (bucket_id in ('files', 'images') and public.is_admin_user());
