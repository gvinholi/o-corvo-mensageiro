import { useEffect, useState } from "react";
import { getHealthStatus } from "../services/health.service";
import type { ServiceStatus } from "../types/health";

const HEALTH_REFRESH_INTERVAL_MS = 30000;

interface UseHealthStatusState {
  services: ServiceStatus[];
  loading: boolean;
  error: string | null;
}

const buildOfflineServices = (lastUpdated: string | null): ServiceStatus[] => [
  { key: "backend", name: "Backend", online: false, lastUpdated },
  { key: "supabase", name: "Supabase", online: false, lastUpdated },
  { key: "mercadolivre", name: "Mercado Livre", online: false, lastUpdated },
  { key: "telegram", name: "Telegram", online: false, lastUpdated },
];

const initialState: UseHealthStatusState = {
  services: buildOfflineServices(null),
  loading: true,
  error: null,
};

export function useHealthStatus() {
  const [state, setState] = useState<UseHealthStatusState>(initialState);

  useEffect(() => {
    let timeoutId: number | undefined;
    let abortController: AbortController | null = null;

    async function fetchHealthStatus() {
      abortController?.abort();
      abortController = new AbortController();

      setState((currentState) => ({
        ...currentState,
        loading: true,
        error: null,
      }));

      const lastUpdated = new Date().toISOString();

      try {
        const health = await getHealthStatus(abortController.signal);

        setState({
          services: [
            { key: "backend", name: "Backend", online: true, lastUpdated },
            {
              key: "supabase",
              name: "Supabase",
              online: health.services.supabase,
              lastUpdated,
            },
            {
              key: "mercadolivre",
              name: "Mercado Livre",
              online: health.services.mercadolivre,
              lastUpdated,
            },
            {
              key: "telegram",
              name: "Telegram",
              online: health.services.telegram,
              lastUpdated,
            },
          ],
          loading: false,
          error: null,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setState({
          services: buildOfflineServices(lastUpdated),
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao consultar healthcheck.",
        });
      } finally {
        timeoutId = window.setTimeout(
          fetchHealthStatus,
          HEALTH_REFRESH_INTERVAL_MS
        );
      }
    }

    fetchHealthStatus();

    return () => {
      abortController?.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return state;
}
