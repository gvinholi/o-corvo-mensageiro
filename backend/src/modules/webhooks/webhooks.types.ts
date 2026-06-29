export interface MercadoLivreWebhookPayload {
  _id?: string;
  resource: string;
  user_id?: number | string;
  topic: string;
  application_id?: number | string;
  attempts?: number;
  sent?: string;
  received?: string;
  [key: string]: unknown;
}

export const isMercadoLivreWebhookPayload = (
  payload: unknown
): payload is MercadoLivreWebhookPayload => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return (
    typeof candidate.resource === "string" &&
    candidate.resource.trim().length > 0 &&
    typeof candidate.topic === "string" &&
    candidate.topic.trim().length > 0
  );
};
