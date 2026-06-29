import { Request, Response } from "express";
import { getFailedEvents } from "../queues";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

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

export const listarFalhas = async (req: Request, res: Response) => {
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

    const failedEvents = await getFailedEvents({
      page,
      limit,
    });

    return res.json(failedEvents);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao buscar falhas.",
      message: error.message,
    });
  }
};
