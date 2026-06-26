import { useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
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
  const {
    events,
    loading,
    loadingMore,
    refreshing,
    total,
    lastSyncedAt,
    hasMore,
    error,
    loadMore,
  } = useEvents({ limit: 100 });
  const {
    services,
    loading: healthLoading,
    error: healthError,
  } = useHealthStatus();
  const operationMetrics = buildOperationMetrics(events);
  const filteredEvents = filterEventsByType(events, activeFilter);

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardHeader
        totalEvents={total}
        lastSyncedAt={lastSyncedAt}
        loading={loading}
        refreshing={refreshing}
      />

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

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <EventTimeline
            events={filteredEvents}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>

        <HealthStatusPanel
          services={services}
          loading={healthLoading}
          error={healthError}
        />
      </section>
    </div>
  );
}
