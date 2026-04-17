import { buscarPerguntasML } from "../services/mercadolivre.service";
import { enviarTelegram } from "../services/telegram.service";

let ultimoId: string | null = null;

export const monitorarPerguntas = async () => {
  const perguntas = await buscarPerguntasML();

  if (!perguntas.length) return;

  const ordenadas = perguntas.sort(
    (a: any, b: any) =>
      new Date(b.date_created).getTime() -
      new Date(a.date_created).getTime()
  );

  const maisRecente = ordenadas[0];

  console.log("Pergunta mais recente:", maisRecente.id, maisRecente.text);

  if (!ultimoId) {
    ultimoId = String(maisRecente.id);
    return;
  }

  if (String(maisRecente.id) !== ultimoId) {
    ultimoId = String(maisRecente.id);

    await enviarTelegram(
      `❓ Love Eletro: NOVA PERGUNTA\n${maisRecente.text}`
    );

    console.log("Nova pergunta detectada e enviada!");
  }
};