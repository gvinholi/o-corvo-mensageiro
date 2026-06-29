import { Link, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import type { Event, EventInternalStatus, EventPayload } from "../types/event";

const statusLabels: Record<EventInternalStatus, string> = {
  not_viewed: "Não visualizado",
  viewed: "Visualizado",
  in_progress: "Em andamento",
  resolved: "Resolvido",
  archived: "Arquivado",
};

const statusClasses: Record<EventInternalStatus, string> = {
  not_viewed: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  viewed: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  in_progress: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  resolved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  archived: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(date));

const formatTime = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeStyle: "medium",
  }).format(new Date(date));

const getPayloadValue = (payload: EventPayload, key: string) => {
  if (!payload || !(key in payload)) {
    return "Não informado";
  }

  const value = payload[key];

  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const getMercadoLivreUrl = (event: Event) => {
  const itemId = getPayloadValue(event.payload, "item_id");
  const orderId = getPayloadValue(event.payload, "order_id");

  if (itemId !== "Não informado") {
    return `https://www.mercadolivre.com.br/anuncios/${itemId}`;
  }

  if (orderId !== "Não informado") {
    return `https://www.mercadolivre.com.br/vendas/${orderId}/detalhe`;
  }

  return null;
};

const copyToClipboard = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

function QuickActions({
  event,
  onRefresh,
}: {
  event: Event;
  onRefresh: () => void;
}) {
  const mercadoLivreUrl = getMercadoLivreUrl(event);
  const currentUrl = window.location.href;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">Ações rápidas</h2>
      <p className="mt-2 text-sm text-slate-500">
        Atalhos preparados para futuras automações operacionais.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href={mercadoLivreUrl ?? undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!mercadoLivreUrl}
          className={[
            "rounded-xl border px-4 py-3 text-center text-sm font-medium transition",
            mercadoLivreUrl
              ? "border-slate-700 bg-slate-950 text-slate-200 hover:border-sky-500 hover:text-white"
              : "pointer-events-none border-slate-800 bg-slate-950 text-slate-600",
          ].join(" ")}
        >
          Abrir no Mercado Livre
        </a>

        <button
          type="button"
          onClick={() => copyToClipboard(event.id)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
        >
          Copiar ID
        </button>

        <button
          type="button"
          onClick={() => copyToClipboard(currentUrl)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
        >
          Copiar Link
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Atualizar
        </button>
      </div>
    </section>
  );
}

const statusActionOptions: Array<{
  label: string;
  status: EventInternalStatus;
}> = [
  { label: "Visualizado", status: "viewed" },
  { label: "Em andamento", status: "in_progress" },
  { label: "Resolvido", status: "resolved" },
  { label: "Arquivado", status: "archived" },
];

function StatusActions({
  currentStatus,
  updating,
  onChangeStatus,
}: {
  currentStatus: EventInternalStatus;
  updating: boolean;
  onChangeStatus: (status: EventInternalStatus) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">Status interno</h2>
      <p className="mt-2 text-sm text-slate-500">
        Atualize o ciclo de trabalho deste evento.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statusActionOptions.map((option) => {
          const isActive = currentStatus === option.status;

          return (
            <button
              key={option.status}
              type="button"
              onClick={() => onChangeStatus(option.status)}
              disabled={updating || isActive}
              className={[
                "rounded-xl border px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                isActive
                  ? "border-sky-500 bg-sky-500/10 text-sky-200"
                  : "border-slate-700 bg-slate-950 text-slate-200 hover:border-sky-500 hover:text-white",
              ].join(" ")}
            >
              {updating && !isActive ? "Atualizando..." : option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MercadoLivreInfo({ event }: { event: Event }) {
  const items = [
    { label: "ID de origem", value: event.source_id },
    { label: "Item", value: getPayloadValue(event.payload, "item_id") },
    { label: "Pedido", value: getPayloadValue(event.payload, "order_id") },
    { label: "Seller", value: getPayloadValue(event.payload, "seller_id") },
    { label: "Status ML", value: getPayloadValue(event.payload, "status") },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">
        Informações do Mercado Livre
      </h2>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
          >
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-600">
              {item.label}
            </dt>
            <dd className="mt-2 break-words text-sm font-medium text-slate-200">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function EventDetailsPage() {
  const { id } = useParams();
  const { event, loading, updatingStatus, error, refetch, changeStatus } =
    useEvent(id);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        Carregando evento...
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        <p className="font-semibold">Não foi possível carregar o evento.</p>
        <p className="mt-2 text-sm">{error ?? "Evento não encontrado."}</p>
        <Link
          to="/events"
          className="mt-5 inline-flex rounded-xl border border-red-400/30 px-4 py-2 text-sm font-medium"
        >
          Voltar para eventos
        </Link>
      </section>
    );
  }

  const internalStatus = event.internal_status ?? "not_viewed";

  return (
    <div className="space-y-6">
      <section className="animate-fade-in-up rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/20 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <Link to="/events" className="text-sm font-medium text-sky-300">
          Voltar para eventos
        </Link>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
              Detalhes do evento
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {event.event_type}
            </h1>
            <p className="mt-3 text-sm text-slate-500">ID: {event.id}</p>
          </div>

          <span
            className={[
              "w-fit rounded-full border px-3 py-1 text-xs font-semibold",
              statusClasses[internalStatus],
            ].join(" ")}
          >
            {statusLabels[internalStatus]}
          </span>
        </div>
      </section>

      <QuickActions event={event} onRefresh={refetch} />

      <StatusActions
        currentStatus={internalStatus}
        updating={updatingStatus}
        onChangeStatus={changeStatus}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">Tipo</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {event.event_type}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">Data</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatDate(event.created_at)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">Horário</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatTime(event.created_at)}
          </p>
        </div>
      </section>

      <MercadoLivreInfo event={event} />

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Payload completo</h2>
        <pre className="mt-5 max-h-[520px] overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-300">
          {JSON.stringify(event.payload, null, 2)}
        </pre>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Ações futuras</h2>
        <p className="mt-2 text-sm text-slate-500">
          Espaço reservado para atribuição, comentários e automações.
        </p>
      </section>
    </div>
  );
}
