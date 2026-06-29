alter table events
  add column if not exists in_progress_at timestamp;
