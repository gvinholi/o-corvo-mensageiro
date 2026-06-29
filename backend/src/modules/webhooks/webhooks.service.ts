import { addJob } from "../../queues";
import { MercadoLivreWebhookPayload } from "./webhooks.types";

const buildMercadoLivreWebhookJobId = (payload: MercadoLivreWebhookPayload) => {
  if (payload._id) {
    return `mercadolivre:webhook:${payload._id}`;
  }

  const receivedAt = payload.received || new Date().toISOString();

  return [
    "mercadolivre",
    "webhook",
    payload.topic,
    payload.resource,
    receivedAt,
  ].join(":");
};

export const webhooksService = {
  async registerMercadoLivreWebhook(
    payload: MercadoLivreWebhookPayload
  ): Promise<void> {
    const job = await addJob({
      name: "mercadolivre-webhook",
      jobId: buildMercadoLivreWebhookJobId(payload),
      data: {
        source: "mercadolivre",
        payload,
      },
    });

    console.log("Webhook Mercado Livre enfileirado:", {
      jobId: job.id,
      topic: payload.topic,
      resource: payload.resource,
    });
  },
};
