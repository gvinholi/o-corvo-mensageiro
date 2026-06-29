import { eventRepository } from "../../events";
import { EventHandler } from "../event-processor.types";
import { buildSourceId, getResource, getTopic } from "../event-processor.utils";

export const messageReceivedHandler: EventHandler = {
  eventType: "MESSAGE_RECEIVED",

  canHandle({ payload }) {
    const topic = getTopic(payload);
    const resource = getResource(payload);

    return topic.includes("message") || resource.includes("message");
  },

  async handle({ payload }) {
    return eventRepository.createEvent({
      event_type: "MESSAGE_RECEIVED",
      source_id: buildSourceId(payload, "message"),
      payload,
    });
  },
};
