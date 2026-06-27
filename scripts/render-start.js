import { execSync } from "node:child_process";

// Free Render plan has no Pre-Deploy — run migrations at startup instead.
if (process.env.NODE_ENV === "production") {
  execSync("node scripts/db-deploy.js", { stdio: "inherit" });
}

execSync("tsx src/server.ts", { stdio: "inherit" });
