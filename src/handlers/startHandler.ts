import { Context } from "grammy";

export async function startHandler(ctx: Context) {
  await ctx.reply(`
    /start ou /ajuda - Envia essa mensagem
    /cadastrar <numero do cartão> <matrícula> - Cadastre seu cartão para consultas
    /descadastrar - Remova seu cartão do banco de dados
    /info - Verifique quantos créditos você possui
    /cardapio - Receba o cardápio do dia
    /feedback <mensagem> - Envie uma mensagem ao desenvolvedor, o seu nome de usuário também é compartilhado!
    
    Em breve envio automático do cardápio e créditos diariamente!
  `.replace(/^ +/gm, ""));
}