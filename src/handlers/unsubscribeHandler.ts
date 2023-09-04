import { Context } from "grammy";
import { AppDataSource } from "../model/dataSource";
import { Subscriber } from "../model/subscriber";

export async function unsubscribeHandler(ctx: Context) {
  const id = ctx.from!.id.toString();
  const subscriber = await AppDataSource.getRepository(Subscriber).findOneBy({ id });

  if (subscriber === null) {
    return await ctx.reply("❌ Você ainda não está inscrito\\!\nUse \\/subscribe", {
      parse_mode: "MarkdownV2",
    });
  }

  await AppDataSource.getRepository(Subscriber).remove(subscriber);
  await ctx.reply("✅ Pronto, você não receberá mais os cardápios diariamente!");
}