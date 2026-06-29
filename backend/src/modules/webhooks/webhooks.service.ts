import { eventRepository } from "../events";
import { MercadoLivreWebhookPayload } from "./webhooks.types";

const buildRawWebhookSourceId = (payload: MercadoLivreWebhookPayload) => {
  if (payload._id) {
    return payload._id;
  }

  const receivedAt = payload.received || new Date().toISOString();

  return [payload.topic, payload.resource, receivedAt].join(":");
};

export const webhooksService = {
  async registerMercadoLivreWebhook(
    payload: MercadoLivreWebhookPayload
  ): Promise<void> {
    await eventRepository.createEvent({
      event_type: "RAW_WEBHOOK",
      source_id: buildRawWebhookSourceId(payload),
      payload,
    });
  },
};
