export interface QueueHealth {
  name: string;
  jobs: {
    pending: number;
    active: number;
    completed: number;
    failed: number;
  };
  averageProcessingTimeMs: number | null;
}

export interface QueuesHealthResponse {
  data: QueueHealth[];
  generated_at: string;
}
