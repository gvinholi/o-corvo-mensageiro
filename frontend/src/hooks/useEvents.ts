import { useEffect, useState } from "react";
import { getEvents } from "../services/events.service";
import type {
  Event,
  GetEventsParams,
  PaginatedEventsResponse,
} from "../types/event";

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
    const abortController = new AbortController();

    async function fetchEvents() {
      setState((currentState) => ({
        ...currentState,
        loading: true,
        error: null,
      }));

      try {
        const response = await getEvents(params, abortController.signal);

        setState({
          ...mapResponseToState(response),
          loading: false,
          error: null,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
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
      }
    }

    fetchEvents();

    return () => {
      abortController.abort();
    };
  }, [params.page, params.limit]);

  return state;
}
