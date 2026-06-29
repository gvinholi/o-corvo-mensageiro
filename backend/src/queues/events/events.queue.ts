import { Job, Queue } from "bullmq";
import { eventsQueueConnection } from "./events-queue.connection";
import {
  AddEventJobInput,
  EventQueueJobData,
  QueueJobActionInput,
} from "./events-queue.types";

export const EVENTS_QUEUE_NAME = "events";

export const eventsQueue = new Queue<EventQueueJobData, unknown, string>(
  EVENTS_QUEUE_NAME,
  {
    connection: eventsQueueConnection,
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

const buildJobName = (input: AddEventJobInput) =>
  input.name || String(input.data.event_type || "event");

const buildJobId = (input: AddEventJobInput) => {
  if (input.jobId) {
    return input.jobId;
  }

  if (input.data.event_type && input.data.source_id) {
    return `${input.data.event_type}:${input.data.source_id}`;
  }

  return undefined;
};

export const addJob = async (
  input: AddEventJobInput
): Promise<Job<EventQueueJobData, unknown, string>> => {
  return eventsQueue.add(buildJobName(input), input.data, {
    ...input.options,
    jobId: buildJobId(input),
  });
};

export const removeJob = async ({
  jobId,
}: QueueJobActionInput): Promise<boolean> => {
  const job = await eventsQueue.getJob(jobId);

  if (!job) {
    console.log("Job de evento não encontrado para remoção:", { jobId });
    return false;
  }

  await job.remove();
  return true;
};

export const retryJob = async ({
  jobId,
}: QueueJobActionInput): Promise<boolean> => {
  const job = await eventsQueue.getJob(jobId);

  if (!job) {
    console.log("Job de evento não encontrado para retry:", { jobId });
    return false;
  }

  await job.retry("failed");
  return true;
};
