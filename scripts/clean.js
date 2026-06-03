const fs = require("node:fs");
const path = require("node:path");

const targets = [
  path.resolve("frontend/.next"),
  path.resolve("ml-engine/.pytest_cache"),
  path.resolve(".pytest_cache"),
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`Removed ${target}`);
  }
}
