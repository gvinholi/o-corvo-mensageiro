import { buscarPedidosML } from "../services/mercadolivre/orders.service";
import { buscarMensagensPorPedido } from "../services/mercadolivre/messages.service";
import { addTelegramJob } from "../queues";
import { eventProcessor } from "../modules/event-processor";
import { monitorStateRepository } from "../modules/monitor-state";

const LAST_MESSAGE_ID_STATE_KEY = "last_message_id";

let monitorMensagensInicializado = false;

const getMessageTimestamp = (mensagem: any) =>
  mensagem.date_created ||
  mensagem.created_at ||
  mensagem.message_date ||
  mensagem.date ||
  "";

const ordenarMensagensPorDataCrescente = (mensagens: any[]) =>
  mensagens.sort((a: any, b: any) => {
    const timestampA = new Date(getMessageTimestamp(a)).getTime();
    const timestampB = new Date(getMessageTimestamp(b)).getTime();

    if (Number.isNaN(timestampA) || Number.isNaN(timestampB)) {
      return 0;
    }

    return timestampA - timestampB;
  });

const criarPayloadMensagem = (
  mensagem: any,
  orderId: number,
  packId?: number | null,
  sellerId?: number | null
) => ({
  ...mensagem,
  topic: "messages",
  resource: `/messages/${mensagem.id}`,
  order_id: orderId,
  pack_id: packId,
  seller_id: sellerId,
});

const processarMensagemComoReconciliacao = async (
  mensagem: any,
  orderId: number,
  packId?: number | null,
  sellerId?: number | null
) => {
  const idMensagem = String(mensagem.id);
  const payload = criarPayloadMensagem(mensagem, orderId, packId, sellerId);
  const processedEvent = await eventProcessor.process({
    source: "mercadolivre",
    payload,
  });

  if (!processedEvent.processed || !processedEvent.event) {
    console.log("Reconciliação de mensagens: evento já processado.", {
      message_id: idMensagem,
    });
    return;
  }

  const telegramJob = await addTelegramJob({
    jobId: `telegram:event:${processedEvent.event.id}`,
    data: {
      event_id: processedEvent.event.id,
      message: `💬 Love Eletro: NOVA MENSAGEM\n${mensagem.text}`,
      metadata: {
        source: "monitorarMensagens",
        mode: "safety_polling",
        message_id: idMensagem,
        order_id: orderId,
        pack_id: packId,
      },
    },
  });

  console.log("Reconciliação de mensagens: evento perdido enfileirado.", {
    message_id: idMensagem,
    event_id: processedEvent.event.id,
    telegramJobId: telegramJob.id,
  });
};

export const monitorarMensagens = async () => {
  const pedidos = await buscarPedidosML();
  const ultimoIdMensagem = await monitorStateRepository.getState(
    LAST_MESSAGE_ID_STATE_KEY
  );

  if (!pedidos.length) {
    console.log("Reconciliação de mensagens: nenhum pedido encontrado.");
    monitorMensagensInicializado = true;
    return;
  }

  const pedidoMaisRecente = pedidos[0];
  const orderId = pedidoMaisRecente.id;
  const packId = pedidoMaisRecente.pack_id ?? orderId;
  const sellerId = pedidoMaisRecente.seller?.id ?? pedidoMaisRecente.seller_id;

  const mensagens = await buscarMensagensPorPedido(orderId, packId, sellerId);

  if (!mensagens.length) {
    console.log("Reconciliação de mensagens: nenhuma mensagem encontrada.");
    monitorMensagensInicializado = true;
    return;
  }

  const mensagensOrdenadas = ordenarMensagensPorDataCrescente(mensagens);
  const ultimaMensagem = mensagensOrdenadas[mensagensOrdenadas.length - 1];
  const idMaisRecente = String(ultimaMensagem.id);

  console.log("Reconciliação de mensagens iniciada:", {
    total: mensagensOrdenadas.length,
    last_message_id: ultimoIdMensagem,
    most_recent_message_id: idMaisRecente,
    order_id: orderId,
  });

  if (!monitorMensagensInicializado && !ultimoIdMensagem) {
    await monitorStateRepository.saveState(
      LAST_MESSAGE_ID_STATE_KEY,
      idMaisRecente
    );
    monitorMensagensInicializado = true;
    console.log(
      "Primeira reconciliação de mensagens. Checkpoint salvo sem processar backlog."
    );
    return;
  }

  monitorMensagensInicializado = true;

  for (const mensagem of mensagensOrdenadas) {
    await processarMensagemComoReconciliacao(
      mensagem,
      orderId,
      packId,
      sellerId
    );
    await monitorStateRepository.saveState(
      LAST_MESSAGE_ID_STATE_KEY,
      String(mensagem.id)
    );
  }
};