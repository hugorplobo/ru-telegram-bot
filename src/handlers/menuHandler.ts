import { Context } from "grammy";
import { getInfo } from "../services/menu/api";

export async function menuHandler(ctx: Context) {
  const { chat: { id: chat_id }, message_id } = await ctx.reply("⌛️ Um momento...");

  try {
    const menu = await getInfo();
    const formattedTexts: string[] = [];

    Object.values(menu).forEach(value => {
      let string = `🍽 *${value.title}*: \n\n`;

      for (const [type, meal] of value.data) {
        string += `*${type}*: ${meal}\n`;
      }

      formattedTexts.push(string);
    });

    for (const text of formattedTexts) {
      await ctx.reply(text, { parse_mode: "MarkdownV2" });
    }

    await ctx.api.deleteMessage(chat_id, message_id);
  } catch (e) {
    const error = e as Error;
    console.error(error);
    await ctx.api.editMessageText(chat_id, message_id, error.message);
  }
}