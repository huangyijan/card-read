import "reflect-metadata"
import { DataSource } from "typeorm"
import { Card } from "../../entity/card"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "card_read",
    entities: [Card],
    synchronize: true,
    logging: false,
})

let cachedDb = null as DataSource | null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await AppDataSource.initialize()
  const db = AppDataSource
  cachedDb = db;
  return db;
}

export function withDatabase(handler) {
  return async (req, res) => {
    const db = await connectToDatabase();
    req.db = db;
    return handler(req, res);
  };
}