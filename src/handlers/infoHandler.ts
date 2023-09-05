import { Context } from "grammy";
import { AppDataSource } from "../model/dataSource";
import { User } from "../model/user";
import { getInfo } from "../services/api/user";

export async function infoHandler(ctx: Context) {
  const id = ctx.from!.id.toString();
  const user = await AppDataSource.getRepository(User).findOneBy({ id });

  if (user === null) {
    return await ctx.reply("❌ Você ainda não está cadastrado\\!\nUse /cadastrar _\\<numero do cartao\\>_ _\\<matricula\\>_\nObs: Usuários isentos não podem usar esse comando :\\(", {
      parse_mode: "MarkdownV2",
    });
  }

  const { chat: { id: chat_id }, message_id } = await ctx.reply("⌛️ Aguarde um momento...\nIsso pode demorar um pouco dependendo do serviço da UFC")

  try {
    const userInfo = await getInfo(user);
    if (userInfo.credits > 2) {
      return await ctx.api.editMessageText(chat_id, message_id, `💳 ${user.name} você tem ${userInfo.credits} créditos!`);
    } else {
      return await ctx.api.editMessageText(chat_id, message_id, `⚠️ ${user.name} você tem apenas ${userInfo.credits} crédito(s)! ⚠️\nMelhor recarregar logo!`);
    }
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return await ctx.api.editMessageText(chat_id, message_id, error.message);
  }
}