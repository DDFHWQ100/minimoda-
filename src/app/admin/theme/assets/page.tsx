import { FolderOpen } from "lucide-react";
import AssetsManager from "@/components/theme/assets-manager";

export const dynamic = "force-dynamic";

export default function AssetsPage() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><FolderOpen className="h-6 w-6 text-pink-600" /> مدیریت فایل‌ها و دارایی‌ها</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">تصاویر، فونت‌ها و فایل‌های آپلودی قالب — بارگذاری گروهی، جستجو، مشاهده حجم و حذف فایل‌های آپلودی.</p>
      <AssetsManager />
    </div>
  );
}
