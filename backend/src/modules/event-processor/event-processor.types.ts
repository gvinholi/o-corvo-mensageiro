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

export interface ProcessEventResult {
  event: Event | null;
  event_type: EventType;
  source_id: string;
  source_timestamp: string;
  processed: boolean;
  duplicate: boolean;
}
