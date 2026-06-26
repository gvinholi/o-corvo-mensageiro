import type { Event } from "../types/event";
import { eventTypeGroups } from "./eventGroups";

export type OperationMetricKey =
  | "questions"
  | "orders"
  | "messages"
  | "claims"
  | "cancellations";

export interface OperationMetric {
  key: OperationMetricKey;
  title: string;
  icon: string;
  quantity: number;
  lastUpdated: string;
}

const metricDefinitions: Array<
  Omit<OperationMetric, "quantity" | "lastUpdated"> & {
    eventTypes: string[];
  }
> = [
  {
    key: "questions",
    title: "Perguntas",
    icon: "?",
    eventTypes: eventTypeGroups.questions,
  },
  {
    key: "orders",
    title: "Pedidos",
    icon: "#",
    eventTypes: eventTypeGroups.orders,
  },
  {
    key: "messages",
    title: "Mensagens",
    icon: "@",
    eventTypes: eventTypeGroups.messages,
  },
  {
    key: "claims",
    title: "Reclamações",
    icon: "!",
    eventTypes: eventTypeGroups.claims,
  },
  {
    key: "cancellations",
    title: "Cancelamentos",
    icon: "x",
    eventTypes: eventTypeGroups.cancellations,
  },
];

const formatLastUpdated = (date: string | null) => {
  if (!date) {
    return "sem registros";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
};

export function buildOperationMetrics(events: Event[]): OperationMetric[] {
  return metricDefinitions.map((metric) => {
    const metricEvents = events.filter((event) =>
      metric.eventTypes.includes(event.event_type)
    );

    const lastEvent = metricEvents.reduce<Event | null>((latestEvent, event) => {
      if (!latestEvent) {
        return event;
      }

      return new Date(event.created_at) > new Date(latestEvent.created_at)
        ? event
        : latestEvent;
    }, null);

    return {
      key: metric.key,
      title: metric.title,
      icon: metric.icon,
      quantity: metricEvents.length,
      lastUpdated: formatLastUpdated(lastEvent?.created_at ?? null),
    };
  });
}
