import type { Event, EventPayload, EventType } from "../types/event";

interface EventTimelineProps {
  events: Event[];
  loading?: boolean;
}

interface EventTimelineStyle {
  icon: string;
  label: string;
  badgeClassName: string;
  dotClassName: string;
}

const eventStyles: Record<EventType, EventTimelineStyle> = {
  QUESTION_CREATED: {
    icon: "?",
    label: "Pergunta",
    badgeClassName: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    dotClassName: "bg-sky-400",
  },
  ORDER_CREATED: {
    icon: "#",
    label: "Pedido",
    badgeClassName: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    dotClassName: "bg-emerald-400",
  },
  MESSAGE_CREATED: {
    icon: "@",
    label: "Mensagem",
    badgeClassName: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    dotClassName: "bg-violet-400",
  },
  CLAIM_CREATED: {
    icon: "!",
    label: "Reclamação",
    badgeClassName: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    dotClassName: "bg-amber-400",
  },
  CANCELLATION_CREATED: {
    icon: "x",
    label: "Cancelamento",
    badgeClassName: "border-red-500/30 bg-red-500/10 text-red-300",
    dotClassName: "bg-red-400",
  },
  question: {
    icon: "?",
    label: "Pergunta",
    badgeClassName: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    dotClassName: "bg-sky-400",
  },
  order: {
    icon: "#",
    label: "Pedido",
    badgeClassName: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    dotClassName: "bg-emerald-400",
  },
  message: {
    icon: "@",
    label: "Mensagem",
    badgeClassName: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    dotClassName: "bg-violet-400",
  },
  claim: {
    icon: "!",
    label: "Reclamação",
    badgeClassName: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    dotClassName: "bg-amber-400",
  },
  cancellation: {
    icon: "x",
    label: "Cancelamento",
    badgeClassName: "border-red-500/30 bg-red-500/10 text-red-300",
    dotClassName: "bg-red-400",
  },
};

const formatEventTime = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));

const getPayloadText = (payload: EventPayload) => {
  if (!payload) {
    return null;
  }

  const possibleText = payload.text ?? payload.message ?? payload.description;

  return typeof possibleText === "string" ? possibleText : null;
};

const getEventDescription = (event: Event) => {
  const payloadText = getPayloadText(event.payload);

  if (payloadText) {
    return payloadText;
  }

  return `Evento ${event.source_id} registrado no sistema.`;
};

export function EventTimeline({ events, loading = false }: EventTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">Timeline de eventos</h3>
        <p className="mt-4 text-sm text-slate-400">Carregando eventos...</p>
      </div>
    );
  }

  if (!sortedEvents.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">Timeline de eventos</h3>
        <p className="mt-4 text-sm text-slate-400">
          Nenhum evento registrado até o momento.
        </p>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Timeline de eventos
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Log operacional em ordem do mais recente para o mais antigo.
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-5">
        {sortedEvents.map((event) => {
          const style = eventStyles[event.event_type];

          return (
            <li key={event.id} className="relative pl-10">
              <span
                className={[
                  "absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-slate-950",
                  style.dotClassName,
                ].join(" ")}
              >
                {style.icon}
              </span>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span
                      className={[
                        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                        style.badgeClassName,
                      ].join(" ")}
                    >
                      {style.label}
                    </span>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {getEventDescription(event)}
                    </p>
                  </div>

                  <time
                    className="whitespace-nowrap text-sm text-slate-500"
                    dateTime={event.created_at}
                  >
                    {formatEventTime(event.created_at)}
                  </time>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
