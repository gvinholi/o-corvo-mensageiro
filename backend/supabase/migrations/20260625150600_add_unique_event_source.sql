create unique index if not exists events_event_type_source_id_unique
  on events (event_type, source_id);
