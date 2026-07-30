-- Auth + multi-tenancy + billing scaffold.
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> paste -> Run).
--
-- NOTE: your existing `games` row(s) inserted before this migration will have
-- studio_id = null and won't be visible to anyone once RLS is enabled below.
-- Either delete them or manually set their studio_id after you've signed up
-- and have a real studio row to point them at.

create table if not exists studios (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Studio',
  owner_id uuid references auth.users(id) on delete set null,
  -- 'incomplete' = signed up but hasn't been through Stripe checkout yet.
  -- Only the checkout.session.completed webhook moves a studio to 'trialing'.
  subscription_status text not null default 'incomplete'
    check (subscription_status in ('incomplete', 'trialing', 'active', 'past_due', 'canceled')),
  trial_ends_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  studio_id uuid references studios(id) on delete set null,
  full_name text,
  avatar_url text,
  roblox_user_id text unique,
  roblox_username text,
  roblox_connected_at timestamptz,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now()
);

alter table games add column if not exists studio_id uuid references studios(id) on delete set null;

-- Auto-create a studio + owner profile whenever someone signs up.
-- Reads studio_name from the signup call's options.data (see signup page).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_studio_id uuid;
begin
  insert into studios (name, owner_id, subscription_status)
  values (coalesce(new.raw_user_meta_data ->> 'studio_name', 'My Studio'), new.id, 'incomplete')
  returning id into new_studio_id;

  insert into profiles (id, studio_id, full_name, role)
  values (new.id, new_studio_id, new.raw_user_meta_data ->> 'full_name', 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS: every table scoped to "your studio" via profiles.studio_id.
alter table studios enable row level security;
alter table profiles enable row level security;
alter table games enable row level security;
alter table game_metrics enable row level security;

drop policy if exists "studio members can read their studio" on studios;
create policy "studio members can read their studio" on studios
  for select using (
    id in (select studio_id from profiles where profiles.id = auth.uid())
  );

drop policy if exists "studio owner can update their studio" on studios;
create policy "studio owner can update their studio" on studios
  for update using (
    id in (select studio_id from profiles where profiles.id = auth.uid())
  );

drop policy if exists "users can read their own profile" on profiles;
create policy "users can read their own profile" on profiles
  for select using (id = auth.uid());

drop policy if exists "users can update their own profile" on profiles;
create policy "users can update their own profile" on profiles
  for update using (id = auth.uid());

drop policy if exists "studio members can read their games" on games;
create policy "studio members can read their games" on games
  for select using (
    studio_id in (select studio_id from profiles where profiles.id = auth.uid())
  );

drop policy if exists "studio members can insert their games" on games;
create policy "studio members can insert their games" on games
  for insert with check (
    studio_id in (select studio_id from profiles where profiles.id = auth.uid())
  );

drop policy if exists "studio members can update their games" on games;
create policy "studio members can update their games" on games
  for update using (
    studio_id in (select studio_id from profiles where profiles.id = auth.uid())
  );

drop policy if exists "studio members can delete their games" on games;
create policy "studio members can delete their games" on games
  for delete using (
    studio_id in (select studio_id from profiles where profiles.id = auth.uid())
  );

drop policy if exists "studio members can read their game metrics" on game_metrics;
create policy "studio members can read their game metrics" on game_metrics
  for select using (
    exists (
      select 1 from games
      where games.id = game_metrics.game_id
        and games.studio_id in (select studio_id from profiles where profiles.id = auth.uid())
    )
  );
