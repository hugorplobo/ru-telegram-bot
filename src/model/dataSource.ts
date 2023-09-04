import { DataSource } from "typeorm";
import { User } from "./user";
import { Subscriber } from "./subscriber";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DATABASE_FILE!,
  synchronize: true,
  entities: [ User, Subscriber ],
});