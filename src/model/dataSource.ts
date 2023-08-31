import { DataSource } from "typeorm";
import { User } from "./user";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  synchronize: true,
  entities: [ User ],
});