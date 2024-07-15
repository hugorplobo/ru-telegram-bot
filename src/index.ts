import "reflect-metadata";
import "dotenv/config";
import { Bot, Context } from "grammy";
import { AppDataSource } from "./model/dataSource";
import { createHandler } from "./handlers/handlerFactory";
import { scheduleMenu } from "./services/schedule/schedule";

export const bot = new Bot(process.env.TOKEN!);

async function handleMessage(ctx: Context) {
  try {
    const handler = createHandler(ctx);
    await handler(ctx);
  } catch (e) {
    const error = e as Error;
    console.error(error);

    ctx.reply(error.message)
      .catch(err => console.error(err));
  }
}

async function bootstrap() {
  await AppDataSource.initialize();
  scheduleMenu();

  bot.on("message", async ctx => {
    handleMessage(ctx);
  });

  bot.start({
    onStart: () => console.log("Bot online!"),
  });
}

bootstrap();