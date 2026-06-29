alter table events
  add column if not exists viewed_at timestamp,
  add column if not exists resolved_at timestamp,
  add column if not exists archived_at timestamp;
