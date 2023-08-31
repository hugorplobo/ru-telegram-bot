import { DataSource } from "typeorm";
import { User } from "./user";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DATABASE_FILE!,
  synchronize: true,
  entities: [ User ],
});