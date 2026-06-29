import { eventProcessor } from "../event-processor";
import { MercadoLivreWebhookPayload } from "./webhooks.types";

export const webhooksService = {
  async registerMercadoLivreWebhook(
    payload: MercadoLivreWebhookPayload
  ): Promise<void> {
    await eventProcessor.process({
      source: "mercadolivre",
      payload,
    });
  },
};
