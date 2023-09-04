import dayjs from "dayjs";
import { bot } from "../..";
import { AppDataSource } from "../../model/dataSource";
import { User } from "../../model/user";
import { menuManager } from "../caching/menu";

export async function scheduleMenu() {
  while (true) {
    const { trigger, millis } = getNextTrigger();

    console.log(`Novo agendamento para: ${trigger.toString()}`);

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

  const productionReady = false;
  if (productionReady) {
    const users = await AppDataSource.getRepository(User).find();

    for (const user of users) {
      for (const meal of menu) {
        bot.api.sendMessage(Number(user.id), meal)
          .catch(e => console.error(e));
      }
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
  const trigger = now.add(1, "day").hour(8).minute(0).second(0);
  const diffMilliseconds = trigger.diff(now);

  return {
    trigger,
    millis: diffMilliseconds,
  };
}