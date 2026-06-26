import { useState } from "react";
import { EventTimeline } from "../components/EventTimeline";
import { FilterBar } from "../components/FilterBar";
import { IndicatorCard } from "../components/IndicatorCard";
import { useEvents } from "../hooks/useEvents";
import { buildOperationMetrics } from "../utils/dashboardMetrics";
import { filterEventsByType } from "../utils/eventGroups";
import type { EventFilter } from "../utils/eventGroups";

const nextSections = [
  "Histórico de eventos",
  "Auditoria de notificações",
  "Status dos serviços",
  "Configurações dos monitores",
];

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const { events, loading, error } = useEvents({ limit: 100 });
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
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          Não foi possível carregar os indicadores: {error}
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

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Próximas telas</h3>
          <ul className="mt-5 space-y-3">
            {nextSections.map((section) => (
              <li
                key={section}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300"
              >
                {section}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
