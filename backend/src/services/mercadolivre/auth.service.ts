import axios from "axios";
import { env } from "../../config/env";

let accessTokenAtual = env.ML_ACCESS_TOKEN;
let refreshTokenAtual = env.ML_REFRESH_TOKEN;

export const obterAccessToken = () => accessTokenAtual;
export const obterRefreshToken = () => refreshTokenAtual;

export const renovarTokenML = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", env.ML_CLIENT_ID);
    params.append("client_secret", env.ML_CLIENT_SECRET);
    params.append("refresh_token", refreshTokenAtual);

    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      params,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessTokenAtual = response.data.access_token;
    refreshTokenAtual = response.data.refresh_token;

    console.log("Token do Mercado Livre renovado com sucesso.");

    return {
      access_token: accessTokenAtual,
      refresh_token: refreshTokenAtual,
    };
  } catch (error: any) {
    console.error("Erro ao renovar token do Mercado Livre:");

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("DATA:", error.response.data);
    } else {
      console.error(error.message);
    }

    throw error;
  }
};