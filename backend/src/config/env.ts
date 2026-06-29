import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "3000",
  ML_ACCESS_TOKEN: process.env.ML_ACCESS_TOKEN || "",
  ML_REFRESH_TOKEN: process.env.ML_REFRESH_TOKEN || "",
  ML_CLIENT_ID: process.env.ML_CLIENT_ID || "",
  ML_CLIENT_SECRET: process.env.ML_CLIENT_SECRET || "",
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "",
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "",
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  REDIS_URL: process.env.REDIS_URL || "",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
};