import { JobsOptions } from "bullmq";
import { EventPayload, EventType } from "../../modules/events";
import { EventSource } from "../../modules/event-processor";

export interface EventQueueJobData {
  source?: EventSource;
  event_type?: EventType | string;
  source_id?: string;
  payload?: EventPayload;
  [key: string]: unknown;
}

export interface AddEventJobInput {
  name?: string;
  data: EventQueueJobData;
  jobId?: string;
  options?: JobsOptions;
}

export interface QueueJobActionInput {
  jobId: string;
}
