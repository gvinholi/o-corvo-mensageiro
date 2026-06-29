import { EventPayload } from "../events";

export const getPayloadValue = (
  payload: EventPayload,
  key: string
): unknown => {
  if (!payload || !(key in payload)) {
    return undefined;
  }

  return payload[key];
};

export const getStringPayloadValue = (
  payload: EventPayload,
  key: string
): string | null => {
  const value = getPayloadValue(payload, key);

  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
};

export const getTopic = (payload: EventPayload) =>
  getStringPayloadValue(payload, "topic")?.toLowerCase() ?? "";

export const getResource = (payload: EventPayload) =>
  getStringPayloadValue(payload, "resource")?.toLowerCase() ?? "";

export const getStatus = (payload: EventPayload) =>
  getStringPayloadValue(payload, "status")?.toLowerCase() ?? "";

export const buildSourceId = (
  payload: EventPayload,
  fallbackPrefix: string
): string => {
  const sourceId =
    getStringPayloadValue(payload, "_id") ||
    getStringPayloadValue(payload, "id") ||
    getStringPayloadValue(payload, "order_id") ||
    getStringPayloadValue(payload, "resource");

  if (sourceId) {
    return sourceId;
  }

  return `${fallbackPrefix}:${new Date().toISOString()}`;
};
