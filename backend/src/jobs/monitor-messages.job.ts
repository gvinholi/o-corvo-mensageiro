import { buscarPedidosML } from "../services/mercadolivre/orders.service";
import { buscarMensagensPorPedido } from "../services/mercadolivre/messages.service";
import { enviarTelegram } from "../services/telegram/telegram.service";
import { telegramNotificationRepository } from "../modules/telegram-notifications";

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

  const mensagens = await buscarMensagensPorPedido(orderId);

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
    const telegramEnviado = await enviarTelegram(mensagem);

    if (telegramEnviado) {
      await telegramNotificationRepository.createNotification({
        message: mensagem,
      });

      console.log("Nova mensagem enviada ao Telegram.");
      return;
    }

    console.log("Nova mensagem detectada, mas o envio ao Telegram falhou.");
  }
};