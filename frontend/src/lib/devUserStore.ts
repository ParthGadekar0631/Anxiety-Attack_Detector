import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export type DevUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

// globalThis cache so it persists during dev HMR
const g = globalThis as unknown as { __DEV_USERS__?: Map<string, DevUser> };

export const devUsers = g.__DEV_USERS__ ?? new Map<string, DevUser>();
g.__DEV_USERS__ = devUsers;

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(key, "hex");
  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}

export async function createUser(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase().trim();
  if (devUsers.has(email)) throw new Error("Email already in use");

  const passwordHash = await hashPassword(input.password);
  const user: DevUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  devUsers.set(email, user);
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export async function verifyUser(input: { email: string; password: string }) {
  const email = input.email.toLowerCase().trim();
  const user = devUsers.get(email);
  if (!user) throw new Error("Invalid email or password");

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}
