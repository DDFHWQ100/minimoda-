import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

export function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}

export function verifyPassword(pw: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const hash = scryptSync(pw, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== hash.length) return false;
  return timingSafeEqual(keyBuf, hash);
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000);
  await db.insert(sessions).values({ token, userId, expiresAt });
  return { token, expiresAt };
}

export async function destroySession(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const store = await cookies();
    const token = store.get("mm_session")?.value;
    if (!token) return null;
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        role: users.role,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "mm_session";

/** حالت نمایش عمومی دمو: صفحات /admin بدون سشن هم قابل مشاهده هستند (فقط خواندنی) */
export function isAdminDemoOpen(): boolean {
  return process.env.ADMIN_DEMO_OPEN === "true";
}
