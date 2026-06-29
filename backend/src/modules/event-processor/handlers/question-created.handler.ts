import { eventRepository } from "../../events";
import { EventHandler } from "../event-processor.types";
import { buildSourceId, getResource, getTopic } from "../event-processor.utils";

export const questionCreatedHandler: EventHandler = {
  eventType: "QUESTION_CREATED",

  canHandle({ payload }) {
    const topic = getTopic(payload);
    const resource = getResource(payload);

    return topic.includes("question") || resource.includes("question");
  },

  async handle({ payload }) {
    return eventRepository.createEvent({
      event_type: "QUESTION_CREATED",
      source_id: buildSourceId(payload, "question"),
      payload,
    });
  },
};
