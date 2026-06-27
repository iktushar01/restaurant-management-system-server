import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

/** Used only for `prisma generate` when DATABASE_URL is not set (e.g. Render build). */
const BUILD_TIME_DATABASE_URL =
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL ?? BUILD_TIME_DATABASE_URL,
  },
});
