import { Event } from "../events";
import { claimCreatedHandler } from "./handlers/claim-created.handler";
import { messageReceivedHandler } from "./handlers/message-received.handler";
import { orderCancelledHandler } from "./handlers/order-cancelled.handler";
import { orderCreatedHandler } from "./handlers/order-created.handler";
import { questionCreatedHandler } from "./handlers/question-created.handler";
import { rawWebhookHandler } from "./handlers/raw-webhook.handler";
import { EventHandler, ProcessEventInput } from "./event-processor.types";

const handlers: EventHandler[] = [
  orderCancelledHandler,
  questionCreatedHandler,
  messageReceivedHandler,
  claimCreatedHandler,
  orderCreatedHandler,
  rawWebhookHandler,
];

export const eventProcessor = {
  async process(input: ProcessEventInput): Promise<Event> {
    const handler = handlers.find((candidate) => candidate.canHandle(input));

    if (!handler) {
      return rawWebhookHandler.handle(input);
    }

    console.log("Evento processado:", {
      source: input.source,
      event_type: handler.eventType,
    });

    return handler.handle(input);
  },
};
