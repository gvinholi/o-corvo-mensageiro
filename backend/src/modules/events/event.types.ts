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
  page?: number;
  limit?: number;
}

export interface PaginatedEvents {
  data: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventRepository {
  createEvent(input: CreateEventInput): Promise<Event>;
  getEvents(filters?: GetEventsFilters): Promise<PaginatedEvents>;
  getEventById(id: string): Promise<Event | null>;
}
