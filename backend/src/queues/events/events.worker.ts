import { Job, Worker } from "bullmq";
import { eventProcessor, ProcessEventResult } from "../../modules/event-processor";
import { registerFailedEvent } from "../failed-events";
import { EVENTS_QUEUE_NAME } from "./events.queue";
import { eventsQueueConnection } from "./events-queue.connection";
import { EventQueueJobData } from "./events-queue.types";

let eventsWorker: Worker<EventQueueJobData, ProcessEventResult, string> | null =
  null;

const buildProcessorInput = (job: Job<EventQueueJobData>) => ({
  source: job.data.source ?? "unknown",
  payload: job.data.payload ?? job.data,
});

export const startEventsWorker = () => {
  if (eventsWorker) {
    return eventsWorker;
  }

  eventsWorker = new Worker<EventQueueJobData, ProcessEventResult, string>(
    EVENTS_QUEUE_NAME,
    async (job) => {
      console.log("Processando job de evento:", {
        jobId: job.id,
        name: job.name,
        attempt: job.attemptsMade + 1,
      });

      return eventProcessor.process(buildProcessorInput(job));
    },
    {
      connection: eventsQueueConnection,
      concurrency: 5,
    }
  );

  eventsWorker.on("completed", (job, result) => {
    console.log("Job de evento processado com sucesso:", {
      jobId: job.id,
      event_type: result.event_type,
      source_id: result.source_id,
      processed: result.processed,
      duplicate: result.duplicate,
    });
  });

  eventsWorker.on("failed", (job, error) => {
    console.error("Job de evento falhou:", {
      jobId: job?.id,
      attemptsMade: job?.attemptsMade,
      error: error.message,
    });

    void registerFailedEvent(EVENTS_QUEUE_NAME, job, error).catch(
      (failedEventError) => {
        console.error("Erro ao registrar falha de evento:", failedEventError);
      }
    );
  });

  return eventsWorker;
};

export const getEventsWorker = () => eventsWorker;
