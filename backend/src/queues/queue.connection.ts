import { ConnectionOptions } from "bullmq";
import { env } from "../config/env";

const redisPort = Number(env.REDIS_PORT);

if (!env.REDIS_URL && (Number.isNaN(redisPort) || redisPort <= 0)) {
  throw new Error("Configuração do Redis inválida. REDIS_PORT deve ser numérico.");
}

const buildRedisUrlConnection = (redisUrl: string): ConnectionOptions => {
  const url = new URL(redisUrl);

  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password ? decodeURIComponent(url.password) : undefined,
    tls: url.protocol === "rediss:" ? {} : undefined,
    connectTimeout: 5000,
    maxRetriesPerRequest: null,
  };
};

export const queueConnection: ConnectionOptions = env.REDIS_URL
  ? buildRedisUrlConnection(env.REDIS_URL)
  : {
      host: env.REDIS_HOST,
      port: redisPort,
      password: env.REDIS_PASSWORD || undefined,
      connectTimeout: 5000,
      maxRetriesPerRequest: null,
    };
