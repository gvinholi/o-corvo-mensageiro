create table if not exists telegram_notifications (
  id uuid primary key,
  event_id uuid references events(id),
  message text not null,
  sent_at timestamp default now()
);
