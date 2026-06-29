import type { Event } from "../types/event";
import { EventCard } from "./EventCard";
import { Skeleton } from "./Skeleton";

interface EventListProps {
  events: Event[];
  loading?: boolean;
  loadingMore?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

function EventListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
        >
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function EventList({
  events,
  loading = false,
  loadingMore = false,
  error = null,
  hasMore = false,
  onLoadMore,
}: EventListProps) {
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (loading) {
    return <EventListSkeleton />;
  }

  if (error && !sortedEvents.length) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-6 text-sm text-red-200">
        <p className="font-semibold">Não foi possível carregar os eventos.</p>
        <p className="mt-1 text-red-200/80">{error}</p>
      </div>
    );
  }

  if (!sortedEvents.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-5 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
          i
        </div>
        <p className="mt-4 text-sm font-medium text-slate-300">
          Nenhum evento cadastrado
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Os eventos registrados pelos monitores aparecerão nesta lista.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          <p className="font-semibold">Falha ao atualizar eventos.</p>
          <p className="mt-1 text-red-200/80">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {loadingMore && (
        <div className="mt-4">
          <EventListSkeleton />
        </div>
      )}

      <div className="mt-6 flex justify-center">
        {hasMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Carregando..." : "Carregar mais"}
          </button>
        ) : (
          <p className="text-sm text-slate-500">Todos os eventos carregados.</p>
        )}
      </div>
    </div>
  );
}
