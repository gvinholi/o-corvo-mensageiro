import { eventRepository } from "../../events";
import { EventHandler } from "../event-processor.types";
import {
  buildSourceId,
  getResource,
  getStatus,
  getTopic,
} from "../event-processor.utils";

export const orderCreatedHandler: EventHandler = {
  eventType: "ORDER_CREATED",

  canHandle({ payload }) {
    const topic = getTopic(payload);
    const resource = getResource(payload);
    const status = getStatus(payload);

    return (
      (topic.includes("order") || resource.includes("order")) &&
      status !== "cancelled" &&
      status !== "canceled"
    );
  },

  async handle({ payload }) {
    return eventRepository.createEvent({
      event_type: "ORDER_CREATED",
      source_id: buildSourceId(payload, "order"),
      payload,
    });
  },
};
