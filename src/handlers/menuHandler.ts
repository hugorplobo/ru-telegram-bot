import { Context } from "grammy";
import { menuManager } from "../services/caching/menu";

export async function menuHandler(ctx: Context) {
  const { chat: { id: chat_id }, message_id } = await ctx.reply("⌛️ Um momento...");

  try {
    const menu = await menuManager.getMenu();

    for (const meal of menu) {
      await ctx.reply(meal, {
        parse_mode: "MarkdownV2",
      });
    }

    await ctx.api.deleteMessage(chat_id, message_id);
  } catch (e) {
    const error = e as Error;
    console.error(error);
    await ctx.api.editMessageText(chat_id, message_id, error.message);
  }
}