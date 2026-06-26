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
