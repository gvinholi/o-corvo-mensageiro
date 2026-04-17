import { Request, Response } from "express";
import axios from "axios";
import { env } from "../config/env";

export const usuarioML = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://api.mercadolibre.com/users/me", {
      headers: {
        Authorization: `Bearer ${env.ML_ACCESS_TOKEN}`,
      },
    });

    return res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ error: error.message });
  }
};