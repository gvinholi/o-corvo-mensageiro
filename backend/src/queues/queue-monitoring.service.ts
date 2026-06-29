import { Queue } from "bullmq";
import { eventsQueue } from "./events";
import { failedEventsQueue } from "./failed-events";
import { telegramQueue } from "./telegram";
import { QueueHealth, QueuesHealthResponse } from "./queue-monitoring.types";

const COMPLETED_JOBS_SAMPLE_SIZE = 100;

const monitoredQueues = [eventsQueue, telegramQueue, failedEventsQueue];

const calculateAverageProcessingTime = async (queue: Queue) => {
  const completedJobs = await queue.getJobs(
    ["completed"],
    0,
    COMPLETED_JOBS_SAMPLE_SIZE - 1,
    false
  );

  const processingTimes = completedJobs
    .map((job) => {
      if (!job.processedOn || !job.finishedOn) {
        return null;
      }

      return job.finishedOn - job.processedOn;
    })
    .filter((time): time is number => typeof time === "number" && time >= 0);

  if (!processingTimes.length) {
    return null;
  }

  const totalProcessingTime = processingTimes.reduce((total, time) => {
    return total + time;
  }, 0);

  return Math.round(totalProcessingTime / processingTimes.length);
};

const getQueueHealth = async (queue: Queue): Promise<QueueHealth> => {
  const [counts, averageProcessingTimeMs] = await Promise.all([
    queue.getJobCounts("waiting", "delayed", "active", "completed", "failed"),
    calculateAverageProcessingTime(queue),
  ]);

  return {
    name: queue.name,
    jobs: {
      pending: (counts.waiting ?? 0) + (counts.delayed ?? 0),
      active: counts.active ?? 0,
      completed: counts.completed ?? 0,
      failed: counts.failed ?? 0,
    },
    averageProcessingTimeMs,
  };
};

export const getQueuesHealth = async (): Promise<QueuesHealthResponse> => {
  const data = await Promise.all(monitoredQueues.map(getQueueHealth));

  return {
    data,
    generated_at: new Date().toISOString(),
  };
};
