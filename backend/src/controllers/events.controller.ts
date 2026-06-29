import { Request, Response } from "express";
import { eventService } from "../modules/events";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const VALID_EVENT_STATUSES = [
  "not_viewed",
  "viewed",
  "resolved",
  "archived",
] as const;

const parsePositiveIntegerQueryParam = (
  value: unknown,
  defaultValue: number
) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);

  return parsedValue > 0 ? parsedValue : null;
};

export const listarEventos = async (req: Request, res: Response) => {
  try {
    const page = parsePositiveIntegerQueryParam(req.query.page, DEFAULT_PAGE);
    const limit = parsePositiveIntegerQueryParam(
      req.query.limit,
      DEFAULT_LIMIT
    );

    if (!page || !limit) {
      return res.status(400).json({
        error: "Parâmetros de paginação inválidos.",
        message: "Use page e limit como números inteiros positivos.",
      });
    }

    if (limit > MAX_LIMIT) {
      return res.status(400).json({
        error: "Limite de paginação inválido.",
        message: `O limite máximo permitido é ${MAX_LIMIT}.`,
      });
    }

    const events = await eventService.getEvents({
      page,
      limit,
    });

    return res.json(events);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao buscar eventos.",
      message: error.message,
    });
  }
};

export const buscarEventoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "ID do evento inválido.",
      });
    }

    const event = await eventService.getEventById(id);

    if (!event) {
      return res.status(404).json({
        error: "Evento não encontrado.",
      });
    }

    return res.json(event);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao buscar evento.",
      message: error.message,
    });
  }
};

export const atualizarStatusEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "ID do evento inválido.",
      });
    }

    if (!VALID_EVENT_STATUSES.includes(status)) {
      return res.status(400).json({
        error: "Status do evento inválido.",
        allowedStatuses: VALID_EVENT_STATUSES,
      });
    }

    const event = await eventService.updateEventStatus(id, {
      status,
    });

    if (!event) {
      return res.status(404).json({
        error: "Evento não encontrado.",
      });
    }

    return res.json(event);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao atualizar status do evento.",
      message: error.message,
    });
  }
};
