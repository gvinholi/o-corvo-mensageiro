import axios from "axios";
import { obterAccessToken, renovarTokenML } from "./auth.service";

export const buscarPedidosML = async () => {
  try {
    const response = await axios.get(
      "https://api.mercadolibre.com/orders/search?seller=me&sort=date_desc",
      {
        headers: {
          Authorization: `Bearer ${obterAccessToken()}`,
        },
      }
    );

    return response.data.results || [];
  } catch (error: any) {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.log("Token expirado/inválido nos pedidos. Renovando...");
      await renovarTokenML();

      const retry = await axios.get(
        "https://api.mercadolibre.com/orders/search?seller=me&sort=date_desc",
        {
          headers: {
            Authorization: `Bearer ${obterAccessToken()}`,
          },
        }
      );

      return retry.data.results || [];
    }

    console.error("Erro ao buscar pedidos ML:");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    return [];
  }
};