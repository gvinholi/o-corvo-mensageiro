import { Request, Response } from "express";
import { getQueuesHealth } from "../queues";

export const listarFilas = async (_req: Request, res: Response) => {
  try {
    const queuesHealth = await getQueuesHealth();

    return res.json(queuesHealth);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao buscar métricas das filas.",
      message: error.message,
    });
  }
};
