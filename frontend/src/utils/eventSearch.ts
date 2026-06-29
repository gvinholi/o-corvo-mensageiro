import type { Event, EventPayload } from "../types/event";

const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const collectPayloadValues = (payload: EventPayload): string[] => {
  if (!payload) {
    return [];
  }

  const values: string[] = [];

  const collect = (value: unknown) => {
    if (value === null || value === undefined) {
      return;
    }

    if (["string", "number", "boolean"].includes(typeof value)) {
      values.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }

    if (typeof value === "object") {
      Object.values(value).forEach(collect);
    }
  };

  collect(payload);

  return values;
};

export function searchEvents(events: Event[], searchTerm: string): Event[] {
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  if (!normalizedSearchTerm) {
    return events;
  }

  return events.filter((event) => {
    const searchableValues = [
      event.id,
      event.event_type,
      event.source_id,
      event.created_at,
      ...collectPayloadValues(event.payload),
    ];

    return searchableValues.some((value) =>
      normalizeSearchValue(value).includes(normalizedSearchTerm)
    );
  });
}
