import "reflect-metadata"
import { DataSource } from "typeorm"
import { Card } from "../../entity/card"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "card_read",
    password: "jGeAwjMxxhXh8yxC",
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