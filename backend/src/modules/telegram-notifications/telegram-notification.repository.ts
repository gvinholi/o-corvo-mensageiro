import { randomUUID } from "crypto";
import { supabase } from "../../config/supabase";
import {
  CreateTelegramNotificationInput,
  TelegramNotification,
  TelegramNotificationRepository,
} from "./telegram-notification.types";

const TABLE_NAME = "telegram_notifications";

const validateCreateNotificationInput = (
  input: CreateTelegramNotificationInput
) => {
  if (!input.message.trim()) {
    throw new Error("A mensagem da notificação do Telegram é obrigatória.");
  }
};

export const telegramNotificationRepository: TelegramNotificationRepository = {
  async createNotification(
    input: CreateTelegramNotificationInput
  ): Promise<TelegramNotification> {
    validateCreateNotificationInput(input);

    const notificationToCreate = {
      id: randomUUID(),
      event_id: input.event_id ?? null,
      message: input.message,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(notificationToCreate)
      .select("id, event_id, message, sent_at")
      .single<TelegramNotification>();

    if (error) {
      throw new Error(
        `Erro ao registrar notificação do Telegram: ${error.message}`
      );
    }

    return data;
  },
};
