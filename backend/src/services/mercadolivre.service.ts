import axios from "axios";
import { env } from "../config/env";

export const buscarPerguntasML = async () => {
  try {
    const response = await axios.get(
      "https://api.mercadolibre.com/my/received_questions/search?status=UNANSWERED",
      {
        headers: {
          Authorization: `Bearer ${env.ML_ACCESS_TOKEN}`,
        },
      }
    );

    return response.data.questions || [];
  } catch (error: any) {
    console.error("Erro ao buscar perguntas ML:");

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("DATA:", error.response.data);
    } else {
      console.error(error.message);
    }

    return [];
  }
};