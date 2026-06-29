import { JobsOptions } from "bullmq";

export interface TelegramQueueJobData {
  message: string;
  event_id?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AddTelegramJobInput {
  data: TelegramQueueJobData;
  jobId?: string;
  options?: JobsOptions;
}

export interface TelegramQueueJobActionInput {
  jobId: string;
}
