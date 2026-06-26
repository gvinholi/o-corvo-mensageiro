import { useCallback, useEffect, useRef, useState } from "react";
import { getEvents } from "../services/events.service";
import type {
  Event,
  GetEventsParams,
} from "../types/event";

const EVENTS_REFRESH_INTERVAL_MS = 30000;

interface UseEventsState {
  events: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  lastSyncedAt: string | null;
}

const initialState: UseEventsState = {
  events: [],
  page: 1,
  limit: 50,
  total: 0,
  totalPages: 0,
  loading: true,
  loadingMore: false,
  refreshing: false,
  error: null,
  lastSyncedAt: null,
};

const mergeUniqueEvents = (currentEvents: Event[], newEvents: Event[]) => {
  const eventsById = new Map<string, Event>();

  [...currentEvents, ...newEvents].forEach((event) => {
    eventsById.set(event.id, event);
  });

  return Array.from(eventsById.values()).sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export function useEvents(params: GetEventsParams = {}) {
  const [state, setState] = useState<UseEventsState>(initialState);
  const isMountedRef = useRef(false);
  const inFlightRef = useRef(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const abortControllersRef = useRef<Set<AbortController>>(new Set());

  const limit = params.limit ?? 50;

  const fetchPage = useCallback(
    async (page: number, mode: "refresh" | "append") => {
      if (inFlightRef.current) {
        return;
      }

      inFlightRef.current = true;

      const abortController = new AbortController();
      abortControllersRef.current.add(abortController);

      setState((currentState) => ({
        ...currentState,
        loading:
          mode === "refresh" &&
          currentState.events.length === 0 &&
          currentState.page === 1,
        refreshing: mode === "refresh" && currentState.events.length > 0,
        loadingMore: mode === "append",
        error: null,
      }));

      try {
        const response = await getEvents(
          {
            page,
            limit,
          },
          abortController.signal
        );

        if (!isMountedRef.current) {
          return;
        }

        setState((currentState) => {
          const events =
            mode === "append"
              ? mergeUniqueEvents(currentState.events, response.data)
              : mergeUniqueEvents(response.data, currentState.events);

          return {
            events,
            page: Math.max(currentState.page, response.page),
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages,
            loading: false,
            loadingMore: false,
            refreshing: false,
            error: null,
            lastSyncedAt: new Date().toISOString(),
          };
        });
      } catch (error) {
        if (!isMountedRef.current || abortController.signal.aborted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          loading: false,
          loadingMore: false,
          refreshing: false,
          error:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao buscar eventos.",
        }));
      } finally {
        inFlightRef.current = false;
        abortControllersRef.current.delete(abortController);
      }
    },
    [limit]
  );

  useEffect(() => {
    isMountedRef.current = true;
    setState(initialState);

    async function refreshEvents() {
      await fetchPage(1, "refresh");

      if (isMountedRef.current) {
        timeoutRef.current = window.setTimeout(
          refreshEvents,
          EVENTS_REFRESH_INTERVAL_MS
        );
      }
    }

    refreshEvents();

    return () => {
      isMountedRef.current = false;
      window.clearTimeout(timeoutRef.current);
      abortControllersRef.current.forEach((abortController) =>
        abortController.abort()
      );
      abortControllersRef.current.clear();
      inFlightRef.current = false;
    };
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (state.loading || state.loadingMore || state.page >= state.totalPages) {
      return;
    }

    await fetchPage(state.page + 1, "append");
  }, [fetchPage, state.loading, state.loadingMore, state.page, state.totalPages]);

  return {
    ...state,
    hasMore: state.page < state.totalPages,
    loadMore,
  };
}
