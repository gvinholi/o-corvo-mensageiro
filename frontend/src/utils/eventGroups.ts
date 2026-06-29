import type { Event, EventType } from "../types/event";

export type EventFilter =
  | "all"
  | "questions"
  | "orders"
  | "messages"
  | "claims"
  | "cancellations";

export const eventTypeGroups: Record<Exclude<EventFilter, "all">, EventType[]> =
  {
    questions: ["QUESTION_CREATED", "question"],
    orders: ["ORDER_CREATED", "order"],
    messages: ["MESSAGE_RECEIVED", "MESSAGE_CREATED", "message"],
    claims: ["CLAIM_CREATED", "claim"],
    cancellations: ["ORDER_CANCELLED", "CANCELLATION_CREATED", "cancellation"],
  };

export function filterEventsByType(events: Event[], filter: EventFilter) {
  if (filter === "all") {
    return events;
  }

  return events.filter((event) =>
    eventTypeGroups[filter].includes(event.event_type)
  );
}
