import "dotenv/config";
import { spawnSync } from "child_process";

/** اجرای همه seedها به ترتیب صحیح — یک دستور برای نصب کامل داده‌های نمونه */
const steps = ["src/db/seed.ts", "src/db/seed-theme.ts", "src/db/seed-admin-extras.ts", "src/db/seed-completion.ts"];
for (const step of steps) {
  console.log(`\n▶ ${step}`);
  const r = spawnSync("npx", ["tsx", step], { stdio: "inherit", shell: true });
  if (r.status !== 0) { console.error(`✗ خطا در ${step}`); process.exit(r.status ?? 1); }
}
console.log("\n✅ همه داده‌های نمونه با قالب مرجع درج شدند.");
