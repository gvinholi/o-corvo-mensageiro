import { JobType, Queue } from "bullmq";
import { queueConnection } from "../queue.connection";
import {
  AddFailedEventInput,
  FailedEventJobData,
  GetFailedEventsInput,
  PaginatedFailedEvents,
} from "./failed-events.types";

export const FAILED_EVENTS_QUEUE_NAME = "failed-events";

export const failedEventsQueue = new Queue<FailedEventJobData, unknown, string>(
  FAILED_EVENTS_QUEUE_NAME,
  {
    connection: queueConnection,
    defaultJobOptions: {
      removeOnComplete: false,
      removeOnFail: false,
    },
  }
);

export const addFailedEvent = async (input: AddFailedEventInput) => {
  const jobId =
    input.jobId ?? `failed:${input.data.queue}:${input.data.jobId ?? Date.now()}`;

  return failedEventsQueue.add("failed-event", input.data, {
    ...input.options,
    jobId,
  });
};

export const getFailedEvents = async ({
  page = 1,
  limit = 50,
}: GetFailedEventsInput = {}): Promise<PaginatedFailedEvents> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const statuses: JobType[] = ["waiting", "delayed", "paused", "failed"];
  const [jobs, total] = await Promise.all([
    failedEventsQueue.getJobs(statuses, from, to, false),
    failedEventsQueue.count(),
  ]);

  return {
    data: jobs.map((job) => ({
      id: String(job.id),
      name: job.name,
      data: job.data,
      created_at: job.timestamp,
    })),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};
