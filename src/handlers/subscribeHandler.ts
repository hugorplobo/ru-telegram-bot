import { Context } from "grammy";
import { AppDataSource } from "../model/dataSource";
import { User } from "../model/user";
import { Subscriber } from "../model/subscriber";

export async function subscribeHandler(ctx: Context) {
  const user = await AppDataSource.getRepository(User)
    .findOneBy({ id: ctx.from!.id.toString() });

  if (user) {
    return await ctx.reply("❌ Você já está cadastrado e não precisa usar esse comando! Apenas usuários isentos se encaixam nessa categoria");
  }

  const subscriber = new Subscriber();
  subscriber.id = ctx.from!.id.toString();

  await AppDataSource.getRepository(Subscriber).save(subscriber);
  await ctx.reply("✅ Pronto, você receberá o cardápio diariamente!");
}