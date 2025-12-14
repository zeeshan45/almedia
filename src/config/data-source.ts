import { DataSource } from "typeorm";
import { Offer } from "../entity/offer.entity";
// console.log(process.env.DB_HOST);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Offer],
  synchronize: true, // challenge only
  logging: false,
});

