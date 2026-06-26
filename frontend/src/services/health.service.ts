import { apiRequest } from "./api";
import type { HealthResponse } from "../types/health";

export async function getHealthStatus(
  signal?: AbortSignal
): Promise<HealthResponse> {
  return apiRequest<HealthResponse>("/health", { signal });
}
