import app from "./app";
import { env } from "./config/env"
import { monitorarPerguntas } from "./jobs/monitor.job";

app.listen(env.PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${env.PORT}`);
  await monitorarPerguntas();
});

setInterval(async () => {
  await monitorarPerguntas();
}, 30000);