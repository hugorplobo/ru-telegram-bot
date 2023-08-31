import { Context } from "grammy";

export async function feedbackHandler(ctx: Context) {
  const regex = /^\/feedback .+$/;
  const msg = ctx.msg!.text!;

  if (!regex.test(msg)) {
    return await ctx.reply("❌ Use o formato: /feedback _\\<mensagem\\>_", {
      parse_mode: "MarkdownV2",
    });
  }

  const text = msg.split(" ").slice(1).join(" ");

  await ctx.api.sendMessage(process.env.FEEDBACK_ID!, `Feedback recebido de @${ctx.from?.username}:\n\n${text}`);
  await ctx.reply("Feedback enviado com sucesso");
}