import dayjs from "dayjs";
import { bot } from "../..";
import { AppDataSource } from "../../model/dataSource";
import { User } from "../../model/user";
import { menuManager } from "../caching/menu";
import { Subscriber } from "../../model/subscriber";
import { getInfo } from "../api/user";

export async function scheduleMenu() {
  while (true) {
    const { trigger, millis } = getNextTrigger();

    console.log(`Novo agendamento de cardápio para: ${trigger.toDate().toLocaleString()}`);

    await new Promise(resolve => setTimeout(resolve, millis));

    console.log("Disparando cardápios!");
    sendMenuForAllUsers();
  }
}

export async function sendMenuForAllUsers() {
  const menu = await menuManager.getMenu();
  console.log(menu);

  if (menu.length > 0 && menu[0].startsWith("Sem")) {
    return;
  }

  const productionReady = true;

  if (productionReady) {
    const users = await AppDataSource.getRepository(User).find();
    const subs = await AppDataSource.getRepository(Subscriber).find();

    for (const user of users) {
      sendMessage(menu, user.id)
        .then(() => sendInfo(user))
        .catch(e => console.error(e));
    }

    for (const sub of subs) {
      sendMessage(menu, sub.id)
        .catch(e => console.error(e));
    }
  } else {
    for (const meal of menu) {
      await bot.api.sendMessage(Number(process.env.FEEDBACK_ID!), meal, { parse_mode: "MarkdownV2" })
        .catch(e => console.error(e));
    }
  }
}

async function sendMessage(menu: string[], id: string) {
  if (menu.length < 1) {
    await bot.api.sendMessage(Number(id), "Nenhum cardápio foi cadastrado até o momento 😞\nCaso deseje, use /cardapio mais tarde para verificar se já foi publicado");
  }

  for (const meal of menu) {
    await bot.api.sendMessage(Number(id), meal, { parse_mode: "MarkdownV2" });
  }
}

async function sendInfo(user: User) {
  try {
    const { credits } = await getInfo(user);

    if (credits > 2) {
      bot.api.sendMessage(user.id, `💳 ${user.name} você tem ${credits} créditos!`);
    } else {
      bot.api.sendMessage(user.id, `⚠️ ${user.name} você tem apenas ${credits} crédito(s)! ⚠️\nMelhor recarregar para amanhã!`);
    }
  } catch (_) {
    bot.api.sendMessage(user.id, `❌ Houve um erro ao verificar os seus créditos, use /info caso seja necessário!`);
  }
}

function getNextTrigger() {
  const now = dayjs();
  const timeZoneOffset = 3;
  const trigger = now.add(1, "day").hour(10 + timeZoneOffset).minute(0).second(0);
  const diffMilliseconds = trigger.diff(now);

  return {
    trigger,
    millis: diffMilliseconds,
  };
}