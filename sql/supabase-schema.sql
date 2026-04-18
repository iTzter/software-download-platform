-- Extensions
create extension if not exists pgcrypto;

-- Profiles table for admin roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon_name text not null,
  created_at timestamptz not null default now()
);

-- Software
create table if not exists public.software (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  version text not null,
  size text not null,
  os_type text not null,
  download_url text not null,
  thumbnail_url text not null,
  category_id uuid not null references public.categories(id) on delete cascade,
  is_featured boolean not null default false,
  is_hidden boolean not null default false,
  download_count bigint not null default 0,
  created_at timestamptz not null default now()
);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('files', 'files', true), ('images', 'images', true)
on conflict (id) do nothing;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.software enable row level security;

-- Helper function for admin role
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Public read policies
create policy "public read categories" on public.categories
for select using (true);

create policy "public read software" on public.software
for select using (is_hidden = false or public.is_admin());

-- Admin write policies
create policy "admin manage categories" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin manage software" on public.software
for all using (public.is_admin()) with check (public.is_admin());

-- Storage policies
create policy "public read images" on storage.objects
for select using (bucket_id = 'images');

create policy "public read files" on storage.objects
for select using (bucket_id = 'files');

create policy "admin upload images" on storage.objects
for insert with check (bucket_id = 'images' and public.is_admin());

create policy "admin upload files" on storage.objects
for insert with check (bucket_id = 'files' and public.is_admin());

create policy "admin update storage" on storage.objects
for update using (public.is_admin()) with check (public.is_admin());

create policy "admin delete storage" on storage.objects
for delete using (public.is_admin());
