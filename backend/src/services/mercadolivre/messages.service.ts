import axios from "axios";
import { obterAccessToken, renovarTokenML } from "./auth.service";

const extrairMensagens = (data: any) => {
  if (Array.isArray(data)) {
    return data;
  }

  return data.messages || [];
};

const buscarMensagens = async (
  orderId: number,
  packId?: number | null,
  sellerId?: number | null
) => {
  if (packId && sellerId) {
    const response = await axios.get(
      `https://api.mercadolibre.com/messages/packs/${packId}/sellers/${sellerId}`,
      {
        params: {
          tag: "post_sale",
          mark_as_read: false,
        },
        headers: {
          Authorization: `Bearer ${obterAccessToken()}`,
        },
      }
    );

    return extrairMensagens(response.data);
  }

  const response = await axios.get(
    `https://api.mercadolibre.com/messages/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${obterAccessToken()}`,
      },
    }
  );

  return extrairMensagens(response.data);
};

export const buscarMensagensPorPedido = async (
  orderId: number,
  packId?: number | null,
  sellerId?: number | null
) => {
  try {
    return await buscarMensagens(orderId, packId, sellerId);
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("Token expirado/inválido nas mensagens. Renovando...");
      await renovarTokenML();

      return await buscarMensagens(orderId, packId, sellerId);
    }

    console.error("Erro ao buscar mensagens do pedido:", orderId);

    if (error.response) {
      console.error(error.response.data);
    }

    return [];
  }
};