import { Request, Response } from "express";
import { eventService } from "../modules/events";

export const listarEventos = async (req: Request, res: Response) => {
  try {
    const events = await eventService.getEvents();

    return res.json(events);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao buscar eventos.",
      message: error.message,
    });
  }
};
