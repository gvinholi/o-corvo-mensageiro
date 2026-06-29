import { Request, Response } from "express";
import {
  isMercadoLivreWebhookPayload,
  MercadoLivreWebhookPayload,
} from "./webhooks.types";
import { webhooksService } from "./webhooks.service";

const logMercadoLivreWebhook = (payload: MercadoLivreWebhookPayload) => {
  console.log("Webhook Mercado Livre recebido:", {
    topic: payload.topic,
    resource: payload.resource,
    user_id: payload.user_id,
    application_id: payload.application_id,
    attempts: payload.attempts,
    sent: payload.sent,
    received: payload.received,
  });
};

export const receiveMercadoLivreWebhook = (req: Request, res: Response) => {
  if (!isMercadoLivreWebhookPayload(req.body)) {
    return res.status(400).json({
      error: "Payload inválido para webhook do Mercado Livre.",
    });
  }

  logMercadoLivreWebhook(req.body);

  res.status(200).json({
    received: true,
  });

  void webhooksService
    .registerMercadoLivreWebhook(req.body)
    .catch((error: unknown) => {
      console.error("Erro ao enfileirar webhook do Mercado Livre:", error);
    });
};
