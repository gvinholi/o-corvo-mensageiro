interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
        Em breve
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-400">{description}</p>
    </section>
  );
}
