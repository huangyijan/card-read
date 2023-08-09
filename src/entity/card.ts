import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  email: string;
  @Column("text")
  en_name: string;
  @Column("text")
  compony: string;
  @Column("text")
  en_compony: string;
  @Column("text")
  phone: string;
  @Column("text")
  mobile: string;
  @Column("text")
  fax: string;
  @Column("text")
  link: string;
  @Column("text")
  position: string;
  @Column("text")
  apartment: string;
  @Column("text")
  en_apartment: string;
  @Column("text")
  en_address: string;
  @Column("text")
  en_position: string;
  @Column("text")
  others: string;
  @Column("text")
  url: string;

  constructor() {
    this.name = ''
    this.en_name = ''
    this.apartment = ''
    this.compony = ''
    this.email = ''
    this.fax = ''
    this.link = ''
    this.phone = ''
    this.mobile = ''
    this.en_address = ''
    this.en_apartment = ''
    this.en_compony = ''
    this.en_position = ''
    this.position = ''
    this.others = ''
    this.url = ''
  }
}