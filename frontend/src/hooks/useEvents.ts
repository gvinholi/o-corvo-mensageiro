import { useEffect, useState } from "react";
import { getEvents } from "../services/events.service";
import type {
  Event,
  GetEventsParams,
  PaginatedEventsResponse,
} from "../types/event";

const EVENTS_REFRESH_INTERVAL_MS = 30000;

interface UseEventsState {
  events: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: UseEventsState = {
  events: [],
  page: 1,
  limit: 50,
  total: 0,
  totalPages: 0,
  loading: true,
  error: null,
};

const mapResponseToState = (
  response: PaginatedEventsResponse
): Omit<UseEventsState, "loading" | "error"> => ({
  events: response.data,
  page: response.page,
  limit: response.limit,
  total: response.total,
  totalPages: response.totalPages,
});

export function useEvents(params: GetEventsParams = {}) {
  const [state, setState] = useState<UseEventsState>(initialState);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | undefined;
    let abortController: AbortController | null = null;

    async function fetchEvents() {
      abortController = new AbortController();

      setState((currentState) => ({
        ...currentState,
        loading: currentState.events.length === 0,
        error: null,
      }));

      try {
        const response = await getEvents(params, abortController.signal);

        if (!isMounted) {
          return;
        }

        setState({
          ...mapResponseToState(response),
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!isMounted || abortController.signal.aborted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao buscar eventos.",
        }));
      } finally {
        if (isMounted) {
          timeoutId = window.setTimeout(
            fetchEvents,
            EVENTS_REFRESH_INTERVAL_MS
          );
        }
      }
    }

    fetchEvents();

    return () => {
      isMounted = false;
      abortController?.abort();
      window.clearTimeout(timeoutId);
    };
  }, [params.page, params.limit]);

  return state;
}
