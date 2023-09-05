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

    console.log(`Novo agendamento para: ${trigger.toDate().toLocaleString()}`);

    await new Promise(resolve => setTimeout(resolve, millis));

    console.log("Disparando mensagens!");
    sendMenuForAllUsers();
  }
}

export async function sendMenuForAllUsers() {
  const menu = await menuManager.getMenu();

  if (menu.length < 2) {
    return;
  }

  const productionReady = true;
  if (productionReady) {
    const users = await AppDataSource.getRepository(User).find();
    const subs = await AppDataSource.getRepository(Subscriber).find();

    for (const user of users) {
      const { credits } = await getInfo(user);

      Promise.all(menu.map(meal => bot.api.sendMessage(Number(user.id), meal, { parse_mode: "MarkdownV2" })))
        .then(() => {
          if (credits > 2) {
            bot.api.sendMessage(user.id, `💳 ${user.name} você tem ${credits} créditos!`);
          } else {
            bot.api.sendMessage(user.id, `⚠️ ${user.name} você tem apenas ${credits} crédito(s)! ⚠️\nMelhor recarregar para amanhã!`);
          }
        })
        .catch(e => console.error(e));
    }

    for (const sub of subs) {
      Promise.all(menu.map(meal => bot.api.sendMessage(sub.id, meal, { parse_mode: "MarkdownV2" })))
        .catch(e => console.error(e));
    }
  } else {
    for (const meal of menu) {
      await bot.api.sendMessage(Number(process.env.FEEDBACK_ID!), meal, { parse_mode: "MarkdownV2" })
        .catch(e => console.error(e));
    }
  }
}

function getNextTrigger() {
  const now = dayjs();
  const timeZoneOffset = 3;
  const trigger = now.add(1, "day").hour(8 + timeZoneOffset).minute(0).second(0);
  const diffMilliseconds = trigger.diff(now);

  return {
    trigger,
    millis: diffMilliseconds,
  };
}