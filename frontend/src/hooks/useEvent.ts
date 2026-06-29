import { useCallback, useEffect, useState } from "react";
import { getEventById } from "../services/events.service";
import type { Event } from "../types/event";

interface UseEventState {
  event: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: UseEventState = {
  event: null,
  loading: true,
  error: null,
};

export function useEvent(id: string | undefined) {
  const [state, setState] = useState<UseEventState>(initialState);

  const fetchEvent = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) {
        setState({
          event: null,
          loading: false,
          error: "ID do evento não informado.",
        });
        return;
      }

      setState((currentState) => ({
        ...currentState,
        loading: true,
        error: null,
      }));

      try {
        const event = await getEventById(id, signal);

        setState({
          event,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (signal?.aborted) {
          return;
        }

        setState({
          event: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao buscar evento.",
        });
      }
    },
    [id]
  );

  useEffect(() => {
    if (!id) {
      setState({
        event: null,
        loading: false,
        error: "ID do evento não informado.",
      });
      return;
    }

    const abortController = new AbortController();

    fetchEvent(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchEvent, id]);

  return {
    ...state,
    refetch: () => fetchEvent(),
  };
}
