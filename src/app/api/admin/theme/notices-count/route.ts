import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { notices } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [{ c }] = await db.select({ c: sql<number>`count(*)` }).from(notices).where(eq(notices.read, false));
    return NextResponse.json({ unread: Number(c) });
  } catch {
    return NextResponse.json({ unread: 0 });
  }
}
