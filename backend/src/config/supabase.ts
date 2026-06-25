import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const requiredEnvVars = [
  ["SUPABASE_URL", env.SUPABASE_URL],
  ["SUPABASE_ANON_KEY", env.SUPABASE_ANON_KEY],
] as const;

const missingEnvVars = requiredEnvVars
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingEnvVars.length) {
  throw new Error(
    `Configuração do Supabase incompleta. Defina: ${missingEnvVars.join(", ")}`
  );
}

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
