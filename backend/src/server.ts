import app from "./app";
import { env } from "./config/env"
import "./config/supabase";
import { monitorarPerguntas } from "./jobs/monitor.job";
import { monitorarMensagens } from "./jobs/monitor-messages.job"
import { startEventsWorker, startTelegramWorker } from "./queues";

const SAFETY_POLLING_INTERVAL_MS = 5 * 60 * 1000;

const executarMonitor = async (
  nome: string,
  monitor: () => Promise<void>
) => {
  try {
    await monitor();
  } catch (error: any) {
    console.error(`Erro ao executar monitor de ${nome}:`);

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("DATA:", error.response.data);
      return;
    }

    console.error(error.message || error);
  }
};

app.listen(env.PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${env.PORT}`);
  startEventsWorker();
  startTelegramWorker();
  await executarMonitor("perguntas", monitorarPerguntas);
  await executarMonitor("mensagens", monitorarMensagens);
});

setInterval(async () => {
  await executarMonitor("perguntas", monitorarPerguntas);
}, SAFETY_POLLING_INTERVAL_MS);

setInterval(async () => {
  await executarMonitor("mensagens", monitorarMensagens);
}, SAFETY_POLLING_INTERVAL_MS);