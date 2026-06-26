import { eventRepository } from "./event.repository";
import { Event } from "./event.types";

export const eventService = {
  async getEvents(): Promise<Event[]> {
    return eventRepository.getEvents();
  },
};
