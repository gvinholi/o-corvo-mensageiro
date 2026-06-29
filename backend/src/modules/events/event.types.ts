export type EventType =
  | "QUESTION_CREATED"
  | "ORDER_CREATED"
  | "MESSAGE_CREATED"
  | "CLAIM_CREATED"
  | "CANCELLATION_CREATED"
  | "question"
  | "order"
  | "message"
  | "claim"
  | "cancellation";

export type EventPayload = Record<string, unknown> | null;

export type EventInternalStatus =
  | "not_viewed"
  | "viewed"
  | "resolved"
  | "archived";

export interface Event {
  id: string;
  event_type: EventType;
  source_id: string;
  payload: EventPayload;
  created_at: string;
  viewed_at: string | null;
  resolved_at: string | null;
  archived_at: string | null;
  internal_status: EventInternalStatus;
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

export interface UpdateEventStatusInput {
  status: EventInternalStatus;
}

export interface EventRepository {
  createEvent(input: CreateEventInput): Promise<Event>;
  getEvents(filters?: GetEventsFilters): Promise<PaginatedEvents>;
  getEventById(id: string): Promise<Event | null>;
  updateEventStatus(
    id: string,
    input: UpdateEventStatusInput
  ): Promise<Event | null>;
}
