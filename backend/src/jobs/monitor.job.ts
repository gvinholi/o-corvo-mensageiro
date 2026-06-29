import { buscarPerguntasML } from "../services/mercadolivre/questions.service";
import { enviarTelegram } from "../services/telegram/telegram.service";
import { monitorStateRepository } from "../modules/monitor-state";
import { eventProcessor } from "../modules/event-processor";
import { telegramNotificationRepository } from "../modules/telegram-notifications";

const LAST_QUESTION_ID_STATE_KEY = "last_question_id";

let monitorPerguntasInicializado = false;

export const monitorarPerguntas = async () => {
  const perguntas = await buscarPerguntasML();
  const ultimoIdPergunta = await monitorStateRepository.getState(
    LAST_QUESTION_ID_STATE_KEY
  );

  if (!perguntas.length) {
    console.log("Nenhuma pergunta não respondida encontrada.");
    monitorPerguntasInicializado = true;
    return;
  }

  const perguntasOrdenadas = perguntas.sort(
    (a: any, b: any) =>
      new Date(b.date_created).getTime() -
      new Date(a.date_created).getTime()
  );

  const perguntaMaisRecente = perguntasOrdenadas[0];
  const idAtual = String(perguntaMaisRecente.id);

  console.log("Pergunta mais recente encontrada:");
  console.log("ID:", idAtual);
  console.log("Texto:", perguntaMaisRecente.text);
  console.log("Status:", perguntaMaisRecente.status);

  if (!monitorPerguntasInicializado && !ultimoIdPergunta) {
    await monitorStateRepository.saveState(LAST_QUESTION_ID_STATE_KEY, idAtual);
    monitorPerguntasInicializado = true;
    console.log("Primeira execução. ID salvo sem enviar notificação.");
    return;
  }

  monitorPerguntasInicializado = true;

  if (idAtual !== ultimoIdPergunta) {
    const processedEvent = await eventProcessor.process({
      source: "mercadolivre",
      payload: perguntaMaisRecente,
    });

    await monitorStateRepository.saveState(LAST_QUESTION_ID_STATE_KEY, idAtual);

    if (!processedEvent.processed || !processedEvent.event) {
      console.log("Pergunta já registrada anteriormente. Notificação ignorada.");
      return;
    }

    const mensagem = [
      "❓ Love Eletro: NOVA PERGUNTA",
      `Pergunta: ${perguntaMaisRecente.text}`,
    ].join("\n");

    const telegramEnviado = await enviarTelegram(mensagem);

    if (telegramEnviado) {
      await telegramNotificationRepository.createNotification({
        event_id: processedEvent.event.id,
        message: mensagem,
      });

      console.log("Nova pergunta detectada e enviada ao Telegram.");
      return;
    }

    console.log("Nova pergunta detectada, mas o envio ao Telegram falhou.");
  } else {
    console.log("Nenhuma nova pergunta detectada.");
  }
};