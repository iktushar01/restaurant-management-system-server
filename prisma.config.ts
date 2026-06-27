import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

/** Placeholder for `prisma generate` only — not used for migrations. */
const BUILD_TIME_DATABASE_URL =
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const args = process.argv.join(" ");
  const needsLiveDatabase =
    args.includes("migrate") ||
    args.includes("db push") ||
    args.includes("db pull") ||
    args.includes("db execute");

  if (needsLiveDatabase) {
    console.error(
      "\n❌ DATABASE_URL is not set.\n" +
        "   • Add DATABASE_URL in Render → Environment (Neon or Render Postgres URL)\n" +
        "   • Do NOT run `prisma migrate deploy` in the Build Command\n" +
        "   • Use Build Command: npm install\n" +
        "   • Use Pre-Deploy Command: npm run db:deploy\n",
    );
    process.exit(1);
  }

  return BUILD_TIME_DATABASE_URL;
}

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
