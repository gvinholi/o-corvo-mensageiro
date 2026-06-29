export {
  addFailedEvent,
  FAILED_EVENTS_QUEUE_NAME,
  failedEventsQueue,
  getFailedEvents,
} from "./failed-events.queue";
export {
  registerFailedEvent,
  shouldRegisterFailedEvent,
} from "./failed-events.service";
export type {
  AddFailedEventInput,
  FailedEventJobData,
  FailedEventRecord,
  GetFailedEventsInput,
  PaginatedFailedEvents,
} from "./failed-events.types";
