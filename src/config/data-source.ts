import "reflect-metadata";
import { DataSource } from "typeorm";
import { Offer } from "../entity/offer.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "PAss123",
  database: "almedia",
  entities: [Offer],
  synchronize: true, // OK for challenge, false in real prod
  logging: false,
});
