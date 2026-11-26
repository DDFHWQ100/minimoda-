import { Code2 } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { codeHistory } from "@/db/schema";
import EditorForm from "@/components/theme/editor-form";
import CodeHistory from "@/components/theme/code-history";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const { settings } = await getThemeBundle();
  const history = await db.select().from(codeHistory).orderBy(desc(codeHistory.createdAt)).limit(40);
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Code2 className="h-6 w-6 text-pink-600" /> ویرایشگر کد سفارشی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">CSS و JavaScript بدون نیاز به دسترسی به سرور — اعتبارسنجی آنی، اعمال در کل سایت، بازگردانی با یک کلیک.</p>
      <EditorForm initialCss={settings["custom.css"] ?? ""} initialJs={settings["custom.js"] ?? ""} initialHead={settings["custom.head"] ?? ""} />
      <h2 className="mt-6 text-[13px] font-black text-[#14264a]">تاریخچه تغییرات و مقایسه نسخه‌ها</h2>
      <p className="text-[10px] text-slate-400 mb-2">هر بار که ذخیره می‌کنید نسخه قبلی نگه داشته می‌شود؛ تفاوت‌ها را ببینید و با یک کلیک بازگردانید.</p>
      <CodeHistory
        history={history.map((h) => ({ id: h.id, key: h.key, content: h.content, createdBy: h.createdBy, createdAt: h.createdAt instanceof Date ? h.createdAt.toISOString() : String(h.createdAt) }))}
        current={{ "custom.css": settings["custom.css"] ?? "", "custom.js": settings["custom.js"] ?? "", "custom.head": settings["custom.head"] ?? "" }}
      />
    </div>
  );
}
