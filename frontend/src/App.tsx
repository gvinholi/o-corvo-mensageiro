function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-400">
            Projeto Fullstack
          </p>
          <h1 className="mt-2 text-4xl font-bold">O Corvo Mensageiro</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Dashboard de monitoramento de notificações para marketplaces, começando pelo Mercado Livre.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Marketplaces</p>
            <h2 className="mt-2 text-3xl font-semibold">1</h2>
            <p className="mt-2 text-sm text-slate-500">Mercado Livre em implantação</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Empresas</p>
            <h2 className="mt-2 text-3xl font-semibold">1</h2>
            <p className="mt-2 text-sm text-slate-500">Love Eletro</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <h2 className="mt-2 text-3xl font-semibold text-emerald-400">Base pronta</h2>
            <p className="mt-2 text-sm text-slate-500">Frontend e backend iniciados</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">Próximas etapas</h3>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>Integrar backend Express com Mercado Livre</li>
            <li>Persistir eventos no Supabase</li>
            <li>Enviar alertas para o Telegram</li>
            <li>Exibir eventos reais no dashboard</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;