import dayjs from "dayjs";
import { AppDataSource } from "../../model/dataSource";
import { User } from "../../model/user";
import { Subscriber } from "../../model/subscriber";
import { bot } from "../../index";

export async function scheduleReminder() {
  while (true) {
    const { trigger, millis } = getNextTrigger();

    console.log(`Novo agendamento de cardápio para: ${trigger.toDate().toLocaleString()}`);

    await new Promise(resolve => setTimeout(resolve, millis));

    console.log("Disparando notificações!");
    sendReminderForAllUsers();
  }
}

async function sendReminderForAllUsers() {
  const msg = "🔔 Lembre-se de agendar suas refeições para amanhã!";
  const usersAndSubs = [
    ...await AppDataSource.getRepository(User).find(),
    ...await AppDataSource.getRepository(Subscriber).find(),
  ];

  const productionReady = false;

  if (productionReady) {
    for (const user of usersAndSubs) {
      bot.api.sendMessage(Number(user.id), msg);
    }
  } else {
    await bot.api.sendMessage(Number(process.env.FEEDBACK_ID!), msg);
  }
}

function getNextTrigger() {
  const now = dayjs();
  const timeZoneOffset = 3;
  let trigger = now
    .add(1, "day")
    .hour(20 + timeZoneOffset)
    .minute(0)
    .second(0);

  while (trigger.day() == 5 || trigger.day() == 6) {
    trigger = trigger.add(1, "day");
  }

  const diffMilliseconds = trigger.diff(now);

  return {
    trigger,
    millis: diffMilliseconds,
  };
}