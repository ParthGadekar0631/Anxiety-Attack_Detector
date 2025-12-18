import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  LOG_LEVEL: z.string().default('info'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  MODEL_VERSION: z.string().default('v1')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('? Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. Please check your .env file.');
}

const { PORT, ALLOWED_ORIGINS, ...rest } = parsed.data;

export const env = {
  ...rest,
  port: Number(PORT) || 4000,
  allowedOrigins: ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
};
