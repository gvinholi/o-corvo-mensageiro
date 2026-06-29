import { eventRepository } from "../../events";
import { EventHandler } from "../event-processor.types";
import { buildSourceId, getResource, getTopic } from "../event-processor.utils";

export const claimCreatedHandler: EventHandler = {
  eventType: "CLAIM_CREATED",

  canHandle({ payload }) {
    const topic = getTopic(payload);
    const resource = getResource(payload);

    return topic.includes("claim") || resource.includes("claim");
  },

  async handle({ payload }) {
    return eventRepository.createEvent({
      event_type: "CLAIM_CREATED",
      source_id: buildSourceId(payload, "claim"),
      payload,
    });
  },
};
