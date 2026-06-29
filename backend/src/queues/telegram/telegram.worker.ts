import { Worker } from "bullmq";
import { telegramNotificationRepository } from "../../modules/telegram-notifications";
import { enviarTelegram } from "../../services/telegram/telegram.service";
import { registerFailedEvent } from "../failed-events";
import { queueConnection } from "../queue.connection";
import { TelegramQueueJobData } from "./telegram-queue.types";
import { TELEGRAM_QUEUE_NAME } from "./telegram.queue";

interface TelegramWorkerResult {
  sent: boolean;
  notification_id: string;
}

let telegramWorker: Worker<TelegramQueueJobData, TelegramWorkerResult, string> | null =
  null;

export const startTelegramWorker = () => {
  if (telegramWorker) {
    return telegramWorker;
  }

  telegramWorker = new Worker<TelegramQueueJobData, TelegramWorkerResult, string>(
    TELEGRAM_QUEUE_NAME,
    async (job) => {
      console.log("Processando job do Telegram:", {
        jobId: job.id,
        event_id: job.data.event_id,
        attempt: job.attemptsMade + 1,
      });

      const sent = await enviarTelegram(job.data.message);

      if (!sent) {
        throw new Error("Envio ao Telegram retornou falha.");
      }

      const notification =
        await telegramNotificationRepository.createNotification({
          event_id: job.data.event_id ?? null,
          message: job.data.message,
        });

      return {
        sent: true,
        notification_id: notification.id,
      };
    },
    {
      connection: queueConnection,
      concurrency: 3,
    }
  );

  telegramWorker.on("completed", (job, result) => {
    console.log("Job do Telegram processado com sucesso:", {
      jobId: job.id,
      notification_id: result.notification_id,
    });
  });

  telegramWorker.on("failed", (job, error) => {
    console.error("Job do Telegram falhou:", {
      jobId: job?.id,
      attemptsMade: job?.attemptsMade,
      error: error.message,
    });

    void registerFailedEvent(TELEGRAM_QUEUE_NAME, job, error).catch(
      (failedEventError) => {
        console.error("Erro ao registrar falha do Telegram:", failedEventError);
      }
    );
  });

  return telegramWorker;
};

export const getTelegramWorker = () => telegramWorker;
