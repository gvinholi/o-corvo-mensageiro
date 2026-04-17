import { Request, Response } from "express";
import { buscarPerguntasML } from "../services/mercadolivre.service";

export const listarPerguntas = async (req: Request, res: Response) => {
    const perguntas = await buscarPerguntasML();

    res.json({
        total: perguntas.lenght,
        perguntas
    });
};