import { Link } from "react-router-dom";
import type {
  Event,
  EventInternalStatus,
  EventPayload,
  EventType,
} from "../types/event";

interface EventCardProps {
  event: Event;
}

const eventTypeLabels: Record<EventType, string> = {
  QUESTION_CREATED: "Pergunta",
  ORDER_CREATED: "Pedido",
  MESSAGE_CREATED: "Mensagem",
  CLAIM_CREATED: "Reclamação",
  CANCELLATION_CREATED: "Cancelamento",
  question: "Pergunta",
  order: "Pedido",
  message: "Mensagem",
  claim: "Reclamação",
  cancellation: "Cancelamento",
};

const eventTypeClasses: Record<EventType, string> = {
  QUESTION_CREATED: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  ORDER_CREATED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  MESSAGE_CREATED: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  CLAIM_CREATED: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  CANCELLATION_CREATED: "border-red-500/30 bg-red-500/10 text-red-300",
  question: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  order: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  message: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  claim: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  cancellation: "border-red-500/30 bg-red-500/10 text-red-300",
};

const internalStatusLabels: Record<EventInternalStatus, string> = {
  not_viewed: "Não visualizado",
  viewed: "Visualizado",
  in_progress: "Em andamento",
  resolved: "Resolvido",
  archived: "Arquivado",
};

const internalStatusClasses: Record<EventInternalStatus, string> = {
  not_viewed: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  viewed: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  in_progress: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  resolved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  archived: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

const getPayloadText = (payload: EventPayload) => {
  if (!payload) {
    return null;
  }

  const text = payload.text ?? payload.message ?? payload.description;

  return typeof text === "string" ? text : null;
};

const getEventDescription = (event: Event) => {
  const payloadText = getPayloadText(event.payload);

  if (payloadText) {
    return payloadText.length > 140
      ? `${payloadText.slice(0, 140).trim()}...`
      : payloadText;
  }

  return `Evento ${event.source_id} registrado no sistema.`;
};

const formatEventDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(date));

const formatEventTime = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeStyle: "short",
  }).format(new Date(date));

export function EventCard({ event }: EventCardProps) {
  const internalStatus = event.internal_status ?? "not_viewed";

  return (
    <Link
      to={`/events/${event.id}`}
      className="block rounded-2xl border border-slate-800 bg-slate-950 p-4 transition duration-200 hover:border-slate-700 hover:bg-slate-950/80"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                eventTypeClasses[event.event_type],
              ].join(" ")}
            >
              {eventTypeLabels[event.event_type]}
            </span>
            <span className="text-xs text-slate-600">
              Origem: {event.source_id}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {getEventDescription(event)}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:items-end">
          <span
            className={[
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
              internalStatusClasses[internalStatus],
            ].join(" ")}
          >
            {internalStatusLabels[internalStatus]}
          </span>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400">
            <p>{formatEventDate(event.created_at)}</p>
            <p className="mt-1 font-medium text-slate-200">
              {formatEventTime(event.created_at)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
