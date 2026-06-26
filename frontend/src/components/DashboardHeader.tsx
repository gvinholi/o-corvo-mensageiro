interface DashboardHeaderProps {
  totalEvents: number;
  lastSyncedAt: string | null;
  loading?: boolean;
  refreshing?: boolean;
}

const formatLastSyncedAt = (lastSyncedAt: string | null) => {
  if (!lastSyncedAt) {
    return "aguardando primeira sincronização";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(lastSyncedAt));
};

export function DashboardHeader({
  totalEvents,
  lastSyncedAt,
  loading = false,
  refreshing = false,
}: DashboardHeaderProps) {
  return (
    <section className="animate-fade-in-up grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/30 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
              Love Eletro
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              O Corvo Mensageiro
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
              Dashboard administrativo para acompanhar eventos, notificações e
              saúde das integrações operacionais da loja.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/30">
          <p className="text-sm text-slate-500">Total de eventos</p>
          <p className="mt-3 text-4xl font-bold text-white">
            {loading ? "..." : totalEvents}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Eventos registrados no histórico
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/30">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Última sincronização</p>
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                refreshing ? "bg-sky-400" : "bg-emerald-400",
              ].join(" ")}
            />
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-200">
            {refreshing ? "sincronizando..." : formatLastSyncedAt(lastSyncedAt)}
          </p>
        </div>
      </div>
    </section>
  );
}
