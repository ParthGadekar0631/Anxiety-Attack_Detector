const path = require("path");
const crypto = require("crypto");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production");
}

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex"),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  mlEngineUrl: process.env.ML_ENGINE_URL || "http://localhost:8000",
  aiProvider: process.env.AI_PROVIDER || "mock",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  smsProvider: process.env.SMS_PROVIDER || "mock",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  enableLocationLogging: process.env.ENABLE_LOCATION_LOGGING !== "false",
};

module.exports = { env };
