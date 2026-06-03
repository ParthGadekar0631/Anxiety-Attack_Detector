const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDb() {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is required. The API no longer supports an in-memory persistence fallback.");
  }

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  return { connected: true, reason: "MongoDB connected" };
}

async function disconnectDb() {
  await mongoose.disconnect();
}

module.exports = { connectDb, disconnectDb };
