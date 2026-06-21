import "dotenv/config";
import { PrismaClient } from "../prisma/client/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString = process.env.DATABASE_URL;

const regex = /^mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)$/;
const match = connectionString?.match(regex);
if (!match) {
  throw new Error("Invalid DATABASE_URL");
}

const [, user, password, host, port, database] = match;

const adapter = new PrismaMariaDb({
  user,
  password,
  database,
  host,
  port: Number(port),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
