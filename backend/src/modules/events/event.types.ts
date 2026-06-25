export type EventType =
  | "QUESTION_CREATED"
  | "question"
  | "order"
  | "message"
  | "claim";

export type EventPayload = Record<string, unknown> | null;

export interface Event {
  id: string;
  event_type: EventType;
  source_id: string;
  payload: EventPayload;
  created_at: string;
}

export interface CreateEventInput {
  event_type: EventType;
  source_id: string;
  payload?: EventPayload;
}

export interface GetEventsFilters {
  event_type?: EventType;
  source_id?: string;
  limit?: number;
}

export interface EventRepository {
  createEvent(input: CreateEventInput): Promise<Event>;
  getEvents(filters?: GetEventsFilters): Promise<Event[]>;
}
