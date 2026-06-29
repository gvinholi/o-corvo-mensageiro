import { eventRepository } from "../../events";
import { EventHandler } from "../event-processor.types";
import {
  buildSourceId,
  getResource,
  getStatus,
  getTopic,
} from "../event-processor.utils";

export const orderCancelledHandler: EventHandler = {
  eventType: "ORDER_CANCELLED",

  canHandle({ payload }) {
    const topic = getTopic(payload);
    const resource = getResource(payload);
    const status = getStatus(payload);

    return (
      topic.includes("cancel") ||
      resource.includes("cancel") ||
      status === "cancelled" ||
      status === "canceled"
    );
  },

  async handle({ payload }) {
    return eventRepository.createEvent({
      event_type: "ORDER_CANCELLED",
      source_id: buildSourceId(payload, "order-cancelled"),
      payload,
    });
  },
};
