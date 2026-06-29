import { createClient } from "redis";
import { env } from "./env";

const redisPort = Number(env.REDIS_PORT);

if (!env.REDIS_URL && (Number.isNaN(redisPort) || redisPort <= 0)) {
  throw new Error("Configuração do Redis inválida. REDIS_PORT deve ser numérico.");
}

const redisSocketOptions = {
  connectTimeout: 1000,
  reconnectStrategy: false as const,
};

export const redisClient = createClient(
  env.REDIS_URL
    ? {
        url: env.REDIS_URL,
        socket: redisSocketOptions,
      }
    : {
        socket: {
          host: env.REDIS_HOST,
          port: redisPort,
          ...redisSocketOptions,
        },
        password: env.REDIS_PASSWORD || undefined,
      }
);

let redisConnectionPromise: Promise<typeof redisClient> | null = null;

redisClient.on("error", (error) => {
  console.error("Erro no cliente Redis:", error);
});

export const connectRedis = async () => {
  if (redisClient.isOpen) {
    return redisClient;
  }

  if (!redisConnectionPromise) {
    redisConnectionPromise = redisClient.connect().finally(() => {
      redisConnectionPromise = null;
    });
  }

  return redisConnectionPromise;
};
