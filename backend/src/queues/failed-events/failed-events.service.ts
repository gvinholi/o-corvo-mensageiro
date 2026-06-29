import { Job } from "bullmq";
import { addFailedEvent } from "./failed-events.queue";

const getMaxAttempts = (job: Job) => job.opts.attempts ?? 1;

export const shouldRegisterFailedEvent = (job: Job | undefined) => {
  if (!job) {
    return false;
  }

  return job.attemptsMade >= getMaxAttempts(job);
};

export const registerFailedEvent = async (
  queue: string,
  job: Job | undefined,
  error: Error
) => {
  if (!job || !shouldRegisterFailedEvent(job)) {
    return null;
  }

  const failedJob = await addFailedEvent({
    jobId: `failed:${queue}:${job.id}`,
    data: {
      queue,
      jobId: job.id,
      jobName: job.name,
      error: error.message,
      stack: error.stack,
      payload: job.data,
      attempts: job.attemptsMade,
      failed_at: new Date().toISOString(),
    },
  });

  console.error("Job enviado para fila de falhas:", {
    queue,
    jobId: job.id,
    failedJobId: failedJob.id,
    attempts: job.attemptsMade,
  });

  return failedJob;
};
