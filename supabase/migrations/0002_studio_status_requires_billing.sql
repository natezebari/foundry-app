-- Patch for anyone who already ran 0001: new studios should require a
-- completed Stripe checkout before they count as 'trialing'. Without this,
-- the dashboard layout gate treats every fresh signup as already trialing
-- and skips the billing step entirely.
-- Run this once in the Supabase SQL Editor.

alter table studios drop constraint if exists studios_subscription_status_check;
alter table studios add constraint studios_subscription_status_check
  check (subscription_status in ('incomplete', 'trialing', 'active', 'past_due', 'canceled'));

alter table studios alter column subscription_status set default 'incomplete';

-- Any studio that hasn't actually completed Stripe checkout yet (no
-- subscription id on file) shouldn't be sitting in 'trialing'.
update studios
set subscription_status = 'incomplete'
where subscription_status = 'trialing' and stripe_subscription_id is null;

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
