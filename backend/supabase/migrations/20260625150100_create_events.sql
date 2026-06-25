create table if not exists events (
  id uuid primary key,
  event_type text not null,
  source_id text not null,
  payload jsonb,
  created_at timestamp default now()
);
