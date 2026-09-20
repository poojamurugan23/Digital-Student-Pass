-- ============================================================
-- EduPass — Complete Supabase PostgreSQL Database Schema
-- ============================================================
-- Run this in your Supabase Dashboard: SQL Editor -> New query -> Paste & Run
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('student', 'admin', 'conductor', 'authority', 'institution')),
  institution text,
  enrolment_no text,
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id or auth.role() = 'anon');

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. APPLICATIONS TABLE
create table if not exists public.applications (
  id text primary key,
  user_id uuid references auth.users on delete set null,
  student_name text not null,
  email text not null,
  mobile text not null,
  institution text not null,
  enrolment_no text not null,
  course text not null,
  department text not null,
  year text not null,
  origin text not null,
  destination text not null,
  route_class text not null default 'STUDENT',
  transport_operator text not null default 'KSRTC',
  status text not null check (status in ('PENDING', 'APPROVED', 'REJECTED', 'CORRECTION_REQUIRED')) default 'PENDING',
  photo_url text,
  photo_hash text,
  proof_url text,
  student_id_url text,
  rejection_reason text,
  pass_id text,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by text
);

alter table public.applications enable row level security;

create policy "Applications are viewable by all"
  on public.applications for select
  using (true);

create policy "Anyone can insert applications"
  on public.applications for insert
  with check (true);

create policy "Anyone can update applications"
  on public.applications for update
  using (true);

-- 3. PASSES TABLE (Cryptographic Credentials)
create table if not exists public.passes (
  id text primary key,
  application_id text references public.applications(id) on delete set null,
  pass_id text unique not null,
  student_name text not null,
  institution text not null,
  route_class text not null,
  valid_from bigint not null,
  valid_until bigint not null,
  photo_hash text not null,
  hmac_seed text not null,
  ed25519_signature text not null,
  canonical_payload text not null,
  status text not null check (status in ('ACTIVE', 'EXPIRED', 'REVOKED')) default 'ACTIVE',
  issued_at timestamptz default now(),
  issued_by text default 'SYSTEM'
);

alter table public.passes enable row level security;

create policy "Passes are viewable by all"
  on public.passes for select
  using (true);

create policy "Passes can be inserted"
  on public.passes for insert
  with check (true);

create policy "Passes can be updated"
  on public.passes for update
  using (true);

-- 4. ROSTER TABLE (Conductor Offline Cache Sync)
create table if not exists public.roster (
  pass_id text primary key,
  student_name text not null,
  institution text not null,
  route_class text not null,
  valid_until bigint not null,
  photo_hash text not null,
  hmac_seed text not null,
  updated_at timestamptz default now()
);

alter table public.roster enable row level security;

create policy "Roster is readable by everyone"
  on public.roster for select
  using (true);

create policy "Roster can be inserted or updated"
  on public.roster for all
  using (true);

-- 5. REVOCATIONS TABLE
create table if not exists public.revocations (
  id uuid default uuid_generate_v4() primary key,
  pass_id text not null,
  reason text not null,
  revoked_at timestamptz default now(),
  revoked_by text default 'ADMIN'
);

alter table public.revocations enable row level security;

create policy "Revocations are readable by everyone"
  on public.revocations for select
  using (true);

create policy "Revocations can be inserted"
  on public.revocations for insert
  with check (true);

-- 6. SCAN LOGS TABLE (Offline Conductor Sync)
create table if not exists public.scan_logs (
  id text primary key,
  pass_id text not null,
  conductor_id text,
  device_id text not null,
  scan_time timestamptz default now(),
  result text not null check (result in ('VERIFIED', 'REJECTED', 'LIMITED')),
  reason text,
  verification_mode text not null check (verification_mode in ('ONLINE', 'OFFLINE')),
  verification_time_ms double precision,
  observed_skew_ms double precision,
  sync_id text,
  synced_at timestamptz default now()
);

alter table public.scan_logs enable row level security;

create policy "Scan logs are readable by all"
  on public.scan_logs for select
  using (true);

create policy "Scan logs can be inserted"
  on public.scan_logs for insert
  with check (true);

-- 7. STORAGE BUCKET FOR DOCUMENTS AND PHOTOS
insert into storage.buckets (id, name, public)
values ('concession-proofs', 'concession-proofs', true)
on conflict (id) do update set public = true;

create policy "Public Access to concession-proofs"
  on storage.objects for select
  using (bucket_id = 'concession-proofs');

create policy "Allow anyone to upload to concession-proofs"
  on storage.objects for insert
  with check (bucket_id = 'concession-proofs');

create policy "Allow anyone to update concession-proofs"
  on storage.objects for update
  using (bucket_id = 'concession-proofs');

-- Enable Realtime on critical tables
alter publication supabase_realtime add table public.applications;
alter publication supabase_realtime add table public.passes;
alter publication supabase_realtime add table public.scan_logs;
