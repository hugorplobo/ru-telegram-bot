import { Context } from "grammy";
import { registerHandler } from "./registerHandler";
import { infoHandler } from "./infoHandler";
import { unregisterHandler } from "./unregisterHandler";
import { menuHandler } from "./menuHandler";
import { startHandler } from "./startHandler";
import { feedbackHandler } from "./feedbackHandler";
import { dailyHandler } from "./dailyHandler";
import { subscribeHandler } from "./subscribeHandler";
import { unsubscribeHandler } from "./unsubscribeHandler";
import { forwardHandler } from "./forwardHandler";

export enum FactoryError {
  INVALID_COMMAND = "Comando inválido",
}

type Handler = (ctx: Context) => Promise<unknown>;

export function createHandler(ctx: Context): Handler {
  const handlers = {
    "/cadastrar": registerHandler,
    "/info": infoHandler,
    "/descadastrar": unregisterHandler,
    "/cardapio": menuHandler,
    "/feedback": feedbackHandler,
    "/start": startHandler,
    "/ajuda": startHandler,
    "/daily": dailyHandler,
    "/subscribe": subscribeHandler,
    "/unsubscribe": unsubscribeHandler,
  };

  const command = ctx.msg?.text?.split(" ")[0];

  if (command && command in handlers) {
    return handlers[command as keyof typeof handlers];
  } else if (`${ctx.from?.id}` === process.env.FEEDBACK_ID!) {
    return forwardHandler;
  }

  throw new Error(FactoryError.INVALID_COMMAND);
}
