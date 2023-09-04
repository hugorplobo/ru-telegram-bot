import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Subscriber {
  @PrimaryColumn("text")
  id: string;
}