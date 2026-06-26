import { Skeleton } from "./Skeleton";

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
    <article className="animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/20 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {loading ? (
            <Skeleton className="mt-4 h-9 w-20" />
          ) : (
            <h2 className="mt-3 text-3xl font-bold text-white">{quantity}</h2>
          )}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-2xl text-sky-300 ring-1 ring-sky-500/20">
          {icon}
        </div>
      </div>

      <div className="mt-5 text-sm text-slate-500">
        <span>Última atualização: </span>
        {loading ? (
          <Skeleton className="mt-2 h-4 w-28" />
        ) : (
          <span className="font-medium text-slate-300">{lastUpdated}</span>
        )}
      </div>
    </article>
  );
}
