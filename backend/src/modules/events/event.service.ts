import { eventRepository } from "./event.repository";
import { GetEventsFilters, PaginatedEvents } from "./event.types";

export const eventService = {
  async getEvents(filters: GetEventsFilters): Promise<PaginatedEvents> {
    return eventRepository.getEvents(filters);
  },
};
