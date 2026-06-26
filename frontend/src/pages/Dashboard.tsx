const summaryCards = [
  {
    label: "Marketplaces",
    value: "1",
    description: "Mercado Livre conectado ao monitoramento",
  },
  {
    label: "Canal de alerta",
    value: "Telegram",
    description: "Notificações operacionais para a equipe",
  },
  {
    label: "Banco de dados",
    value: "Supabase",
    description: "Eventos e estados persistidos",
  },
];

const nextSections = [
  "Histórico de eventos",
  "Auditoria de notificações",
  "Status dos serviços",
  "Configurações dos monitores",
];

export function Dashboard() {
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

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <p className="text-sm text-slate-400">{card.label}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {card.value}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">
            Área preparada para métricas
          </h3>
          <div className="mt-6 flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 text-center">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Gráficos e indicadores entram aqui
              </p>
              <p className="mt-2 text-sm text-slate-500">
                A estrutura visual já está pronta para receber dados reais.
              </p>
            </div>
          </div>
        </article>

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
