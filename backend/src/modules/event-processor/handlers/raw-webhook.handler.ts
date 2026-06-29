import { eventRepository } from "../../events";
import { EventHandler } from "../event-processor.types";
import { buildSourceId } from "../event-processor.utils";

export const rawWebhookHandler: EventHandler = {
  eventType: "RAW_WEBHOOK",

  canHandle() {
    return true;
  },

  async handle({ payload }) {
    return eventRepository.createEvent({
      event_type: "RAW_WEBHOOK",
      source_id: buildSourceId(payload, "raw-webhook"),
      payload,
    });
  },
};
