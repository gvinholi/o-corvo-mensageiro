import axios from "axios";
import { env } from "../../config/env";

export const enviarTelegram = async (mensagem: string) => {
  try {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: env.TELEGRAM_CHAT_ID,
      text: mensagem,
    });

    console.log("Telegram enviado com sucesso:", response.data.ok);
  } catch (error: any) {
    console.error("Erro ao enviar mensagem para o Telegram:");

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("DATA:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
};