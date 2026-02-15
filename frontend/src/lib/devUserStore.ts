import bcrypt from "bcryptjs";

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

export async function createUser(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase().trim();
  if (devUsers.has(email)) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(input.password, 10);
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

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}
