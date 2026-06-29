const filterPlaceholders = [
  "Tipo de evento",
  "Período",
  "Origem",
  "Status",
];

export function EventsPage() {
  return (
    <div className="space-y-6">
      <section className="animate-fade-in-up rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/20 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
          Central de Eventos
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Eventos do O Corvo Mensageiro
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
          Área operacional para consultar, filtrar e acompanhar todos os eventos
          registrados pelos monitores da Love Eletro.
        </p>
      </section>

      <section className="animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Histórico de eventos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Listagem preparada para receber eventos paginados, filtros e busca.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-300"
            >
              Exportar
            </button>
            <button
              type="button"
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Atualizar lista
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.6fr]">
        <aside className="animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-base font-semibold text-white">Filtros</h3>
          <p className="mt-1 text-sm text-slate-500">
            Controles visuais reservados para a próxima etapa.
          </p>

          <div className="mt-5 space-y-3">
            {filterPlaceholders.map((filter) => (
              <div
                key={filter}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-300">{filter}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Ainda sem lógica aplicada
                </p>
              </div>
            ))}
          </div>
        </aside>

        <section className="animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Listagem
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Espaço reservado para cards, tabela ou timeline detalhada.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              i
            </div>
            <p className="mt-4 text-sm font-medium text-slate-300">
              Listagem de eventos será conectada aqui
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Esta página já está estruturada para receber a consulta real dos
              eventos.
            </p>
          </div>
        </section>
      </section>
    </div>
  );
}
