import { createHash } from "crypto";
import { Job, Queue } from "bullmq";
import { queueConnection } from "../queue.connection";
import {
  AddTelegramJobInput,
  TelegramQueueJobActionInput,
  TelegramQueueJobData,
} from "./telegram-queue.types";

export const TELEGRAM_QUEUE_NAME = "telegram";

export const telegramQueue = new Queue<TelegramQueueJobData, unknown, string>(
  TELEGRAM_QUEUE_NAME,
  {
    connection: queueConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: false,
      removeOnFail: false,
    },
  }
);

const buildJobId = (input: AddTelegramJobInput) => {
  if (input.jobId) {
    return input.jobId;
  }

  if (input.data.event_id) {
    return `telegram:event:${input.data.event_id}`;
  }

  const messageHash = createHash("sha256")
    .update(input.data.message)
    .digest("hex")
    .slice(0, 24);

  return `telegram:message:${messageHash}`;
};

export const addTelegramJob = async (
  input: AddTelegramJobInput
): Promise<Job<TelegramQueueJobData, unknown, string>> => {
  return telegramQueue.add("send-message", input.data, {
    ...input.options,
    jobId: buildJobId(input),
  });
};

export const removeTelegramJob = async ({
  jobId,
}: TelegramQueueJobActionInput): Promise<boolean> => {
  const job = await telegramQueue.getJob(jobId);

  if (!job) {
    console.log("Job do Telegram não encontrado para remoção:", { jobId });
    return false;
  }

  await job.remove();
  return true;
};

export const retryTelegramJob = async ({
  jobId,
}: TelegramQueueJobActionInput): Promise<boolean> => {
  const job = await telegramQueue.getJob(jobId);

  if (!job) {
    console.log("Job do Telegram não encontrado para retry:", { jobId });
    return false;
  }

  await job.retry("failed");
  return true;
};
