import axios from "axios";
import { obterAccessToken, renovarTokenML } from "./auth.service";

const buscarSellerIdAtual = async () => {
  const response = await axios.get("https://api.mercadolibre.com/users/me", {
    headers: {
      Authorization: `Bearer ${obterAccessToken()}`,
    },
  });

  return response.data.id;
};

const buscarPedidosPorSellerId = async (sellerId: number) => {
  const response = await axios.get(
    `https://api.mercadolibre.com/orders/search?seller=${sellerId}&sort=date_desc`,
    {
      headers: {
        Authorization: `Bearer ${obterAccessToken()}`,
      },
    }
  );

  return (response.data.results || []).map((order: any) => ({
    ...order,
    seller_id: sellerId,
  }));
};

export const buscarPedidosML = async () => {
  try {
    const sellerId = await buscarSellerIdAtual();

    return buscarPedidosPorSellerId(sellerId);
  } catch (error: any) {
    const isTokenError = error.response?.status === 401;
    const isCallerMismatch =
      error.response?.status === 403 &&
      error.response?.data?.error === "caller.id.invalid";

    if (isTokenError) {
      console.log("Token expirado/inválido nos pedidos. Renovando...");
      await renovarTokenML();

      const sellerId = await buscarSellerIdAtual();

      return buscarPedidosPorSellerId(sellerId);
    }

    if (isCallerMismatch) {
      console.error(
        "Erro de permissão ao buscar pedidos ML: token não corresponde ao comprador ou vendedor."
      );
      console.error("DATA:", error.response.data);
      return [];
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