import { Code2 } from "lucide-react";
import EditorForm from "@/components/theme/editor-form";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const { settings } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Code2 className="h-6 w-6 text-pink-600" /> ویرایشگر کد سفارشی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">CSS و JavaScript بدون نیاز به دسترسی به سرور — اعتبارسنجی آنی، اعمال در کل سایت، بازگردانی با یک کلیک.</p>
      <EditorForm initialCss={settings["custom.css"] ?? ""} initialJs={settings["custom.js"] ?? ""} initialHead={settings["custom.head"] ?? ""} />
    </div>
  );
}
