import { useCallback, useEffect, useState } from "react";
import { getEventById, updateEventStatus } from "../services/events.service";
import type { Event, EventInternalStatus } from "../types/event";

interface UseEventState {
  event: Event | null;
  loading: boolean;
  updatingStatus: boolean;
  error: string | null;
}

const initialState: UseEventState = {
  event: null,
  loading: true,
  updatingStatus: false,
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
          updatingStatus: false,
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
          updatingStatus: false,
          error: null,
        });
      } catch (error) {
        if (signal?.aborted) {
          return;
        }

        setState({
          event: null,
          loading: false,
          updatingStatus: false,
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
        updatingStatus: false,
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

  const changeStatus = useCallback(
    async (status: EventInternalStatus) => {
      if (!id) {
        setState((currentState) => ({
          ...currentState,
          error: "ID do evento não informado.",
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        updatingStatus: true,
        error: null,
      }));

      try {
        const updatedEvent = await updateEventStatus(id, status);

        setState({
          event: updatedEvent,
          loading: false,
          updatingStatus: false,
          error: null,
        });
      } catch (error) {
        setState((currentState) => ({
          ...currentState,
          updatingStatus: false,
          error:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao atualizar status.",
        }));
      }
    },
    [id]
  );

  return {
    ...state,
    refetch: () => fetchEvent(),
    changeStatus,
  };
}
