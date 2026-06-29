import { apiRequest } from "./api";
import type {
  Event,
  EventInternalStatus,
  GetEventsParams,
  PaginatedEventsResponse,
} from "../types/event";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;

export async function getEvents(
  params: GetEventsParams = {},
  signal?: AbortSignal
): Promise<PaginatedEventsResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? DEFAULT_PAGE),
    limit: String(params.limit ?? DEFAULT_LIMIT),
  });

  return apiRequest<PaginatedEventsResponse>(
    `/api/events?${searchParams.toString()}`,
    { signal }
  );
}

export async function getEventById(
  id: string,
  signal?: AbortSignal
): Promise<Event> {
  return apiRequest<Event>(`/api/events/${id}`, { signal });
}

export async function updateEventStatus(
  id: string,
  status: EventInternalStatus
): Promise<Event> {
  return apiRequest<Event>(`/api/events/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
