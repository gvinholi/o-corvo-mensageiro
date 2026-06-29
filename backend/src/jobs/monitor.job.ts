import { buscarPerguntasML } from "../services/mercadolivre/questions.service";
import { monitorStateRepository } from "../modules/monitor-state";
import { eventProcessor } from "../modules/event-processor";
import { addTelegramJob } from "../queues";

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

    const telegramJob = await addTelegramJob({
      jobId: `telegram:event:${processedEvent.event.id}`,
      data: {
        event_id: processedEvent.event.id,
        message: mensagem,
        metadata: {
          source: "monitorarPerguntas",
          question_id: idAtual,
        },
      },
    });

    console.log("Nova pergunta detectada e enfileirada para Telegram.", {
      jobId: telegramJob.id,
    });
  } else {
    console.log("Nenhuma nova pergunta detectada.");
  }
};