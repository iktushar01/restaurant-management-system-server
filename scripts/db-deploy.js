import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.error(
    "\n❌ DATABASE_URL is not set.\n" +
      "   Add it in Render → Environment (copy from Neon or Render Postgres).\n" +
      "   Migrations cannot run without a database connection.\n",
  );
  process.exit(1);
}

console.log("Running prisma migrate deploy...");
execSync("prisma migrate deploy", { stdio: "inherit" });
