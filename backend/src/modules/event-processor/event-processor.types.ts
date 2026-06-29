import { Event, EventPayload, EventType } from "../events";

export type EventSource = "mercadolivre" | "internal" | "unknown";

export interface ProcessEventInput {
  source: EventSource;
  payload: EventPayload;
}

export interface EventHandler {
  eventType: EventType;
  canHandle(input: ProcessEventInput): boolean;
  handle(input: ProcessEventInput): Promise<Event>;
}
