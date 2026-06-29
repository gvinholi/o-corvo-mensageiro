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
  | "in_progress"
  | "resolved"
  | "archived";

export interface Event {
  id: string;
  event_type: EventType;
  source_id: string;
  payload: EventPayload;
  created_at: string;
  internal_status?: EventInternalStatus;
}

export interface PaginatedEventsResponse {
  data: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
}
