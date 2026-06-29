import { buscarPedidosML } from "../services/mercadolivre/orders.service";
import { buscarMensagensPorPedido } from "../services/mercadolivre/messages.service";
import { addTelegramJob } from "../queues";

let ultimoIdMensagem: string | null = null;
let monitorMensagensInicializado = false;

export const monitorarMensagens = async () => {
  const pedidos = await buscarPedidosML();

  if (!pedidos.length) {
    console.log("Nenhum pedido encontrado.");
    monitorMensagensInicializado = true;
    return;
  }

  const pedidoMaisRecente = pedidos[0];
  const orderId = pedidoMaisRecente.id;
  const packId = pedidoMaisRecente.pack_id ?? orderId;
  const sellerId = pedidoMaisRecente.seller?.id ?? pedidoMaisRecente.seller_id;

  const mensagens = await buscarMensagensPorPedido(orderId, packId, sellerId);

  if (!mensagens.length) {
    console.log("Nenhuma mensagem encontrada.");
    monitorMensagensInicializado = true;
    return;
  }

  const ultimaMensagem = mensagens[mensagens.length - 1];

  const idMensagem = String(ultimaMensagem.id);

  console.log("Última mensagem:", ultimaMensagem.text);

  if (!monitorMensagensInicializado) {
    ultimoIdMensagem = idMensagem;
    monitorMensagensInicializado = true;
    return;
  }

  if (idMensagem !== ultimoIdMensagem) {
    ultimoIdMensagem = idMensagem;

    const mensagem = `💬 Love Eletro: NOVA MENSAGEM\n${ultimaMensagem.text}`;
    const telegramJob = await addTelegramJob({
      jobId: `telegram:message:${idMensagem}`,
      data: {
        message: mensagem,
        metadata: {
          source: "monitorarMensagens",
          message_id: idMensagem,
          order_id: orderId,
          pack_id: packId,
        },
      },
    });

    console.log("Nova mensagem enfileirada para Telegram.", {
      jobId: telegramJob.id,
    });
  }
};