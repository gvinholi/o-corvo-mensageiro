import { buscarPerguntasML } from "../services/mercadolivre/questions.service";
import { monitorStateRepository } from "../modules/monitor-state";
import { eventProcessor } from "../modules/event-processor";
import { addTelegramJob } from "../queues";

const LAST_QUESTION_ID_STATE_KEY = "last_question_id";

let monitorPerguntasInicializado = false;

const ordenarPerguntasPorDataCrescente = (perguntas: any[]) =>
  perguntas.sort(
    (a: any, b: any) =>
      new Date(a.date_created).getTime() -
      new Date(b.date_created).getTime()
  );

const criarMensagemPergunta = (pergunta: any) =>
  ["❓ Love Eletro: NOVA PERGUNTA", `Pergunta: ${pergunta.text}`].join("\n");

const processarPerguntaComoReconciliacao = async (pergunta: any) => {
  const idPergunta = String(pergunta.id);
  const processedEvent = await eventProcessor.process({
    source: "mercadolivre",
    payload: pergunta,
  });

  if (!processedEvent.processed || !processedEvent.event) {
    console.log("Reconciliação de perguntas: evento já processado.", {
      question_id: idPergunta,
    });
    return;
  }

  const telegramJob = await addTelegramJob({
    jobId: `telegram:event:${processedEvent.event.id}`,
    data: {
      event_id: processedEvent.event.id,
      message: criarMensagemPergunta(pergunta),
      metadata: {
        source: "monitorarPerguntas",
        mode: "safety_polling",
        question_id: idPergunta,
      },
    },
  });

  console.log("Reconciliação de perguntas: evento perdido enfileirado.", {
    question_id: idPergunta,
    event_id: processedEvent.event.id,
    telegramJobId: telegramJob.id,
  });
};

export const monitorarPerguntas = async () => {
  const perguntas = await buscarPerguntasML();
  const ultimoIdPergunta = await monitorStateRepository.getState(
    LAST_QUESTION_ID_STATE_KEY
  );

  if (!perguntas.length) {
    console.log("Reconciliação de perguntas: nenhuma pergunta pendente.");
    monitorPerguntasInicializado = true;
    return;
  }

  const perguntasOrdenadas = ordenarPerguntasPorDataCrescente(perguntas);
  const perguntaMaisRecente = perguntasOrdenadas[perguntasOrdenadas.length - 1];
  const idMaisRecente = String(perguntaMaisRecente.id);

  console.log("Reconciliação de perguntas iniciada:", {
    total: perguntasOrdenadas.length,
    last_question_id: ultimoIdPergunta,
    most_recent_question_id: idMaisRecente,
  });

  if (!monitorPerguntasInicializado && !ultimoIdPergunta) {
    await monitorStateRepository.saveState(
      LAST_QUESTION_ID_STATE_KEY,
      idMaisRecente
    );
    monitorPerguntasInicializado = true;
    console.log(
      "Primeira reconciliação de perguntas. Checkpoint salvo sem processar backlog."
    );
    return;
  }

  monitorPerguntasInicializado = true;

  for (const pergunta of perguntasOrdenadas) {
    await processarPerguntaComoReconciliacao(pergunta);
    await monitorStateRepository.saveState(
      LAST_QUESTION_ID_STATE_KEY,
      String(pergunta.id)
    );
  }
};