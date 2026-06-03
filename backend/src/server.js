const { createApp } = require("./app");
const { connectDb } = require("./config/db");
const { env } = require("./config/env");

async function main() {
  const db = await connectDb();
  console.log(db.reason);
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}/api/health`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
