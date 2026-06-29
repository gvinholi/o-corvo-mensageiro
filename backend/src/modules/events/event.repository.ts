import { randomUUID } from "crypto";
import { supabase } from "../../config/supabase";
import {
  CreateEventInput,
  Event,
  EventInternalStatus,
  EventRepository,
  GetEventsFilters,
  PaginatedEvents,
  UpdateEventStatusInput,
} from "./event.types";

const TABLE_NAME = "events";
const DEFAULT_EVENTS_LIMIT = 50;
const EVENT_SELECT_FIELDS =
  "id, event_type, source_id, payload, created_at, viewed_at, in_progress_at, resolved_at, archived_at";

const validateCreateEventInput = (input: CreateEventInput) => {
  if (!input.event_type.trim()) {
    throw new Error("O tipo do evento é obrigatório.");
  }

  if (!input.source_id.trim()) {
    throw new Error("O ID de origem do evento é obrigatório.");
  }
};

const getInternalStatus = (event: Omit<Event, "internal_status">) => {
  if (event.archived_at) {
    return "archived";
  }

  if (event.resolved_at) {
    return "resolved";
  }

  if (event.in_progress_at) {
    return "in_progress";
  }

  if (event.viewed_at) {
    return "viewed";
  }

  return "not_viewed";
};

const mapEvent = (event: Omit<Event, "internal_status">): Event => ({
  ...event,
  internal_status: getInternalStatus(event),
});

const mapEvents = (events: Array<Omit<Event, "internal_status">>) =>
  events.map(mapEvent);

const getLifecycleFieldsByStatus = (status: EventInternalStatus) => {
  const now = new Date().toISOString();

  if (status === "not_viewed") {
    return {
      viewed_at: null,
      in_progress_at: null,
      resolved_at: null,
      archived_at: null,
    };
  }

  if (status === "viewed") {
    return {
      viewed_at: now,
      in_progress_at: null,
      resolved_at: null,
      archived_at: null,
    };
  }

  if (status === "in_progress") {
    return {
      viewed_at: now,
      in_progress_at: now,
      resolved_at: null,
      archived_at: null,
    };
  }

  if (status === "resolved") {
    return {
      viewed_at: now,
      in_progress_at: null,
      resolved_at: now,
      archived_at: null,
    };
  }

  return {
    viewed_at: now,
    in_progress_at: null,
    resolved_at: null,
    archived_at: now,
  };
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
      .select(EVENT_SELECT_FIELDS)
      .maybeSingle<Omit<Event, "internal_status">>();

    if (error) {
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }

    if (data) {
      return mapEvent(data);
    }

    const { data: existingEvent, error: existingEventError } = await supabase
      .from(TABLE_NAME)
      .select(EVENT_SELECT_FIELDS)
      .eq("event_type", input.event_type)
      .eq("source_id", input.source_id)
      .single<Omit<Event, "internal_status">>();

    if (existingEventError) {
      throw new Error(
        `Erro ao buscar evento existente: ${existingEventError.message}`
      );
    }

    return mapEvent(existingEvent);
  },

  async getEvents(filters: GetEventsFilters = {}): Promise<PaginatedEvents> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? DEFAULT_EVENTS_LIMIT;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from(TABLE_NAME)
      .select(EVENT_SELECT_FIELDS, {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters.event_type) {
      query = query.eq("event_type", filters.event_type);
    }

    if (filters.source_id) {
      query = query.eq("source_id", filters.source_id);
    }

    const { data, error, count } = await query.returns<
      Array<Omit<Event, "internal_status">>
    >();

    if (error) {
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }

    const total = count ?? 0;

    return {
      data: mapEvents(data ?? []),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(EVENT_SELECT_FIELDS)
      .eq("id", id)
      .maybeSingle<Omit<Event, "internal_status">>();

    if (error) {
      throw new Error(`Erro ao buscar evento "${id}": ${error.message}`);
    }

    return data ? mapEvent(data) : null;
  },

  async updateEventStatus(
    id: string,
    input: UpdateEventStatusInput
  ): Promise<Event | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(getLifecycleFieldsByStatus(input.status))
      .eq("id", id)
      .select(EVENT_SELECT_FIELDS)
      .maybeSingle<Omit<Event, "internal_status">>();

    if (error) {
      throw new Error(
        `Erro ao atualizar status do evento "${id}": ${error.message}`
      );
    }

    return data ? mapEvent(data) : null;
  },
};
