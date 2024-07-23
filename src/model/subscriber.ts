import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Subscriber {

  @PrimaryColumn("text")
  id: string;

  @Column("text", { nullable: true })
  lastMenu: string;

}