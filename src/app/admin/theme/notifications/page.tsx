import { Bell } from "lucide-react";
import NotificationsPanel from "@/components/theme/notifications-panel";
import { db } from "@/db";
import { notices } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const all = await db.select().from(notices).orderBy(desc(notices.createdAt));
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Bell className="h-6 w-6 text-pink-600" /> اعلان‌ها و هشدارهای مدیریتی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">نسخه جدید قالب، هشدار سازگاری، نکات امنیتی و پیام‌های سیستم — همه در یک‌جا</p>
      <NotificationsPanel notices={all.map((n) => ({ id: n.id, level: n.level, title: n.title, body: n.body, read: n.read, createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : String(n.createdAt) }))} />
    </div>
  );
}
