import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!id) {
      setState({
        event: null,
        loading: false,
        error: "ID do evento não informado.",
      });
      return;
    }

    const eventId = id;
    const abortController = new AbortController();

    async function fetchEvent() {
      setState({
        event: null,
        loading: true,
        error: null,
      });

      try {
        const event = await getEventById(eventId, abortController.signal);

        setState({
          event,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
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
    }

    fetchEvent();

    return () => {
      abortController.abort();
    };
  }, [id]);

  return state;
}
