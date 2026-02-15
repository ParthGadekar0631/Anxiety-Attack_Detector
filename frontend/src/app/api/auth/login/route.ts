import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/devUserStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await verifyUser({ email, password });
    const token = `dev.${user.id}.${Date.now()}`;

    return NextResponse.json({ user, token }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Login failed" }, { status: 401 });
  }
}
