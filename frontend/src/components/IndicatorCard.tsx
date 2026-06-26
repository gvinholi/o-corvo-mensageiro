interface IndicatorCardProps {
  title: string;
  quantity: number;
  icon: string;
  lastUpdated: string;
  loading?: boolean;
}

export function IndicatorCard({
  title,
  quantity,
  icon,
  lastUpdated,
  loading = false,
}: IndicatorCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            {loading ? "..." : quantity}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-2xl">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        Última atualização:{" "}
        <span className="font-medium text-slate-300">
          {loading ? "carregando..." : lastUpdated}
        </span>
      </p>
    </article>
  );
}
