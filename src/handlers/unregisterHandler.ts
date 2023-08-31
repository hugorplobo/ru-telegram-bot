import { Context } from "grammy";
import { AppDataSource } from "../model/dataSource";
import { User } from "../model/user";

export async function unregisterHandler(ctx: Context) {
  const id = ctx.from!.id.toString();
  const user = await AppDataSource.getRepository(User).findOneBy({ id });

  if (user === null) {
    return await ctx.reply("❌ Você ainda não está cadastrado\\!\nUse /cadastrar _\\<numero do cartao\\>_ _\\<matricula\\>_", {
      parse_mode: "MarkdownV2",
    });
  }

  await AppDataSource.getRepository(User).remove(user);
  await ctx.reply("✅ Seu cadastro foi apagado com sucesso!");
}