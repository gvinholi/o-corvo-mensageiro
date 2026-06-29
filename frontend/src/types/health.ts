export interface HealthResponse {
  status: "ok";
  services: {
    supabase: boolean;
    redis: boolean;
    telegram: boolean;
    mercadolivre: boolean;
  };
}

export interface ServiceStatus {
  key: "backend" | "supabase" | "redis" | "mercadolivre" | "telegram";
  name: string;
  online: boolean;
  lastUpdated: string | null;
}
