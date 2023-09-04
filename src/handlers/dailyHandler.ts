import { Context } from "grammy";
import { sendMenuForAllUsers } from "../services/schedule/schedule";

export async function dailyHandler(ctx: Context) {
  if (ctx.from!.id.toString() !== process.env.FEEDBACK_ID!) {
    return await ctx.reply("Ops, você não devia ter descoberto isso 👀\nMas apenas o desenvolvedor possui permissão para executar esse comando!");
  }

  const { chat: { id }, message_id } = await ctx.reply("Enviando...");
  await sendMenuForAllUsers();
  await ctx.api.editMessageText(id, message_id, "Enviado!");
}