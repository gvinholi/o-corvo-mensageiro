import { eventRepository } from "./event.repository";
import { Event, GetEventsFilters, PaginatedEvents } from "./event.types";

export const eventService = {
  async getEvents(filters: GetEventsFilters): Promise<PaginatedEvents> {
    return eventRepository.getEvents(filters);
  },

  async getEventById(id: string): Promise<Event | null> {
    return eventRepository.getEventById(id);
  },
};
