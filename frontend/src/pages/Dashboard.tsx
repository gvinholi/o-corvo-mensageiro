import { useState } from "react";
import { EventTimeline } from "../components/EventTimeline";
import { FilterBar } from "../components/FilterBar";
import { HealthStatusPanel } from "../components/HealthStatusPanel";
import { IndicatorCard } from "../components/IndicatorCard";
import { useEvents } from "../hooks/useEvents";
import { useHealthStatus } from "../hooks/useHealthStatus";
import { buildOperationMetrics } from "../utils/dashboardMetrics";
import { filterEventsByType } from "../utils/eventGroups";
import type { EventFilter } from "../utils/eventGroups";

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const { events, loading, error } = useEvents({ limit: 100 });
  const {
    services,
    loading: healthLoading,
    error: healthError,
  } = useHealthStatus();
  const operationMetrics = buildOperationMetrics(events);
  const filteredEvents = filterEventsByType(events, activeFilter);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
            Visão geral
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Painel administrativo do Corvo Mensageiro
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Acompanhe a operação da Love Eletro com uma base preparada para
            eventos, notificações e indicadores dos canais integrados.
          </p>
        </div>
      </section>

      {error && (
        <div className="animate-fade-in-up rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200 shadow-lg shadow-red-950/20">
          <p className="font-semibold">Não foi possível carregar os eventos.</p>
          <p className="mt-1 text-red-200/80">{error}</p>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {operationMetrics.map((metric) => (
          <IndicatorCard
            key={metric.key}
            title={metric.title}
            quantity={metric.quantity}
            icon={metric.icon}
            lastUpdated={metric.lastUpdated}
            loading={loading}
          />
        ))}
      </section>

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <EventTimeline events={filteredEvents} loading={loading} />

        <HealthStatusPanel
          services={services}
          loading={healthLoading}
          error={healthError}
        />
      </section>
    </div>
  );
}
