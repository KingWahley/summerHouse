
-- Enable RLS
alter table profiles enable row level security;
alter table listings enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users manage own profile"
on profiles for all
using (auth.uid() = id);

-- Listings: only owners/agents create
create policy "Agents create listings"
on listings for insert
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role in ('agent','owner')
  )
);

-- Listings: public read
create policy "Public read listings"
on listings for select
using (true);
