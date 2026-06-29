import { eventRepository } from "../events";
import { claimCreatedHandler } from "./handlers/claim-created.handler";
import { messageReceivedHandler } from "./handlers/message-received.handler";
import { orderCancelledHandler } from "./handlers/order-cancelled.handler";
import { orderCreatedHandler } from "./handlers/order-created.handler";
import { questionCreatedHandler } from "./handlers/question-created.handler";
import { rawWebhookHandler } from "./handlers/raw-webhook.handler";
import {
  EventHandler,
  ProcessEventInput,
  ProcessEventResult,
} from "./event-processor.types";
import {
  buildSourceId,
  getFallbackPrefixByEventType,
  getSourceTimestamp,
} from "./event-processor.utils";

const handlers: EventHandler[] = [
  orderCancelledHandler,
  questionCreatedHandler,
  messageReceivedHandler,
  claimCreatedHandler,
  orderCreatedHandler,
  rawWebhookHandler,
];

const processingEventKeys = new Set<string>();

const buildProcessingKey = (
  eventType: string,
  sourceId: string,
  sourceTimestamp: string
) => [eventType, sourceId, sourceTimestamp].join(":");

export const eventProcessor = {
  async process(input: ProcessEventInput): Promise<ProcessEventResult> {
    const handler = handlers.find((candidate) => candidate.canHandle(input));
    const selectedHandler = handler ?? rawWebhookHandler;
    const sourceId = buildSourceId(
      input.payload,
      getFallbackPrefixByEventType(selectedHandler.eventType)
    );
    const sourceTimestamp = getSourceTimestamp(input.payload);
    const processingKey = buildProcessingKey(
      selectedHandler.eventType,
      sourceId,
      sourceTimestamp
    );

    if (processingEventKeys.has(processingKey)) {
      console.log("Evento duplicado ignorado durante processamento:", {
        source: input.source,
        event_type: selectedHandler.eventType,
        source_id: sourceId,
        source_timestamp: sourceTimestamp,
      });

      return {
        event: null,
        event_type: selectedHandler.eventType,
        source_id: sourceId,
        source_timestamp: sourceTimestamp,
        processed: false,
        duplicate: true,
      };
    }

    processingEventKeys.add(processingKey);

    try {
      const existingEvents = await eventRepository.getEvents({
        event_type: selectedHandler.eventType,
        source_id: sourceId,
        page: 1,
        limit: 1,
      });
      const existingEvent = existingEvents.data[0] ?? null;

      if (existingEvent) {
        console.log("Evento duplicado ignorado:", {
          source: input.source,
          event_type: selectedHandler.eventType,
          source_id: sourceId,
          source_timestamp: sourceTimestamp,
        });

        return {
          event: existingEvent,
          event_type: selectedHandler.eventType,
          source_id: sourceId,
          source_timestamp: sourceTimestamp,
          processed: false,
          duplicate: true,
        };
      }

      console.log("Evento processado:", {
        source: input.source,
        event_type: selectedHandler.eventType,
        source_id: sourceId,
        source_timestamp: sourceTimestamp,
      });

      const event = await selectedHandler.handle(input);

      return {
        event,
        event_type: selectedHandler.eventType,
        source_id: sourceId,
        source_timestamp: sourceTimestamp,
        processed: true,
        duplicate: false,
      };
    } finally {
      processingEventKeys.delete(processingKey);
    }
  },
};
