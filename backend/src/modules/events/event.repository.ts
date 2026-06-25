import { randomUUID } from "crypto";
import { supabase } from "../../config/supabase";
import {
  CreateEventInput,
  Event,
  EventRepository,
  GetEventsFilters,
} from "./event.types";

const TABLE_NAME = "events";
const DEFAULT_EVENTS_LIMIT = 50;

const validateCreateEventInput = (input: CreateEventInput) => {
  if (!input.event_type.trim()) {
    throw new Error("O tipo do evento é obrigatório.");
  }

  if (!input.source_id.trim()) {
    throw new Error("O ID de origem do evento é obrigatório.");
  }
};

export const eventRepository: EventRepository = {
  async createEvent(input: CreateEventInput): Promise<Event> {
    validateCreateEventInput(input);

    const eventToCreate = {
      id: randomUUID(),
      event_type: input.event_type,
      source_id: input.source_id,
      payload: input.payload ?? null,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(eventToCreate, {
        onConflict: "event_type,source_id",
        ignoreDuplicates: true,
      })
      .select("id, event_type, source_id, payload, created_at")
      .maybeSingle<Event>();

    if (error) {
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }

    if (data) {
      return data;
    }

    const { data: existingEvent, error: existingEventError } = await supabase
      .from(TABLE_NAME)
      .select("id, event_type, source_id, payload, created_at")
      .eq("event_type", input.event_type)
      .eq("source_id", input.source_id)
      .single<Event>();

    if (existingEventError) {
      throw new Error(
        `Erro ao buscar evento existente: ${existingEventError.message}`
      );
    }

    return existingEvent;
  },

  async getEvents(filters: GetEventsFilters = {}): Promise<Event[]> {
    let query = supabase
      .from(TABLE_NAME)
      .select("id, event_type, source_id, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(filters.limit ?? DEFAULT_EVENTS_LIMIT);

    if (filters.event_type) {
      query = query.eq("event_type", filters.event_type);
    }

    if (filters.source_id) {
      query = query.eq("source_id", filters.source_id);
    }

    const { data, error } = await query.returns<Event[]>();

    if (error) {
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }

    return data ?? [];
  },
};
