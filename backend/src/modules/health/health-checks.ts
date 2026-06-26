import axios from "axios";
import { env } from "../../config/env";
import { supabase } from "../../config/supabase";
import { obterAccessToken } from "../../services/mercadolivre/auth.service";

export interface HealthServicesStatus {
  supabase: boolean;
  telegram: boolean;
  mercadolivre: boolean;
}

export const checkSupabaseHealth = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from("monitor_state").select("id").limit(1);

    return !error;
  } catch (error) {
    console.error("Healthcheck Supabase falhou:", error);
    return false;
  }
};

export const checkTelegramHealth = async (): Promise<boolean> => {
  try {
    if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return false;
    }

    const url = `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/getChat`;
    const response = await axios.get(url, {
      params: {
        chat_id: env.TELEGRAM_CHAT_ID,
      },
    });

    return response.data.ok === true;
  } catch (error) {
    console.error("Healthcheck Telegram falhou:", error);
    return false;
  }
};

export const checkMercadoLivreHealth = async (): Promise<boolean> => {
  try {
    const accessToken = obterAccessToken();

    if (!accessToken) {
      return false;
    }

    await axios.get("https://api.mercadolibre.com/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return true;
  } catch (error) {
    console.error("Healthcheck Mercado Livre falhou:", error);
    return false;
  }
};

export const checkServicesHealth =
  async (): Promise<HealthServicesStatus> => {
    const [supabase, telegram, mercadolivre] = await Promise.all([
      checkSupabaseHealth(),
      checkTelegramHealth(),
      checkMercadoLivreHealth(),
    ]);

    return {
      supabase,
      telegram,
      mercadolivre,
    };
  };
