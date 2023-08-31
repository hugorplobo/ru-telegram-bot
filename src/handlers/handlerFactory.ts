import { Context } from "grammy";
import { registerHandler } from "./registerHandler";
import { infoHandler } from "./infoHandler";
import { unregisterHandler } from "./unregisterHandler";
import { menuHandler } from "./menuHandler";
import { startHandler } from "./startHandler";
import { feedbackHandler } from "./feedbackHandler";

export enum FactoryError {
  INVALID_COMMAND = "Comando inválido",
};

export function createHandler(msg: string): (ctx: Context) => Promise<unknown> {
  const handlers = {
    "/cadastrar": registerHandler,
    "/info": infoHandler,
    "/descadastrar": unregisterHandler,
    "/cardapio": menuHandler,
    "/feedback": feedbackHandler,
    "/start": startHandler,
    "/ajuda": startHandler,
  };

  const command = msg.split(" ")[0];

  if (command in handlers) {
    return handlers[command as keyof typeof handlers];
  }

  throw new Error(FactoryError.INVALID_COMMAND);
}
