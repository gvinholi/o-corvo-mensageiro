import axios from "axios";
import { env } from "../../config/env";

export const buscarMensagensPorPedido = async (orderId: number) => {
  try {
    const response = await axios.get(
      `https://api.mercadolibre.com/messages/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${env.ML_ACCESS_TOKEN}`,
        },
      }
    );

    return response.data.messages || [];
  } catch (error: any) {
    console.error("Erro ao buscar mensagens do pedido:", orderId);

    if (error.response) {
      console.error(error.response.data);
    }

    return [];
  }
};