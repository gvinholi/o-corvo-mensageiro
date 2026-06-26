export interface HealthResponse {
  status: "ok";
  services: {
    supabase: boolean;
    telegram: boolean;
    mercadolivre: boolean;
  };
}

export interface ServiceStatus {
  key: "backend" | "supabase" | "mercadolivre" | "telegram";
  name: string;
  online: boolean;
  lastUpdated: string | null;
}
