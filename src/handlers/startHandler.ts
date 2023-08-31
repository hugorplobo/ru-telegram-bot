import { Context } from "grammy";

export async function startHandler(ctx: Context) {
  await ctx.reply(`
    /cadastrar <numero do cartão> <matrícula> - Cadastre seu cartão para consultas\n
    /descadastrar - Remova seu cartão do banco de dados\n
    /info - Verifique quantos créditos você possui\n
    /cardapio - Receba o cardápio do dia\n
    /feedback <mensagem> - Envie uma mensagem ao desenvolvedor, o seu nome de usuário também é compartilhado!\n\n
    \nEm breve envio automático do cardápio e créditos diariamente!
  `.replace(/^[\s\t]+/gm, ""));
}