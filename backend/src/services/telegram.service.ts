import axios from "axios";
import { env } from "../config/env";

export const enviarTelegram = async (mensagem: string) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: env.TELEGRAM_CHAT_ID,
        text: mensagem
      }
    );
  } catch (error) {
    console.error("Erro ao enviar Telegram:", error);
  }
};