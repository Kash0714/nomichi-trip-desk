-- ============================================================
-- Nomichi Trip Desk — Initial Schema
-- Run this in Supabase SQL editor or via supabase db push
-- ============================================================

-- Profiles (one row per auth user)
create table public.profiles (
  id        uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role      text not null default 'associate'
            check (role in ('associate', 'manager')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "authenticated users can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Trips (the CMS piece)
create table public.trips (
  id           uuid primary key default gen_random_uuid(),
  name         text    not null,
  destination  text    not null,
  start_date   date    not null,
  end_date     date    not null,
  price_inr    integer not null,
  total_seats  integer not null default 12,
  status       text    not null default 'open'
               check (status in ('open', 'closed')),
  description  text    not null default '',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.trips enable row level security;

-- Public: only open trips are visible without a session
create policy "anyone can view open trips"
  on public.trips for select
  to anon
  using (status = 'open');

create policy "authenticated can view all trips"
  on public.trips for select
  to authenticated
  using (true);

create policy "authenticated can insert trips"
  on public.trips for insert
  to authenticated
  with check (true);

create policy "authenticated can update trips"
  on public.trips for update
  to authenticated
  using (true);

create policy "authenticated can delete trips"
  on public.trips for delete
  to authenticated
  using (true);


-- Leads (the CRM core)
create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  trip_id         uuid references public.trips(id) on delete set null,
  owner_id        uuid references public.profiles(id) on delete set null,
  name            text    not null,
  phone           text    not null,
  email           text    not null,
  group_type      text    not null
                  check (group_type in ('solo', 'friends', 'couple', 'family')),
  preferred_month text    not null,
  vibe_text       text,
  status          text    not null default 'new'
                  check (status in (
                    'new', 'contacted', 'qualified',
                    'vibe_check_sent', 'confirmed', 'not_a_fit'
                  )),
  ai_vibe_fit     text    check (ai_vibe_fit in ('likely', 'maybe', 'unclear')),
  ai_vibe_reason  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.leads enable row level security;

-- Public: anyone can submit an enquiry
create policy "anyone can insert leads"
  on public.leads for insert
  to anon
  with check (true);

create policy "authenticated can view all leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "authenticated can update leads"
  on public.leads for update
  to authenticated
  using (true);


-- Touchpoints (the call log — append-only)
create table public.touchpoints (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads(id) on delete cascade not null,
  author_id   uuid references public.profiles(id) on delete set null,
  note        text not null,
  next_action text,
  created_at  timestamptz default now()
);

alter table public.touchpoints enable row level security;

create policy "authenticated can view touchpoints"
  on public.touchpoints for select
  to authenticated
  using (true);

create policy "authenticated can insert touchpoints"
  on public.touchpoints for insert
  to authenticated
  with check (true);


-- updated_at trigger (shared)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_updated_at
  before update on public.trips
  for each row execute procedure public.set_updated_at();

create trigger leads_updated_at
  before update on public.leads
  for each row execute procedure public.set_updated_at();
