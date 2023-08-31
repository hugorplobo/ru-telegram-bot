import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn("text")
  id: string;

  @Column("text")
  name: string;

  @Column("text")
  cardNumber: string;

  @Column("text")
  enrollment: string;
}