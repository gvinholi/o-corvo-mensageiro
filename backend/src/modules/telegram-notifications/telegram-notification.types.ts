export interface TelegramNotification {
  id: string;
  event_id: string | null;
  message: string;
  sent_at: string;
}

export interface CreateTelegramNotificationInput {
  event_id?: string | null;
  message: string;
}

export interface TelegramNotificationRepository {
  createNotification(
    input: CreateTelegramNotificationInput
  ): Promise<TelegramNotification>;
}
