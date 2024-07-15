import { Context } from "grammy";
import { AppDataSource } from "../model/dataSource";
import { User } from "../model/user";

export async function forwardHandler(ctx: Context) {
  const users = await AppDataSource.getRepository(User).find();

  for (const user of users) {
    await ctx.forwardMessage(user.id);
  }
}