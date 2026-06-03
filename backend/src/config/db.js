const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDb() {
  if (!env.mongoUri) {
    return { connected: false, reason: "MONGO_URI not configured; using in-memory store" };
  }

  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 2500 });
    return { connected: true, reason: "MongoDB connected" };
  } catch (error) {
    return {
      connected: false,
      reason: `MongoDB unavailable; using in-memory store (${error.message})`,
    };
  }
}

module.exports = { connectDb };
