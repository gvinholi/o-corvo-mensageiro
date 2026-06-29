import type { ServiceStatus } from "../types/health";
import { formatTimeBR } from "../utils/dateTime";
import { Skeleton } from "./Skeleton";

interface HealthStatusPanelProps {
  services: ServiceStatus[];
  loading?: boolean;
  error?: string | null;
}

const formatLastUpdated = (lastUpdated: string | null) => {
  if (!lastUpdated) {
    return "aguardando";
  }

  return formatTimeBR(lastUpdated);
};

export function HealthStatusPanel({
  services,
  loading = false,
  error = null,
}: HealthStatusPanelProps) {
  const isInitialLoading = loading && services.every((service) => !service.lastUpdated);

  return (
    <article className="animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Observabilidade
          </h3>
        </div>

        {loading && (
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
            verificando
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Não foi possível consultar o healthcheck: {error}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {isInitialLoading
          ? [0, 1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="w-full">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-3 h-3 w-40" />
                  </div>
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>
            ))
          : services.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-4 transition duration-200 hover:border-slate-700"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {service.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Última atualização:{" "}
                      {formatLastUpdated(service.lastUpdated)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "h-2.5 w-2.5 rounded-full",
                        service.online ? "bg-emerald-400" : "bg-red-400",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        service.online
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-red-500/10 text-red-300",
                      ].join(" ")}
                    >
                      {service.online ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </article>
  );
}
