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
  { key: "redis", name: "Redis", online: false, lastUpdated },
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
    let isMounted = true;
    let timeoutId: number | undefined;
    let abortController: AbortController | null = null;

    async function fetchHealthStatus() {
      abortController = new AbortController();

      setState((currentState) => ({
        ...currentState,
        loading: currentState.services.every((service) => !service.lastUpdated),
        error: null,
      }));

      const lastUpdated = new Date().toISOString();

      try {
        const health = await getHealthStatus(abortController.signal);

        if (!isMounted) {
          return;
        }

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
              key: "redis",
              name: "Redis",
              online: health.services.redis,
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
        if (!isMounted || abortController.signal.aborted) {
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
        if (isMounted) {
          timeoutId = window.setTimeout(
            fetchHealthStatus,
            HEALTH_REFRESH_INTERVAL_MS
          );
        }
      }
    }

    fetchHealthStatus();

    return () => {
      isMounted = false;
      abortController?.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return state;
}
