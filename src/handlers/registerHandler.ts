import { Context } from "grammy";
import { User } from "../model/user";
import { AppDataSource } from "../model/dataSource";
import { getInfo } from "../services/user/api";

export async function registerHandler(ctx: Context) {
  const regex = /^\/cadastrar \d{10} \d{6}$/;
  const msg = ctx.message!.text!;

  if (!regex.test(msg)) {
    return await ctx.reply("❌ Use o formato: /cadastrar _\\<numero do cartao\\>_ _\\<matricula\\>_", {
      parse_mode: "MarkdownV2",
    });
  }

  if (await AppDataSource.getRepository(User).findOneBy({ id: ctx.from!.id.toString() })) {
    return await ctx.reply("❌ Você já está cadastradado!\nUse /descadastrar para apagar sua conta");
  }

  const [_command, cardNumber, enrollment] = msg.split(" ");

  const user = new User();
  user.cardNumber = cardNumber;
  user.enrollment = enrollment;
  user.id = ctx.from!.id.toString();

  const { chat: { id }, message_id } = await ctx.reply("⌛️ Aguarde um momento...\nIsso pode demorar um pouco dependendo do serviço da UFC")

  try {
    const userInfo = await getInfo(user);
    user.name = userInfo.name;
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return await ctx.reply(error.message);
  }

  try {
    await AppDataSource.getRepository(User).save(user);
  } catch (e) {
    console.error(e);
    return await ctx.api.editMessageText(id, message_id, "Houve um problema, tente novamente :(\nObs: usuários isentos do RU não podem se cadastrar");
  }

  await ctx.api.editMessageText(id, message_id, `${user.name} você foi cadastrado com sucesso!`);
}