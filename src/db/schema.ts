import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  real,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  address: text("address").notNull().default(""),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  icon: text("icon").notNull().default("Shirt"),
  sortOrder: integer("sort_order").notNull().default(0),
  showOnHome: boolean("show_on_home").notNull().default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  stock: integer("stock").notNull().default(0),
  sizes: text("sizes").notNull().default("[]"),
  colors: text("colors").notNull().default("[]"),
  images: text("images").notNull().default("[]"),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  salesCount: integer("sales_count").notNull().default(0),
  isNew: boolean("is_new").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isOffer: boolean("is_offer").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  note: text("note").notNull().default(""),
  paymentMethod: text("payment_method").notNull().default("online"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  name: text("name").notNull(),
  image: text("image").notNull().default(""),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull().default(""),
  color: text("color").notNull().default(""),
});

export const wishlists = pgTable(
  "wishlists",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("wishlist_user_product_unique").on(t.userId, t.productId)]
);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull().default("مهمان"),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  image: text("image").notNull().default(""),
  tag: text("tag").notNull().default("مد و پوشاک"),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════ سیستم مدیریت قالب و پوسته ═══════════
export const themeSettings = pgTable("theme_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  label: text("label").notNull().default(""),
  group: text("group").notNull().default("general"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text("updated_by").notNull().default("system"),
});

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  author: text("author").notNull().default("MiniModa Studio"),
  version: text("version").notNull().default("1.0.0"),
  preview: text("preview").notNull().default(""),
  isActive: boolean("is_active").notNull().default(false),
  isDefault: boolean("is_default").notNull().default(false),
  tokens: text("tokens").notNull().default("{}"),
  installedAt: timestamp("installed_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  cta: text("cta").notNull().default("خرید"),
  href: text("href").notNull().default("/products"),
  image: text("image").notNull().default(""),
  tone: text("tone").notNull().default("from-slate-900/85"),
  sort: integer("sort").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const homepageSections = pgTable("homepage_sections", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const revisions = pgTable("revisions", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  snapshot: text("snapshot").notNull(),
  createdBy: text("created_by").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  actor: text("actor").notNull().default("سیستم"),
  action: text("action").notNull(),
  detail: text("detail").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  level: text("level").notNull().default("info"),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════ توسعه پنل مدیریت فروشگاه ═══════════
export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull().default("percent"), // percent | fixed
  value: integer("value").notNull(),
  minOrder: integer("min_order").notNull().default(0),
  maxUses: integer("max_uses").notNull().default(100),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    stock: integer("stock").notNull().default(0),
    sku: text("sku").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("variant_product_size_unique").on(t.productId, t.size)]
);

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull().default(""),
  phone: text("phone").notNull().default(""),
  address: text("address").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const returnsRequests = pgTable("returns_requests", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("refund"), // refund | exchange
  reason: text("reason").notNull().default(""),
  status: text("status").notNull().default("requested"), // requested | approved | rejected | done
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
  delta: integer("delta").notNull(), // مثبت = ورود، منفی = خروج
  reason: text("reason").notNull(),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull().default(""),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shippingMethods = pgTable("shipping_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cost: integer("cost").notNull().default(0),
  freeOver: integer("free_over").notNull().default(0), // 0 = همیشه رایگان بالای صفر یعنی هرگز شرط ندارد؛ برای «همیشه پولی» صفر بگذارید
  etaDays: integer("eta_days").notNull().default(2),
  active: boolean("active").notNull().default(true),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════ تکمیل پنل: کمپین، جدول سایزبندی، صفحات محتوا، برند ═══════════
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  bannerImage: text("banner_image").notNull().default(""),
  startAt: timestamp("start_at", { withTimezone: true }),
  endAt: timestamp("end_at", { withTimezone: true }),
  discountCodeId: integer("discount_code_id").references(() => discountCodes.id, { onDelete: "set null" }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sizeCharts = pgTable("size_charts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rows: text("rows").notNull().default("[]"), // JSON: [{size, height, chest, waist}]
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contentPages = pgTable("content_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  body: text("body").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════ تکمیل مدیریت قالب: منوها، ابزارک‌ها، پاپ‌آپ، الگوهای چیدمان، تاریخچه کد ═══════════
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  location: text("location").notNull().default("main"), // main | footer_quick | footer_service
  label: text("label").notNull(),
  href: text("href").notNull().default("/"),
  parentId: integer("parent_id"),
  sort: integer("sort").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
  highlight: boolean("highlight").notNull().default(false),
});

export const widgets = pgTable("widgets", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // popup | announcement | trust_badge | contact_block
  title: text("title").notNull(),
  config: text("config").notNull().default("{}"),
  enabled: boolean("enabled").notNull().default(true),
  sort: integer("sort").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const layoutPresets = pgTable("layout_presets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  snapshot: text("snapshot").notNull(), // JSON: sections order/enabled + design tokens
  createdBy: text("created_by").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const codeHistory = pgTable("code_history", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(), // custom.css | custom.js | custom.head
  content: text("content").notNull().default(""),
  createdBy: text("created_by").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
