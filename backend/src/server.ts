import app from "./app";
import { monitorarPerguntas } from "./jobs/monitor.job";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

setInterval(async () => {
  await monitorarPerguntas();
}, 30000);