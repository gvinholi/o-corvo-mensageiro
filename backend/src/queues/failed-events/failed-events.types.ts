import { JobsOptions } from "bullmq";

export interface FailedEventJobData {
  queue: string;
  jobId: string | undefined;
  jobName: string;
  error: string;
  stack?: string;
  payload: unknown;
  attempts: number;
  failed_at: string;
}

export interface AddFailedEventInput {
  data: FailedEventJobData;
  jobId?: string;
  options?: JobsOptions;
}

export interface GetFailedEventsInput {
  page?: number;
  limit?: number;
}

export interface FailedEventRecord {
  id: string;
  name: string;
  data: FailedEventJobData;
  created_at: number | undefined;
}

export interface PaginatedFailedEvents {
  data: FailedEventRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
