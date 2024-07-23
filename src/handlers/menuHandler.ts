import { Context } from "grammy";
import { menuManager } from "../services/caching/menu";
import { AppDataSource } from "../model/dataSource";
import { User } from "../model/user";
import { Subscriber } from "../model/subscriber";

export async function menuHandler(ctx: Context) {
  const { chat: { id: chat_id }, message_id } = await ctx.reply("⌛️ Um momento...");

  try {
    const menu = await menuManager.getMenu();

    if (menu.length < 1) {
      await ctx.reply("Sem cardápio cadastrado para hoje!");
      await ctx.api.deleteMessage(chat_id, message_id);
      return;
    }

    for (const meal of menu) {
      await ctx.reply(meal, {
        parse_mode: "MarkdownV2",
      });
    }

    await ctx.api.deleteMessage(chat_id, message_id);
    
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: ctx.from?.id.toString(),
    });

    const sub = await AppDataSource.getRepository(Subscriber).findOneBy({
      id: ctx.from?.id.toString(),
    });

    const today = new Date().toDateString();

    if (user !== null) {
      user.lastMenu = today;
      await AppDataSource.getRepository(User).save(user);
    } else if (sub !== null) {
      sub.lastMenu = today;
      await AppDataSource.getRepository(Subscriber).save(sub);
    }
  } catch (e) {
    const error = e as Error;
    console.error(error);
    await ctx.api.editMessageText(chat_id, message_id, error.message);
  }
}