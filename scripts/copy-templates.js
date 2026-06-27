import fs from "fs";
import path from "path";

const sourceDir = path.join("src", "app", "templates");
const targetDir = path.join("dist", "app", "templates");

if (!fs.existsSync(sourceDir)) {
  throw new Error(`EJS templates not found at ${sourceDir}`);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Copied EJS templates to ${targetDir}`);
