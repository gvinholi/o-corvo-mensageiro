import axios from "axios";
import { obterAccessToken, renovarTokenML } from "./auth.service";

export const buscarPerguntasML = async () => {
  try {
    const response = await axios.get(
      "https://api.mercadolibre.com/my/received_questions/search?status=UNANSWERED",
      {
        headers: {
          Authorization: `Bearer ${obterAccessToken()}`,
        },
      }
    );

    return response.data.questions || [];
  } catch (error: any) {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.log("Token expirado/inválido. Renovando...");
      await renovarTokenML();

      const retry = await axios.get(
        "https://api.mercadolibre.com/my/received_questions/search?status=UNANSWERED",
        {
          headers: {
            Authorization: `Bearer ${obterAccessToken()}`,
          },
        }
      );

      return retry.data.questions || [];
    }

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