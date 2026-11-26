--
-- PostgreSQL database dump
--

\restrict rAkZ4zP5e4Tpkz80wJDNYHjcfqRghGG4WPi8DCCPvSM5f1qtivpyvmLhZtCWZwe

-- Dumped from database version 15.19 (Debian 15.19-0+deb12u1)
-- Dumped by pg_dump version 15.19 (Debian 15.19-0+deb12u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.wishlists DROP CONSTRAINT IF EXISTS wishlists_product_id_products_id_fk;
ALTER TABLE IF EXISTS ONLY public.stock_movements DROP CONSTRAINT IF EXISTS stock_movements_product_id_products_id_fk;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_product_id_products_id_fk;
ALTER TABLE IF EXISTS ONLY public.returns_requests DROP CONSTRAINT IF EXISTS returns_requests_order_id_orders_id_fk;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_categories_id_fk;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_products_id_fk;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_orders_id_fk;
ALTER TABLE IF EXISTS ONLY public.campaigns DROP CONSTRAINT IF EXISTS campaigns_discount_code_id_discount_codes_id_fk;
DROP INDEX IF EXISTS public.wishlist_user_product_unique;
DROP INDEX IF EXISTS public.variant_product_size_unique;
ALTER TABLE IF EXISTS ONLY public.wishlists DROP CONSTRAINT IF EXISTS wishlists_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.themes DROP CONSTRAINT IF EXISTS themes_slug_unique;
ALTER TABLE IF EXISTS ONLY public.themes DROP CONSTRAINT IF EXISTS themes_pkey;
ALTER TABLE IF EXISTS ONLY public.theme_settings DROP CONSTRAINT IF EXISTS theme_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_pkey;
ALTER TABLE IF EXISTS ONLY public.stock_movements DROP CONSTRAINT IF EXISTS stock_movements_pkey;
ALTER TABLE IF EXISTS ONLY public.size_charts DROP CONSTRAINT IF EXISTS size_charts_pkey;
ALTER TABLE IF EXISTS ONLY public.shipping_methods DROP CONSTRAINT IF EXISTS shipping_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_token_unique;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.revisions DROP CONSTRAINT IF EXISTS revisions_pkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.returns_requests DROP CONSTRAINT IF EXISTS returns_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_slug_unique;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS product_variants_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.notices DROP CONSTRAINT IF EXISTS notices_pkey;
ALTER TABLE IF EXISTS ONLY public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_pkey;
ALTER TABLE IF EXISTS ONLY public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_email_unique;
ALTER TABLE IF EXISTS ONLY public.homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_pkey;
ALTER TABLE IF EXISTS ONLY public.discount_codes DROP CONSTRAINT IF EXISTS discount_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.discount_codes DROP CONSTRAINT IF EXISTS discount_codes_code_unique;
ALTER TABLE IF EXISTS ONLY public.content_pages DROP CONSTRAINT IF EXISTS content_pages_slug_unique;
ALTER TABLE IF EXISTS ONLY public.content_pages DROP CONSTRAINT IF EXISTS content_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_slug_unique;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.campaigns DROP CONSTRAINT IF EXISTS campaigns_slug_unique;
ALTER TABLE IF EXISTS ONLY public.campaigns DROP CONSTRAINT IF EXISTS campaigns_pkey;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_slug_unique;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_pkey;
ALTER TABLE IF EXISTS ONLY public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_slug_unique;
ALTER TABLE IF EXISTS ONLY public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_pkey;
ALTER TABLE IF EXISTS ONLY public.banners DROP CONSTRAINT IF EXISTS banners_pkey;
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_pkey;
ALTER TABLE IF EXISTS public.wishlists ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.themes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.suppliers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.stock_movements ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.size_charts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.shipping_methods ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sessions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.revisions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.returns_requests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_variants ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.notices ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.newsletter_subscribers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.discount_codes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.content_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.campaigns ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.brands ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blog_posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.banners ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.activity_logs ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.wishlists_id_seq;
DROP TABLE IF EXISTS public.wishlists;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.themes_id_seq;
DROP TABLE IF EXISTS public.themes;
DROP TABLE IF EXISTS public.theme_settings;
DROP SEQUENCE IF EXISTS public.suppliers_id_seq;
DROP TABLE IF EXISTS public.suppliers;
DROP SEQUENCE IF EXISTS public.stock_movements_id_seq;
DROP TABLE IF EXISTS public.stock_movements;
DROP SEQUENCE IF EXISTS public.size_charts_id_seq;
DROP TABLE IF EXISTS public.size_charts;
DROP SEQUENCE IF EXISTS public.shipping_methods_id_seq;
DROP TABLE IF EXISTS public.shipping_methods;
DROP SEQUENCE IF EXISTS public.sessions_id_seq;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.revisions_id_seq;
DROP TABLE IF EXISTS public.revisions;
DROP SEQUENCE IF EXISTS public.reviews_id_seq;
DROP TABLE IF EXISTS public.reviews;
DROP SEQUENCE IF EXISTS public.returns_requests_id_seq;
DROP TABLE IF EXISTS public.returns_requests;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.product_variants_id_seq;
DROP TABLE IF EXISTS public.product_variants;
DROP SEQUENCE IF EXISTS public.orders_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.order_items_id_seq;
DROP TABLE IF EXISTS public.order_items;
DROP SEQUENCE IF EXISTS public.notices_id_seq;
DROP TABLE IF EXISTS public.notices;
DROP SEQUENCE IF EXISTS public.newsletter_subscribers_id_seq;
DROP TABLE IF EXISTS public.newsletter_subscribers;
DROP TABLE IF EXISTS public.homepage_sections;
DROP SEQUENCE IF EXISTS public.discount_codes_id_seq;
DROP TABLE IF EXISTS public.discount_codes;
DROP SEQUENCE IF EXISTS public.content_pages_id_seq;
DROP TABLE IF EXISTS public.content_pages;
DROP SEQUENCE IF EXISTS public.contact_messages_id_seq;
DROP TABLE IF EXISTS public.contact_messages;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.campaigns_id_seq;
DROP TABLE IF EXISTS public.campaigns;
DROP SEQUENCE IF EXISTS public.brands_id_seq;
DROP TABLE IF EXISTS public.brands;
DROP SEQUENCE IF EXISTS public.blog_posts_id_seq;
DROP TABLE IF EXISTS public.blog_posts;
DROP SEQUENCE IF EXISTS public.banners_id_seq;
DROP TABLE IF EXISTS public.banners;
DROP SEQUENCE IF EXISTS public.activity_logs_id_seq;
DROP TABLE IF EXISTS public.activity_logs;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    actor text DEFAULT 'سیستم'::text NOT NULL,
    action text NOT NULL,
    detail text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    title text NOT NULL,
    subtitle text DEFAULT ''::text NOT NULL,
    cta text DEFAULT 'خرید'::text NOT NULL,
    href text DEFAULT '/products'::text NOT NULL,
    image text DEFAULT ''::text NOT NULL,
    tone text DEFAULT 'from-slate-900/85'::text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text DEFAULT ''::text NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    image text DEFAULT ''::text NOT NULL,
    tag text DEFAULT 'مد و پوشاک'::text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaigns (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    banner_image text DEFAULT ''::text NOT NULL,
    start_at timestamp with time zone,
    end_at timestamp with time zone,
    discount_code_id integer,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.campaigns_id_seq OWNED BY public.campaigns.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    image text DEFAULT ''::text NOT NULL,
    icon text DEFAULT 'Shirt'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    show_on_home boolean DEFAULT true NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name text NOT NULL,
    contact text DEFAULT ''::text NOT NULL,
    subject text DEFAULT ''::text NOT NULL,
    body text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: content_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_pages (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    body text DEFAULT ''::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.content_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: content_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.content_pages_id_seq OWNED BY public.content_pages.id;


--
-- Name: discount_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discount_codes (
    id integer NOT NULL,
    code text NOT NULL,
    type text DEFAULT 'percent'::text NOT NULL,
    value integer NOT NULL,
    min_order integer DEFAULT 0 NOT NULL,
    max_uses integer DEFAULT 100 NOT NULL,
    used_count integer DEFAULT 0 NOT NULL,
    expires_at timestamp with time zone,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: discount_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discount_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discount_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discount_codes_id_seq OWNED BY public.discount_codes.id;


--
-- Name: homepage_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_sections (
    id text NOT NULL,
    label text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    sort integer DEFAULT 0 NOT NULL
);


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: notices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notices (
    id integer NOT NULL,
    level text DEFAULT 'info'::text NOT NULL,
    title text NOT NULL,
    body text DEFAULT ''::text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notices_id_seq OWNED BY public.notices.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer,
    name text NOT NULL,
    image text DEFAULT ''::text NOT NULL,
    price integer NOT NULL,
    quantity integer NOT NULL,
    size text DEFAULT ''::text NOT NULL,
    color text DEFAULT ''::text NOT NULL
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    total integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    customer_name text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    payment_method text DEFAULT 'online'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    product_id integer NOT NULL,
    size text NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    sku text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    price integer NOT NULL,
    discount_price integer,
    category_id integer,
    stock integer DEFAULT 0 NOT NULL,
    sizes text DEFAULT '[]'::text NOT NULL,
    colors text DEFAULT '[]'::text NOT NULL,
    images text DEFAULT '[]'::text NOT NULL,
    rating real DEFAULT 4.5 NOT NULL,
    review_count integer DEFAULT 0 NOT NULL,
    sales_count integer DEFAULT 0 NOT NULL,
    is_new boolean DEFAULT false NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_offer boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: returns_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.returns_requests (
    id integer NOT NULL,
    order_id integer NOT NULL,
    type text DEFAULT 'refund'::text NOT NULL,
    reason text DEFAULT ''::text NOT NULL,
    status text DEFAULT 'requested'::text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: returns_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.returns_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: returns_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.returns_requests_id_seq OWNED BY public.returns_requests.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer,
    author_name text DEFAULT 'مهمان'::text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: revisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revisions (
    id integer NOT NULL,
    label text NOT NULL,
    snapshot text NOT NULL,
    created_by text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: revisions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.revisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: revisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.revisions_id_seq OWNED BY public.revisions.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: shipping_methods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_methods (
    id integer NOT NULL,
    name text NOT NULL,
    cost integer DEFAULT 0 NOT NULL,
    free_over integer DEFAULT 0 NOT NULL,
    eta_days integer DEFAULT 2 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_methods_id_seq OWNED BY public.shipping_methods.id;


--
-- Name: size_charts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.size_charts (
    id integer NOT NULL,
    name text NOT NULL,
    rows text DEFAULT '[]'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: size_charts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.size_charts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: size_charts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.size_charts_id_seq OWNED BY public.size_charts.id;


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    product_id integer,
    delta integer NOT NULL,
    reason text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name text NOT NULL,
    contact_person text DEFAULT ''::text NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    address text DEFAULT ''::text NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: theme_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme_settings (
    key text NOT NULL,
    value text DEFAULT ''::text NOT NULL,
    label text DEFAULT ''::text NOT NULL,
    "group" text DEFAULT 'general'::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by text DEFAULT 'system'::text NOT NULL
);


--
-- Name: themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.themes (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    author text DEFAULT 'MiniModa Studio'::text NOT NULL,
    version text DEFAULT '1.0.0'::text NOT NULL,
    preview text DEFAULT ''::text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    tokens text DEFAULT '{}'::text NOT NULL,
    installed_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: themes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.themes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.themes_id_seq OWNED BY public.themes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    password_hash text NOT NULL,
    address text DEFAULT ''::text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL
);


--
-- Name: wishlists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wishlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wishlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wishlists_id_seq OWNED BY public.wishlists.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: campaigns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN id SET DEFAULT nextval('public.campaigns_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: content_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_pages ALTER COLUMN id SET DEFAULT nextval('public.content_pages_id_seq'::regclass);


--
-- Name: discount_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_codes ALTER COLUMN id SET DEFAULT nextval('public.discount_codes_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: notices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notices ALTER COLUMN id SET DEFAULT nextval('public.notices_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: returns_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns_requests ALTER COLUMN id SET DEFAULT nextval('public.returns_requests_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: revisions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revisions ALTER COLUMN id SET DEFAULT nextval('public.revisions_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: shipping_methods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_methods ALTER COLUMN id SET DEFAULT nextval('public.shipping_methods_id_seq'::regclass);


--
-- Name: size_charts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.size_charts ALTER COLUMN id SET DEFAULT nextval('public.size_charts_id_seq'::regclass);


--
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: themes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.themes ALTER COLUMN id SET DEFAULT nextval('public.themes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, actor, action, detail, created_at) FROM stdin;
17	سیستم	نصب قالب	قالب «مینی‌مودا کلاسیک» v1.4.0 به‌عنوان قالب پیش‌فرض فعال شد	2026-11-25 15:40:04.082334+00
18	سیستم	بارگذاری اولیه	مهاجرت خودکار تنظیمات پوسته از نسخه قبلی انجام شد	2026-11-25 15:40:04.082334+00
19	مدیر فروشگاه	ویرایش تنظیمات	آستانه ارسال رایگان روی ۲,۰۰۰,۰۰۰ تومان تنظیم شد	2026-11-25 15:40:04.082334+00
20	مدیر فروشگاه	بارگذاری تصاویر محصول	1 تصویر بارگذاری شد برای محصول #19	2026-11-25 15:47:17.968436+00
21	مدیر فروشگاه	افزودن محصول	«تست آپلود سرور» با 2 تصویر ساخته شد	2026-11-25 15:47:18.031302+00
22	مدیر فروشگاه	حذف محصول	«تست آپلود سرور» حذف شد	2026-11-25 15:47:27.923194+00
23	مدیر فروشگاه	تنظیمات دسته‌بندی محبوب	نمایش بخش: غیرفعال — تعداد ردیف: 3 (7 دسته فعال)	2026-11-25 15:47:28.177512+00
24	مدیر فروشگاه	تنظیمات دسته‌بندی محبوب	نمایش بخش: فعال — تعداد ردیف: 1 (7 دسته فعال)	2026-11-25 15:47:28.25287+00
25	مدیر فروشگاه	افزودن دسته‌بندی	«زمستانی تست» ساخته شد و در دسته‌های محبوب قرار گرفت	2026-11-25 15:47:28.324588+00
26	مدیر فروشگاه	پنهان‌سازی دسته از خانه	«اکسسوری»	2026-11-25 15:47:39.970563+00
27	مدیر فروشگاه	نمایش دسته در خانه	«اکسسوری»	2026-11-25 15:47:40.07062+00
28	مدیر فروشگاه	تنظیمات دسته‌بندی محبوب	نمایش بخش: غیرفعال — تعداد ردیف: 2 (8 دسته فعال)	2026-11-25 15:47:40.147841+00
29	مدیر فروشگاه	تنظیمات دسته‌بندی محبوب	نمایش بخش: فعال — تعداد ردیف: 1 (8 دسته فعال)	2026-11-25 15:47:40.213396+00
30	مدیر فروشگاه	حذف دسته‌بندی	«زمستانی تست» حذف شد (محصولات آن بدون دسته شدند)	2026-11-25 15:47:40.280793+00
31	مدیر فروشگاه	تنظیمات دسته‌بندی محبوب	نمایش بخش: غیرفعال — تعداد ردیف: 1 (7 دسته فعال)	2026-11-25 15:47:50.753983+00
32	مدیر فروشگاه	تنظیمات دسته‌بندی محبوب	نمایش بخش: فعال — تعداد ردیف: 2 (7 دسته فعال)	2026-11-25 15:47:50.833682+00
33	مدیر فروشگاه	پنهان‌سازی دسته از خانه	«اکسسوری»	2026-11-25 15:47:50.849648+00
34	مدیر فروشگاه	نمایش دسته در خانه	«اکسسوری»	2026-11-25 15:47:50.911071+00
35	مدیر فروشگاه	تنظیمات دسته‌بندی محبوب	نمایش بخش: فعال — تعداد ردیف: 1 (7 دسته فعال)	2026-11-25 15:47:50.927563+00
36	مدیر فروشگاه	ویرایش محصول	«پیراهن مجلسی سلطنتی صورتی آرگونا (ویرایش تست)» با 1 تصویر به‌روز شد	2026-11-25 15:48:06.763495+00
37	مدیر فروشگاه	ویرایش محصول	«پیراهن مجلسی سلطنتی صورتی آرگونا» با 1 تصویر به‌روز شد	2026-11-25 15:48:06.854613+00
38	مدیر فروشگاه	ایجاد کد تخفیف	TEST99 — 15٪	2026-11-25 16:22:12.912537+00
39	مدیر فروشگاه	ثبت حرکت انبار	+1 — اصلاح موجودی	2026-11-25 16:22:13.04837+00
40	مدیر فروشگاه	ثبت حرکت انبار	-1 — اصلاح موجودی	2026-11-25 16:22:13.064068+00
41	مدیر فروشگاه	ایجاد کمپین	تست کمپین	2026-11-25 19:41:28.208514+00
42	مدیر فروشگاه	ایجاد صفحه محتوا	صفحه تست	2026-11-25 19:41:28.2355+00
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (id, title, subtitle, cta, href, image, tone, sort, active) FROM stdin;
5	کاپشن‌های زمستانی	تا ۳۰٪ تخفیف	خرید کنید	/products?cat=kids&q=کاپشن	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-rose-900/80	1	t
6	پیراهن‌های مجلسی	کالکشن سلطنتی	خرید کنید	/products?cat=formal	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-purple-900/80	2	t
7	کتانی‌های ورزشی	ضد لغزش و سبک	خرید کنید	/products?cat=shoes	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-sky-900/80	3	t
8	کت و شلوار پسرانه	ست کامل رسمی	خرید کنید	/products?cat=boys&q=کت	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-slate-900/85	4	t
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_posts (id, title, slug, excerpt, content, image, tag, views, created_at) FROM stdin;
7	ترندهای پاییز و زمستان مد کودک در سال ۲۰۲۶	fall-winter-2026-trends	از پالت رنگ‌های خاکی تا پارچه‌های بازیافتی؛ مهم‌ترین ترندهای امسال را بشناسید.	پالت رنگ فصل جاری بر پایه خاکی، کاراملی و سبز زیتونی با تأکید بر صورتی گردویی استوار است. برندهای مطرح دنیا به سمت پارچه‌های ارگانیک و بازیافتی رفته‌اند.\n\nکاپشن‌های اورسایز با جزئیات رفلکتور ایمنی و کت تک‌های اسپرت دوطرفه از پرفروش‌ترین آیتم‌های فصل هستند.\n\nدر ایران نیز استقبال از ست‌های خانوادگی و رنگ‌های خنثی با اکسسوری‌های رنگی چشمگیر افزایش یافته است.	https://images.pexels.com/photos/35607631/pexels-photo-35607631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	ترند مد	4146	2026-11-24 19:10:56.127347+00
6	چطور کفش استاندارد برای رشد پای کودک انتخاب کنیم؟	right-shoes-for-kids	پنج نکته طلایی برای انتخاب کفش سالم که قدم‌های اول را برای فرزندتان خاطره‌انگیز می‌کند.	پای کودک تا ۱۲ سالگی در حال رشد است و پای افزار نامناسب می‌تواند باعث مشکلات اسکلتی شود. پنجه کفش باید حداقل یک سانتی‌متر فضا داشته باشد و پاشنه بیش از دو سانتی‌متر نباشد.\n\nزیره EVA و EVA-Ruبری با انعطاف مناسب بهترین انتخاب است. کفشی که خم نمی‌شود، پای کودک را خسته می‌کند.\n\nخرید کفش ارتوپدی برای کودکان سالم ضروری نیست، اما در ناهنجاری‌های کف پا حتماً با پزشک ارتوپد مشورت کنید.	https://images.pexels.com/photos/30395128/pexels-photo-30395128.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	سلامت کودک	2916	2026-11-24 19:10:56.127347+00
8	لباس زمستانی گرم و ایمن؛ راهنمای مادران باهوش	winter-clothes-guide	لایه‌لایه بپوشانید، هوشمند خرید کنید؛ نکات ایمنی کاپشن و پالتو کودک.	قانون سه لایه بهترین راه برای گرم نگه‌داشتن کودک است: لایه اول حرارتی پنبه‌ای، لایه میانی پشمی یا فلانل و لایه بیرونی ضدآب و ضدباد.\n\nاز کلاه‌های بنددار بلند که خطر گره خوردن دارند پرهیز کنید و زیپ‌ها را با محافظ پارچه‌ای بپوشانید تا چانه کودک آسیب نبیند.\n\nکاپشن خیلی بزرگ هم به اندازه کاپشن تنگ خطرناک است؛ باد از زیر وارد می‌شود و کودک سردش می‌شود. اندازه بهتر، یک سایز بزرگ‌تر با کمرکشی است.	https://images.pexels.com/photos/19579097/pexels-photo-19579097.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	سبک زندگی	1993	2026-11-24 19:10:56.127347+00
5	اصول انتخاب لباس مجلسی مناسب کودک برای مراسم رسمی	kids-formal-dress-guide	از انتخاب پارچه تا سایزبندی درست؛ هر آنچه قبل از خرید لباس مجلسی کودک باید بدانید.	انتخاب لباس مجلسی برای کودکان فقط مسئله ظاهر نیست؛ راحتی، جنس پارچه و دوخت تمیز اهمیت اصلی را دارد. پارچه‌های ویسکوز و پنبه مخلوط برای مهمانی‌های طولانی گزینه‌های بهتری هستند چون تنفس‌پذیرند و حساسیت ایجاد نمی‌کنند.\n\nهنگام خرید، یک سایز بالاتر انتخاب کنید چون کودکان به سرعت رشد می‌کنند و لباس نباید تنگ باشد. همچنین از یقه‌های سفت و دوخت‌های زبر که پوست گردن را می‌خراشد پرهیز کنید.\n\nدر پایان، حتماً رنگ و فرم را با موقعیت مراسم هماهنگ کنید؛ برای عصرها رنگ‌های تیره و برای روز رنگ‌های روشن و شاد مناسب‌ترند.	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	راهنمای خرید	3465	2026-11-24 19:10:56.127347+00
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name, slug, logo, created_at) FROM stdin;
1	مینی‌مودا (برند اختصاصی)	minimoda		2026-11-25 19:38:33.476939+00
2	آروشا	arusha		2026-11-25 19:38:33.476939+00
3	پاپی‌فیت	papyfit		2026-11-25 19:38:33.476939+00
4	نساجی پارینه	parineh		2026-11-25 19:38:33.476939+00
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaigns (id, title, slug, description, banner_image, start_at, end_at, discount_code_id, active, created_at) FROM stdin;
1	جشنواره بهاره مینی‌مودا	spring-festival	تا ۶۰٪ تخفیف روی کالکشن جدید بهاره؛ پیراهن‌های مجلسی، کاپشن‌های سبک و ست‌های ملوانی.	https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1200	2026-11-15 19:38:33.468+00	2026-12-15 19:38:33.468+00	2	t	2026-11-25 19:38:33.47092+00
2	شروع سال تحصیلی	back-to-school	کتانی و ست‌های مدرسه با کد تخفیف خوش‌آمد؛ آماده‌سازی برای بازگشت به کلاس.	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1200	2026-11-30 19:38:33.468+00	2027-01-09 19:38:33.468+00	1	t	2026-11-25 19:38:33.47092+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, image, icon, sort_order, show_on_home) FROM stdin;
8	دخترانه	girls	پیراهن، سارافون و لباس‌های دخترانه	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Crown	1	t
9	پسرانه	boys	کت، شلوار و تیشرت‌های پسرانه	https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Shirt	2	t
10	بچگانه	kids	کاپشن و لباس‌های روزمره بچگانه	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Sparkles	3	t
11	نوزاد	baby	سرهمی و لباس‌های نرم نوزاد	https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Baby	4	t
12	لباس مجلسی	formal	لباس‌های رسمی و مجلسی کودک	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Gem	5	t
13	کفش	shoes	کتانی، کفش اسپرت و مجلسی کودک	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Footprints	6	t
14	اکسسوری	accessories	کلاه، کیف و اکسسوری‌های کودک	https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	ShoppingBag	7	t
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, contact, subject, body, read, created_at) FROM stdin;
1	مریم رضایی	09121234567	سوال درباره سایز	قد دخترم ۱۱۰ سانته؛ برای خرید کاپشن سایز ۶-۷ مناسب است یا ۸-۹؟	f	2026-11-25 16:14:08.061135+00
2	علی حسینی	ali@example.com	پیگیری سفارش	سفارش MM-00031 هنوز به دستم نرسیده ولی وضعیتش ارسال‌شده ثبت شده؛ لطفاً پیگیری کنید.	f	2026-11-25 16:14:08.061135+00
3	زهرا کاظمی	09351112233	درخواست تعویض سایز	یک ست ملوانی سایز ۸-۹ سفارش دادم ولی کوچک بود؛ امکان تعویض با سایز ۱۰-۱۱ هست؟	t	2026-11-25 16:14:08.061135+00
4	الهام نوری	09195556677	پیشنهاد همکاری	برای فروشگاه اینستاگرامی‌ام برای تأمین عمده ست‌های نوزادی قیمت عمده دارید؟	t	2026-11-25 16:14:08.061135+00
5	رضا توکلی	reza.t@example.com	فاکتور خرید	برای خرید شرکت‌مان فاکتور رسمی با کد اقتصادی نیاز داریم؛ چطور اقدام کنیم؟	f	2026-11-25 16:14:08.061135+00
\.


--
-- Data for Name: content_pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.content_pages (id, title, slug, body, updated_at) FROM stdin;
1	درباره مینی‌مودا	about	مینی‌مودا فروشگاه آنلاین تخصصی مد و پوشاک کودک و نوزاد است که از سال ۱۳۹۸ با هدف ارائه لباس‌های باکیفیت، اصل و خوش‌قیمت به خانواده‌های ایرانی آغاز به کار کرده است.\n\nما معتقدیم کودکان سزاوار بهترین‌ها هستند؛ به همین دلیل تمام محصولاتمان را از برندهای معتبر و کارگاه‌های باسابقه تهیه می‌کنیم، پیش از عرضه کیفیت هر کالا را بررسی می‌کنیم و با ضمانت اصالت و سلامت فیزیکی کالا به دست شما می‌رسانیم.\n\nتیم مینی‌مودا در تهران مستقر است و با پشتیبانی پاسخگو در تمام روزهای هفته همراه شماست.	2026-11-25 19:38:33.474918+00
2	قوانین و مقررات	terms	۱) تمامی محصولات مینی‌مودا دارای ضمانت اصالت کالا هستند.\n۲) سفارش‌های بالای ۲ میلیون تومان شامل ارسال رایگان می‌شوند.\n۳) تا ۷ روز پس از تحویل، امکان بازگشت کالا با ارائه فاکتور و برچسب سلامت وجود دارد.\n۴) در صورت مغایرت یا ایراد کالا، هزینه ارسال برگشت با فروشگاه است.\n۵) پرداخت آنلاین از طریق درگاه رسمی بانکی انجام می‌شود و هیچ اطلاعات کارتی ذخیره نمی‌گردد.	2026-11-25 19:38:33.474918+00
3	حریم خصوصی	privacy	اطلاعات شخصی شما (نام، موبایل، آدرس) صرفاً برای انجام سفارش و هماهنگی ارسال استفاده می‌شود و هرگز با اشخاص ثالث به اشتراک گذاشته نمی‌شود.\n\nرمز عبور حساب کاربری شما با الگوریتم‌های امن رمزنگاری می‌شود و هیچ‌کس — حتی مدیران فروشگاه — به آن دسترسی ندارد.\n\nدر صورت نیاز به تغییر یا حذف اطلاعات حساب، کافی است با پشتیبانی تماس بگیرید.	2026-11-25 19:38:33.474918+00
\.


--
-- Data for Name: discount_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discount_codes (id, code, type, value, min_order, max_uses, used_count, expires_at, active, created_at) FROM stdin;
1	WELCOME10	percent	10	0	500	128	2027-02-23 16:14:08.053+00	t	2026-11-25 16:14:08.056284+00
2	NOROOZ25	percent	25	3000000	200	74	2026-12-25 16:14:08.053+00	t	2026-11-25 16:14:08.056284+00
3	SHIPFREE	fixed	45000	0	1000	342	\N	t	2026-11-25 16:14:08.056284+00
4	KIDS20	percent	20	1500000	150	150	2026-11-20 16:14:08.053+00	f	2026-11-25 16:14:08.056284+00
\.


--
-- Data for Name: homepage_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.homepage_sections (id, label, enabled, sort) FROM stdin;
hero	اسلایدر اصلی (هیرو)	t	1
categories	ردیف دسته‌بندی‌های گرد	t	2
banners	بنرهای تبلیغاتی ۴ تایی	t	3
trust	نوار اعتماد (ارسال/پرداخت/ضمانت)	t	4
festival	بنر جشنواره + پرفروش‌های هفته	t	5
blog	پربیننده‌ترین اخبار مد	t	6
products	دیدنی‌ترین‌های مینی‌مودا (تب‌ها)	t	7
duo	بنرهای دوگانه انتهایی	t	8
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.newsletter_subscribers (id, email, created_at) FROM stdin;
\.


--
-- Data for Name: notices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notices (id, level, title, body, read, created_at) FROM stdin;
4	success	به پنل مدیریت قالب خوش آمدید	از این پس می‌توانید رنگ‌ها، فونت، بنرها و اجزای صفحه اصلی را از همین‌جا مدیریت کنید.	f	2026-11-25 15:40:04.081373+00
5	warning	نسخه جدید قالب در دسترس است	نسخه 1.5.0 قالب «مینی‌مودا کلاسیک» با بهبود سرعت لود و پشتیبانی از فونت نستعلیق منتشر شد. برای به‌روزرسانی به تب «مدیریت قالب‌ها» بروید.	f	2026-11-25 15:40:04.081373+00
6	security	توصیه امنیتی	رمز مدیر را به‌صورت دوره‌ای تغییر دهید و نشست‌های قدیمی را از بخش «امنیت و نشست‌ها» باطل کنید.	f	2026-11-25 15:40:04.081373+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, name, image, price, quantity, size, color) FROM stdin;
4	3	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	1	6-7	صورتی
5	3	25	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	390000	1	6-7	زرشکی
6	4	25	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	690000	1	4-5	صورتی
7	4	36	پیراهن تور عاجی نوزاد پرنسس آوا	https://images.pexels.com/photos/29610395/pexels-photo-29610395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2680000	2	4-5	صورتی
8	5	27	کاپشن قرمز ورزشی دخترانه پیک	https://images.pexels.com/photos/11111822/pexels-photo-11111822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1980000	1	4-5	صورتی
9	5	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
10	6	21	پیراهن سفید مهمانی ملکه بالن‌ها	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4480000	2	4-5	صورتی
11	7	34	کتانی سفید مینی رانر سفید استار	https://images.pexels.com/photos/5275386/pexels-photo-5275386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1290000	2	4-5	صورتی
12	7	30	پیراهن آبی استودیو دخترانه آرمیتا	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1450000	2	4-5	صورتی
13	7	33	کتانی قرمز نوزاد پاپی‌فیت	https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	790000	1	4-5	صورتی
14	8	26	کاپشن صورتی کلاسیک بچگانه هاوانا	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2750000	1	4-5	صورتی
15	9	26	کاپشن صورتی کلاسیک بچگانه هاوانا	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2750000	2	4-5	صورتی
16	9	25	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	690000	2	4-5	صورتی
17	10	31	پیراهن سفید تور و پاپیون دخترانه رها	https://images.pexels.com/photos/14897706/pexels-photo-14897706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3960000	2	4-5	صورتی
18	10	29	پالتو صورتی نوزاد زمستانی بیبی‌رز	https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1980000	1	4-5	صورتی
19	10	28	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2600000	1	4-5	صورتی
20	11	22	کت و شلوار رسمی مشکی پسرانه آرش	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	6150000	1	4-5	صورتی
21	11	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	1	4-5	صورتی
22	11	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	2	4-5	صورتی
23	12	35	ست نامیکی دو تیکه بچگانه مارین	https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1680000	1	4-5	صورتی
24	12	21	پیراهن سفید مهمانی ملکه بالن‌ها	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4480000	2	4-5	صورتی
25	12	22	کت و شلوار رسمی مشکی پسرانه آرش	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	6150000	2	4-5	صورتی
26	13	35	ست نامیکی دو تیکه بچگانه مارین	https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1680000	2	4-5	صورتی
27	13	28	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2600000	1	4-5	صورتی
28	13	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	2	4-5	صورتی
29	14	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
30	14	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	1	4-5	صورتی
31	15	30	پیراهن آبی استودیو دخترانه آرمیتا	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1450000	1	4-5	صورتی
32	15	25	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	690000	2	4-5	صورتی
33	16	29	پالتو صورتی نوزاد زمستانی بیبی‌رز	https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1980000	1	4-5	صورتی
34	17	25	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	690000	1	4-5	صورتی
35	18	23	کت تک سرمه‌ای پسرانه با اسلش جین	https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	1	4-5	صورتی
36	19	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
37	20	31	پیراهن سفید تور و پاپیون دخترانه رها	https://images.pexels.com/photos/14897706/pexels-photo-14897706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3960000	2	4-5	صورتی
38	21	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
39	21	33	کتانی قرمز نوزاد پاپی‌فیت	https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	790000	1	4-5	صورتی
40	22	24	ست کت و شلوار پاپیون‌دار پسرانه بارون	https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4590000	1	4-5	صورتی
41	22	32	کفش ورزشی خاکستری سامیکس رانر	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1740000	1	4-5	صورتی
42	22	28	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2600000	1	4-5	صورتی
43	23	29	پالتو صورتی نوزاد زمستانی بیبی‌رز	https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1980000	1	4-5	صورتی
44	23	30	پیراهن آبی استودیو دخترانه آرمیتا	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1450000	2	4-5	صورتی
45	23	22	کت و شلوار رسمی مشکی پسرانه آرش	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	6150000	2	4-5	صورتی
46	24	23	کت تک سرمه‌ای پسرانه با اسلش جین	https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
47	25	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	1	4-5	صورتی
48	25	32	کفش ورزشی خاکستری سامیکس رانر	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1740000	1	4-5	صورتی
49	25	33	کتانی قرمز نوزاد پاپی‌فیت	https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	790000	2	4-5	صورتی
50	26	30	پیراهن آبی استودیو دخترانه آرمیتا	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1450000	1	4-5	صورتی
51	26	21	پیراهن سفید مهمانی ملکه بالن‌ها	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4480000	2	4-5	صورتی
52	27	30	پیراهن آبی استودیو دخترانه آرمیتا	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1450000	2	4-5	صورتی
53	28	29	پالتو صورتی نوزاد زمستانی بیبی‌رز	https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1980000	2	4-5	صورتی
54	29	22	کت و شلوار رسمی مشکی پسرانه آرش	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	6150000	1	4-5	صورتی
55	29	28	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2600000	1	4-5	صورتی
56	29	29	پالتو صورتی نوزاد زمستانی بیبی‌رز	https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1980000	2	4-5	صورتی
57	30	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
58	30	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	2	4-5	صورتی
59	30	26	کاپشن صورتی کلاسیک بچگانه هاوانا	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2750000	1	4-5	صورتی
60	31	22	کت و شلوار رسمی مشکی پسرانه آرش	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	6150000	2	4-5	صورتی
61	32	23	کت تک سرمه‌ای پسرانه با اسلش جین	https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	1	4-5	صورتی
62	32	22	کت و شلوار رسمی مشکی پسرانه آرش	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	6150000	2	4-5	صورتی
63	32	21	پیراهن سفید مهمانی ملکه بالن‌ها	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4480000	1	4-5	صورتی
64	33	25	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	690000	2	4-5	صورتی
65	34	31	پیراهن سفید تور و پاپیون دخترانه رها	https://images.pexels.com/photos/14897706/pexels-photo-14897706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3960000	1	4-5	صورتی
66	34	28	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2600000	1	4-5	صورتی
67	35	30	پیراهن آبی استودیو دخترانه آرمیتا	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1450000	2	4-5	صورتی
68	35	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
69	36	36	پیراهن تور عاجی نوزاد پرنسس آوا	https://images.pexels.com/photos/29610395/pexels-photo-29610395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2680000	1	4-5	صورتی
70	37	23	کت تک سرمه‌ای پسرانه با اسلش جین	https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
71	38	21	پیراهن سفید مهمانی ملکه بالن‌ها	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4480000	1	4-5	صورتی
72	38	24	ست کت و شلوار پاپیون‌دار پسرانه بارون	https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4590000	2	4-5	صورتی
73	38	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	1	4-5	صورتی
74	39	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	1	4-5	صورتی
75	40	26	کاپشن صورتی کلاسیک بچگانه هاوانا	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2750000	2	4-5	صورتی
76	41	32	کفش ورزشی خاکستری سامیکس رانر	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1740000	2	4-5	صورتی
77	41	27	کاپشن قرمز ورزشی دخترانه پیک	https://images.pexels.com/photos/11111822/pexels-photo-11111822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1980000	1	4-5	صورتی
78	41	24	ست کت و شلوار پاپیون‌دار پسرانه بارون	https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4590000	2	4-5	صورتی
79	42	24	ست کت و شلوار پاپیون‌دار پسرانه بارون	https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4590000	1	4-5	صورتی
80	43	34	کتانی سفید مینی رانر سفید استار	https://images.pexels.com/photos/5275386/pexels-photo-5275386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1290000	2	4-5	صورتی
81	44	24	ست کت و شلوار پاپیون‌دار پسرانه بارون	https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4590000	1	4-5	صورتی
82	45	31	پیراهن سفید تور و پاپیون دخترانه رها	https://images.pexels.com/photos/14897706/pexels-photo-14897706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3960000	1	4-5	صورتی
83	45	28	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	2600000	2	4-5	صورتی
84	46	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
85	47	22	کت و شلوار رسمی مشکی پسرانه آرش	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	6150000	1	4-5	صورتی
86	47	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	2	4-5	صورتی
87	48	25	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	690000	1	4-5	صورتی
88	48	30	پیراهن آبی استودیو دخترانه آرمیتا	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	1450000	2	4-5	صورتی
89	48	24	ست کت و شلوار پاپیون‌دار پسرانه بارون	https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4590000	2	4-5	صورتی
90	49	19	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	1	4-5	صورتی
91	49	20	سارافون گلدار وینتاج رزالی	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3200000	2	4-5	صورتی
92	49	21	پیراهن سفید مهمانی ملکه بالن‌ها	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	4480000	2	4-5	صورتی
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, total, status, customer_name, phone, address, note, payment_method, created_at) FROM stdin;
3	4	4280000	delivered	سارا محمدی	09121234567	تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴	لطفاً قبل از ارسال هماهنگ کنید.	online	2026-11-24 19:10:56.124483+00
4	4	6740000	delivered	پرهام کریمی	09368237072	تهران، ونک، کوچه 28، پلاک 20		online	2026-10-01 01:57:03.635+00
5	\N	5870000	pending	امیر صادقی	09348367078	تهران، خیابان آزادی، کوچه 9، پلاک 105		onsite	2026-08-18 13:12:21.641+00
6	4	8960000	pending	علی کریمی	09145624880	تهران، پاسداران، کوچه 43، پلاک 136	لطفاً قبل از ارسال تماس بگیرید.	onsite	2026-11-01 01:32:17.645+00
7	\N	4820000	delivered	علی کاظمی	09269373619	تهران، نیاوران، کوچه 51، پلاک 169		online	2026-11-23 05:27:30.647+00
8	\N	2750000	delivered	نگار محمدی	09826992271	تهران، سعادت‌آباد، کوچه 58، پلاک 183		online	2026-08-20 06:47:33.65+00
9	\N	4130000	delivered	پرهام نوری	09517008303	تهران، نیاوران، کوچه 18، پلاک 119		onsite	2026-09-11 02:33:15.652+00
10	4	17080000	pending	مریم کریمی	09664223576	تهران، شهرک غرب، کوچه 12، پلاک 148		online	2026-10-05 23:40:24.654+00
11	\N	22590000	shipped	لیلا صادقی	09210468492	تهران، شهرک غرب، کوچه 28، پلاک 65	لطفاً قبل از ارسال تماس بگیرید.	online	2026-09-02 00:44:34.657+00
12	\N	20140000	cancelled	رضا کریمی	09958325261	تهران، ونک، کوچه 48، پلاک 46		online	2026-10-21 09:39:31.66+00
13	\N	9160000	delivered	کیانا رحیمی	09469362410	تهران، سعادت‌آباد، کوچه 31، پلاک 30	لطفاً قبل از ارسال تماس بگیرید.	card	2026-10-25 00:11:43.663+00
14	\N	10980000	delivered	امیر کریمی	09101059057	تهران، نیاوران، کوچه 35، پلاک 43		online	2026-08-19 00:48:46.665+00
15	\N	3590000	pending	رضا محمدی	09403025326	تهران، پاسداران، کوچه 29، پلاک 24	لطفاً قبل از ارسال تماس بگیرید.	online	2026-08-13 12:16:26.667+00
16	\N	3960000	pending	امیر محمدی	09233990621	تهران، ونک، کوچه 38، پلاک 195	لطفاً قبل از ارسال تماس بگیرید.	online	2026-08-07 13:09:37.67+00
17	\N	1425000	pending	نگار کریمی	09453617751	تهران، شهرک غرب، کوچه 45، پلاک 152	لطفاً قبل از ارسال تماس بگیرید.	online	2026-10-15 08:44:38.671+00
18	4	7780000	shipped	نازنین احمدی	09796153351	تهران، جنت‌آباد، کوچه 19، پلاک 24		online	2026-09-11 23:20:59.672+00
19	\N	7780000	cancelled	لیلا احمدی	09522524613	تهران، جنت‌آباد، کوچه 59، پلاک 157		online	2026-11-25 11:01:52.674+00
20	4	7920000	delivered	رضا توکلی	09491869873	تهران، خیابان ولیعصر، کوچه 46، پلاک 71		online	2026-08-30 12:31:59.675+00
21	\N	5470000	pending	پرهام احمدی	09528470166	تهران، شهرک غرب، کوچه 39، پلاک 17		online	2026-09-04 18:00:22.677+00
22	4	11530000	shipped	پرهام رحیمی	09318047594	تهران، شهرک غرب، کوچه 36، پلاک 132	لطفاً قبل از ارسال تماس بگیرید.	onsite	2026-11-19 13:37:18.679+00
23	4	9580000	delivered	رضا صادقی	09351786757	تهران، نیاوران، کوچه 21، پلاک 157		online	2026-09-19 23:10:40.682+00
24	\N	7780000	processing	پرهام کریمی	09690372170	تهران، نیاوران، کوچه 55، پلاک 29		card	2026-08-10 00:02:10.685+00
25	\N	5730000	processing	نگار جعفری	09215424241	تهران، سعادت‌آباد، کوچه 32، پلاک 20		card	2026-08-25 14:32:50.686+00
26	\N	7380000	shipped	علی توکلی	09118429977	تهران، شهرک غرب، کوچه 44، پلاک 198		onsite	2026-08-11 05:48:58.689+00
27	\N	1495000	delivered	حسین احمدی	09171418080	تهران، نیاوران، کوچه 47، پلاک 74		online	2026-09-30 08:06:27.692+00
28	\N	3960000	delivered	مریم احمدی	09590269713	تهران، سعادت‌آباد، کوچه 14، پلاک 32		card	2026-10-11 06:50:57.693+00
29	\N	18860000	shipped	سارا کاظمی	09446731530	تهران، ونک، کوچه 32، پلاک 55		online	2026-09-27 19:05:48.695+00
30	\N	12590000	shipped	پرهام محمدی	09749862145	تهران، جنت‌آباد، کوچه 56، پلاک 123		card	2026-08-29 13:02:29.697+00
31	\N	6150000	processing	سارا مرادی	09862990752	تهران، جنت‌آباد، کوچه 17، پلاک 119	لطفاً قبل از ارسال تماس بگیرید.	card	2026-10-02 22:27:47.7+00
32	\N	14520000	pending	مریم رحیمی	09639036337	تهران، نیاوران، کوچه 14، پلاک 68	لطفاً قبل از ارسال تماس بگیرید.	online	2026-10-07 10:10:25.701+00
33	\N	1425000	delivered	زهرا جعفری	09995498232	تهران، خیابان ولیعصر، کوچه 48، پلاک 40		online	2026-09-06 19:19:39.704+00
34	\N	13120000	shipped	امیر مرادی	09194680867	تهران، خیابان ولیعصر، کوچه 59، پلاک 43		card	2026-09-03 12:19:07.706+00
35	\N	6790000	delivered	نازنین کاظمی	09514403876	تهران، شهرک غرب، کوچه 7، پلاک 75		onsite	2026-08-11 14:26:57.708+00
36	\N	5360000	shipped	سارا جعفری	09631545414	تهران، شهرک غرب، کوچه 8، پلاک 199		online	2026-09-03 09:17:11.71+00
37	\N	3890000	shipped	نگار احمدی	09593599714	تهران، نیاوران، کوچه 6، پلاک 71		online	2026-09-26 01:28:03.712+00
38	\N	20060000	processing	مریم احمدی	09580894275	تهران، ونک، کوچه 43، پلاک 182		online	2026-09-12 01:20:00.714+00
39	\N	6400000	delivered	علی احمدی	09534032300	تهران، جنت‌آباد، کوچه 44، پلاک 10		online	2026-09-26 14:04:27.716+00
40	\N	5500000	delivered	علی صادقی	09909399883	تهران، جنت‌آباد، کوچه 39، پلاک 173		online	2026-08-03 07:07:47.718+00
41	\N	12030000	delivered	پرهام کاظمی	09365782898	تهران، خیابان ولیعصر، کوچه 26، پلاک 40		onsite	2026-11-05 07:39:32.719+00
42	\N	9180000	cancelled	حسین کاظمی	09349858027	تهران، شهرک غرب، کوچه 24، پلاک 65		online	2026-07-29 07:00:01.721+00
43	\N	1335000	delivered	لیلا احمدی	09632482742	تهران، ونک، کوچه 5، پلاک 123		card	2026-10-22 00:24:22.723+00
44	\N	4590000	processing	امیر صادقی	09193815221	تهران، خیابان ولیعصر، کوچه 29، پلاک 114	لطفاً قبل از ارسال تماس بگیرید.	online	2026-11-12 04:27:09.725+00
45	\N	6560000	delivered	پرهام احمدی	09557940696	تهران، ونک، کوچه 1، پلاک 10		onsite	2026-11-18 13:26:43.726+00
46	\N	7780000	delivered	لیلا رحیمی	09844537237	تهران، ونک، کوچه 30، پلاک 82		onsite	2026-11-21 22:34:12.728+00
47	\N	20080000	shipped	علی رحیمی	09373043323	تهران، نیاوران، کوچه 40، پلاک 182		online	2026-08-20 14:01:43.729+00
48	\N	7420000	delivered	نگار کریمی	09552948383	تهران، پاسداران، کوچه 3، پلاک 30		onsite	2026-07-30 00:05:14.731+00
49	\N	23140000	shipped	سارا محمدی	09687539204	تهران، شهرک غرب، کوچه 52، پلاک 28		online	2026-10-05 19:40:22.733+00
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, product_id, size, stock, sku, created_at) FROM stdin;
2	20	5-6	9	MM-20-56	2026-11-25 16:14:08.067158+00
3	20	7-8	8	MM-20-78	2026-11-25 16:14:08.067814+00
4	20	9-10	10	MM-20-910	2026-11-25 16:14:08.068514+00
5	21	3-4	7	MM-21-34	2026-11-25 16:14:08.06928+00
6	21	5-6	3	MM-21-56	2026-11-25 16:14:08.069955+00
7	21	7-8	7	MM-21-78	2026-11-25 16:14:08.070685+00
8	22	5-6	4	MM-22-56	2026-11-25 16:14:08.071385+00
9	22	7-8	3	MM-22-78	2026-11-25 16:14:08.071969+00
10	22	9-10	7	MM-22-910	2026-11-25 16:14:08.072615+00
11	22	11-12	3	MM-22-1112	2026-11-25 16:14:08.073205+00
12	23	4-5	5	MM-23-45	2026-11-25 16:14:08.073745+00
13	23	6-7	7	MM-23-67	2026-11-25 16:14:08.074295+00
14	23	8-9	10	MM-23-89	2026-11-25 16:14:08.074823+00
15	23	10-11	4	MM-23-1011	2026-11-25 16:14:08.075395+00
16	24	4-5	3	MM-24-45	2026-11-25 16:14:08.075952+00
17	24	6-7	4	MM-24-67	2026-11-25 16:14:08.076549+00
18	24	8-9	5	MM-24-89	2026-11-25 16:14:08.07717+00
19	25	4-5	15	MM-25-45	2026-11-25 16:14:08.07774+00
20	25	6-7	25	MM-25-67	2026-11-25 16:14:08.07828+00
21	25	8-9	15	MM-25-89	2026-11-25 16:14:08.078798+00
22	25	10-11	16	MM-25-1011	2026-11-25 16:14:08.079322+00
23	25	12-13	26	MM-25-1213	2026-11-25 16:14:08.079814+00
24	26	3-4	13	MM-26-34	2026-11-25 16:14:08.080384+00
25	26	5-6	7	MM-26-56	2026-11-25 16:14:08.080933+00
26	26	7-8	7	MM-26-78	2026-11-25 16:14:08.081485+00
27	26	9-10	6	MM-26-910	2026-11-25 16:14:08.08201+00
28	27	2-3	14	MM-27-23	2026-11-25 16:14:08.082543+00
29	27	4-5	11	MM-27-45	2026-11-25 16:14:08.083068+00
30	27	6-7	15	MM-27-67	2026-11-25 16:14:08.083567+00
31	27	8-9	17	MM-27-89	2026-11-25 16:14:08.084089+00
32	28	2-3	10	MM-28-23	2026-11-25 16:14:08.084625+00
33	28	4-5	16	MM-28-45	2026-11-25 16:14:08.085152+00
34	28	6-7	16	MM-28-67	2026-11-25 16:14:08.085739+00
35	28	8-9	8	MM-28-89	2026-11-25 16:14:08.086412+00
36	29	0-6m	10	MM-29-06m	2026-11-25 16:14:08.087006+00
37	29	6-12m	20	MM-29-612m	2026-11-25 16:14:08.08754+00
38	29	12-24m	11	MM-29-1224m	2026-11-25 16:14:08.08811+00
39	30	3-4	19	MM-30-34	2026-11-25 16:14:08.088653+00
40	30	5-6	11	MM-30-56	2026-11-25 16:14:08.089174+00
41	30	7-8	11	MM-30-78	2026-11-25 16:14:08.089684+00
42	30	9-10	17	MM-30-910	2026-11-25 16:14:08.090327+00
43	31	4-5	7	MM-31-45	2026-11-25 16:14:08.090892+00
44	31	6-7	6	MM-31-67	2026-11-25 16:14:08.091512+00
45	31	8-9	6	MM-31-89	2026-11-25 16:14:08.092152+00
46	32	28	25	MM-32-28	2026-11-25 16:14:08.092779+00
47	32	30	27	MM-32-30	2026-11-25 16:14:08.093369+00
48	32	32	12	MM-32-32	2026-11-25 16:14:08.093986+00
49	32	34	22	MM-32-34	2026-11-25 16:14:08.094618+00
50	32	36	24	MM-32-36	2026-11-25 16:14:08.09523+00
51	33	17	14	MM-33-17	2026-11-25 16:14:08.095842+00
52	33	18	33	MM-33-18	2026-11-25 16:14:08.096643+00
53	33	19	33	MM-33-19	2026-11-25 16:14:08.097428+00
54	33	20	14	MM-33-20	2026-11-25 16:14:08.098126+00
55	34	25	20	MM-34-25	2026-11-25 16:14:08.0988+00
56	34	27	10	MM-34-27	2026-11-25 16:14:08.099503+00
57	34	29	9	MM-34-29	2026-11-25 16:14:08.100191+00
58	34	31	17	MM-34-31	2026-11-25 16:14:08.100896+00
59	34	33	19	MM-34-33	2026-11-25 16:14:08.101554+00
60	35	4-5	13	MM-35-45	2026-11-25 16:14:08.102239+00
61	35	6-7	19	MM-35-67	2026-11-25 16:14:08.10309+00
62	35	8-9	25	MM-35-89	2026-11-25 16:14:08.103787+00
63	35	10-11	22	MM-35-1011	2026-11-25 16:14:08.104668+00
64	36	6-12m	7	MM-36-612m	2026-11-25 16:14:08.105344+00
65	36	12-24m	9	MM-36-1224m	2026-11-25 16:14:08.106096+00
66	19	4-5	4	MM-19-45	2026-11-25 16:14:08.107072+00
67	19	6-7	4	MM-19-67	2026-11-25 16:14:08.107924+00
68	19	8-9	3	MM-19-89	2026-11-25 16:14:08.108962+00
69	19	10-11	7	MM-19-1011	2026-11-25 16:14:08.109701+00
1	20	3-4	20	MM-20-34	2026-11-25 16:14:08.066001+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, slug, description, price, discount_price, category_id, stock, sizes, colors, images, rating, review_count, sales_count, is_new, is_featured, is_offer, created_at) FROM stdin;
21	پیراهن سفید مهمانی ملکه بالن‌ها	balloon-queen-white-dress	پیراهن سفید کوتاه آستین‌بالنی با دامن پفی لایه‌لایه؛ انتخابی رویایی برای مهمانی‌ها. زیور کفش و تل رایگان داخل بسته ارسال می‌شود.	5600000	4480000	12	25	["3-4","5-6","7-8"]	[{"name":"سفید","hex":"#ffffff"}]	["https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	5	74	260	f	t	t	2026-11-24 19:10:56.118105+00
22	کت و شلوار رسمی مشکی پسرانه آرش	arash-black-suit	کت و شلوار دو دکمه از پارچه فاستونی ایتالیایی با پنج‌جیب دوزی اصیل، کراوات هدیه؛ مناسب مراسم عقد، تولد و عکاسی رسمی.	6150000	\N	9	28	["5-6","7-8","9-10","11-12"]	[{"name":"مشکی","hex":"#1c1c1e"}]	["https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	152	471	f	t	f	2026-11-24 19:10:56.118105+00
23	کت تک سرمه‌ای پسرانه با اسلش جین	navy-blazer-boy	کت تک اسپرت سرمه‌ای با یقه آرگونا و دکمه‌های طلایی؛ قابل ست شدن با جین و کتان. داخل آستر نخی ضد حساسیت دارد.	3890000	\N	9	36	["4-5","6-7","8-9","10-11"]	[{"name":"سرمه‌ای","hex":"#22344f"}]	["https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.7	88	342	f	f	f	2026-11-24 19:10:56.118105+00
24	ست کت و شلوار پاپیون‌دار پسرانه بارون	baron-bowtie-suit	ست سه تیکه کت، شلوار و پاپیون قرمز طرح چهارخانه؛ طراحی اروپایی با دوختی لطیف برای مهمانی‌های رسمی کودک.	5280000	4590000	9	22	["4-5","6-7","8-9"]	[{"name":"مشکی","hex":"#1c1c1e"}]	["https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	64	215	t	f	t	2026-11-24 19:10:56.118105+00
25	تیشرت اسپرت پسرانه طرح رِد وال	redwall-sport-tee	تیشرت پنبه‌ای ۱۰۰٪ با چاپ مقاوم و دوردوزی شده؛ خنک، لطیف و مناسب استفاده روزمره و ورزش.	890000	690000	9	120	["4-5","6-7","8-9","10-11","12-13"]	[{"name":"زرشکی","hex":"#a93226"},{"name":"آبی","hex":"#2e6da4"}]	["https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.6	210	830	t	f	t	2026-11-24 19:10:56.118105+00
26	کاپشن صورتی کلاسیک بچگانه هاوانا	havana-pink-coat	کاپشن زمستانی با عایق پر طبیعی، ضد آب و ضد باد؛ مناسب روزهای سرد پاییز و زمستان. داخل با پشم مرینو آستر شده است.	2750000	\N	10	47	["3-4","5-6","7-8","9-10"]	[{"name":"صورتی","hex":"#f4a7b9"},{"name":"قرمز","hex":"#d94f4f"}]	["https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	167	689	f	t	f	2026-11-24 19:10:56.118105+00
27	کاپشن قرمز ورزشی دخترانه پیک	red-parka-girl	کاپشن اسپرت قرمز با کلاه خزدار جداشونده؛ سبک و گرم با زیپ فلزی ضدزنگ. مناسب بازی در فضای باز و برف.	2350000	1980000	10	58	["2-3","4-5","6-7","8-9"]	[{"name":"قرمز","hex":"#d43a3a"}]	["https://images.pexels.com/photos/11111822/pexels-photo-11111822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.7	134	512	t	t	t	2026-11-24 19:10:56.118105+00
28	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	explorer-orange-jacket	کاپشن فلوئورسنت نارنجی با رفلکتور ایمنی در تاریکی؛ انتخابی عالی برای کودکان پرانرژی. جیب‌های زیپ‌دار و ضد آب.	2600000	\N	10	64	["2-3","4-5","6-7","8-9"]	[{"name":"نارنجی","hex":"#e2703a"}]	["https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.5	91	296	f	f	f	2026-11-24 19:10:56.118105+00
29	پالتو صورتی نوزاد زمستانی بیبی‌رز	baby-rose-winter-coat	پالتو پشمی نوزاد با کلاه گوش‌دار و دستکش دو دکمه؛ از پارچه نرم ضدحساسیت با آستر فلانل. مناسب ۰ تا ۲۴ ماه.	1980000	\N	11	73	["0-6m","6-12m","12-24m"]	[{"name":"صورتی","hex":"#f7c6d0"}]	["https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	143	604	t	t	f	2026-11-24 19:10:56.118105+00
30	پیراهن آبی استودیو دخترانه آرمیتا	armita-blue-dress	پیراهن آبی کاربنی با پایه‌ی ویسکوز لطیف و کمر کشی؛ مناسب مهمانی و عکاسی. دوخت دقیق و رنگ ثابت در شستشو.	1450000	\N	8	85	["3-4","5-6","7-8","9-10"]	[{"name":"آبی","hex":"#4a6fa5"}]	["https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.6	112	458	t	f	f	2026-11-24 19:10:56.118105+00
31	پیراهن سفید تور و پاپیون دخترانه رها	raha-tulle-dress	پیراهن مجلسی لایه‌ای با تور فرانسوی و پاپیون مخملی؛ با پاپیون یدکی اضافه. مناسب مراسم رسمی و عکاسی تولد.	4950000	3960000	8	29	["4-5","6-7","8-9"]	[{"name":"سفید","hex":"#ffffff"},{"name":"زرشکی","hex":"#8e2a3c"}]	["https://images.pexels.com/photos/14897706/pexels-photo-14897706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	79	238	f	f	t	2026-11-24 19:10:56.118105+00
32	کفش ورزشی خاکستری سامیکس رانر	samix-gray-runner	کفش ورزشی با زیره EVA سبک و انعطاف‌پذیر؛ تهویه عالی و پنجه پهن مناسب رشد طبیعی پا. در سه سایز رنگ‌بندی.	1740000	\N	13	95	["28","30","32","34","36"]	[{"name":"خاکستری","hex":"#8a8d91"}]	["https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.7	189	720	f	f	f	2026-11-24 19:10:56.118105+00
33	کتانی قرمز نوزاد پاپی‌فیت	papy-fit-red-sneaker	کتانی نوزادی با زیره نرم ابری و چسبک قابل تنظیم؛ اولین کفش ایده‌آل برای نوزادان در حال راه‌افتادن.	950000	790000	13	110	["17","18","19","20"]	[{"name":"قرمز","hex":"#c0392b"}]	["https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	156	815	f	f	t	2026-11-24 19:10:56.118105+00
34	کتانی سفید مینی رانر سفید استار	mini-star-white-sneaker	کتانی سفید تمام‌چرم با دوخت دودوزی و زیره لاستیکی ضد لغزش؛ مناسب مدرسه و روزمره. همراه با بند اضافه هدیه.	1290000	\N	13	78	["25","27","29","31","33"]	[{"name":"سفید","hex":"#ffffff"}]	["https://images.pexels.com/photos/5275386/pexels-photo-5275386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.5	121	540	t	t	f	2026-11-24 19:10:56.118105+00
35	ست نامیکی دو تیکه بچگانه مارین	marine-nautical-set	ست دو تیکه بلوز راه‌راه ملوانی و شلوارک کتان؛ پارچه خنک تابستانی با دوخت تقویت‌شده. مناسب ست دونفره.	1680000	\N	10	88	["4-5","6-7","8-9","10-11"]	[{"name":"سرمه‌ای-سفید","hex":"#22344f"}]	["https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	148	633	f	t	f	2026-11-24 19:10:56.118105+00
36	پیراهن تور عاجی نوزاد پرنسس آوا	ava-ivory-tulle	پیراهن بلند تور عاجی با سنگ‌دوزی ظریف و تل پاپیون هدیه؛ انتخابی رویایی برای عکاسی و جشن‌های نوزادی.	3350000	2680000	11	34	["6-12m","12-24m"]	[{"name":"عاجی","hex":"#efe6d8"}]	["https://images.pexels.com/photos/29610395/pexels-photo-29610395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	87	265	t	f	t	2026-11-24 19:10:56.118105+00
20	سارافون گلدار وینتاج رزالی	vintage-floral-pinafore	سارافون گلدار با الگوی کلاسیک وینتاج، دوخت فرانسوی با پشت بندهای قابل تنظیم؛ همراه با پیراهن سفید حریر هدیه‌ای.	3200000	\N	12	47	["3-4","5-6","7-8","9-10"]	[{"name":"گلدار کرمی","hex":"#d9c6a5"}]	["https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	96	388	t	t	f	2026-11-24 19:10:56.118105+00
19	پیراهن مجلسی سلطنتی صورتی آرگونا	royal-pink-gown	پیراهن مجلسی دخترانه از پارچه ابریشم و تور فرانسوی با گلدوزی دستی، مناسب مراسم رسمی و تولد. آستر لطیف و سازگار با پوست حساس کودک دارد.	4850000	3890000	12	32	["4-5","6-7","8-9","10-11"]	[{"name":"صورتی","hex":"#f2a7c3"},{"name":"بژ","hex":"#e6d3b8"}]	["https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	128	542	t	t	t	2026-11-24 19:10:56.118105+00
\.


--
-- Data for Name: returns_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.returns_requests (id, order_id, type, reason, status, note, created_at) FROM stdin;
1	3	exchange	سایز کوچک بود	requested	تعویض با سایز بالاتر	2026-11-25 16:14:08.115855+00
2	4	refund	مغایرت رنگ	approved	بازپرداخت پس از تأیید انبار	2026-11-25 16:14:08.115855+00
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, user_id, author_name, rating, comment, created_at) FROM stdin;
8	19	4	سارا محمدی	5	پارچه و دوخت فوق‌العاده بود، دخترم عاشق پیراهن شد. بسته‌بندی هم عالی بود.	2026-11-24 19:10:56.122321+00
9	19	\N	مریم کاظمی	5	دقیقاً مثل عکس‌هاست؛ گلدوزی‌ها خیلی تمیز کار شده.	2026-11-24 19:10:56.122321+00
10	22	4	سارا محمدی	5	برای عکاسی رسمی پسرم گرفتم؛ همه از شدت خوش‌تیپی تعجب کردند!	2026-11-24 19:10:56.122321+00
11	22	\N	رضا توکلی	4	کیفیت خوب، فقط کمی دم‌پا بلند بود که خیاط کوتاه کرد.	2026-11-24 19:10:56.122321+00
12	26	\N	لیلا احمدی	5	خیلی گرم و سبک است، برای برف کاملاً مناسبه.	2026-11-24 19:10:56.122321+00
13	33	\N	الهه نوری	5	اولین کفش پسرم؛ زیره‌اش واقعاً نرمه و پای بچه رو اذیت نمی‌کنه.	2026-11-24 19:10:56.122321+00
\.


--
-- Data for Name: revisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.revisions (id, label, snapshot, created_by, created_at) FROM stdin;
1	پشتیبان تست نهایی	{"version":1,"takenAt":"2026-11-24T21:15:28.625Z","settings":[{"key":"store.name","value":"مینی‌مودا"},{"key":"store.tagline","value":"مد و پوشاک کودک و نوزاد"},{"key":"announcement.enabled","value":"true"},{"key":"announcement.text","value":"ارسال رایگان سفارش‌های بالای ۲,۰۰۰,۰۰۰ تومان + ۷ روز ضمانت بازگشت کالا"},{"key":"announcement.tone","value":"gold"},{"key":"free_shipping_at","value":"2000000"},{"key":"maintenance.enabled","value":"false"},{"key":"maintenance.message","value":"سایت به‌طور موقت در حال به‌روزرسانی است؛ تا لحظاتی دیگر بازمی‌گردیم."},{"key":"layout.products","value":"grid"},{"key":"home.hero_compact","value":"false"},{"key":"responsive.cat_row_mobile","value":"true"},{"key":"custom.css","value":""},{"key":"custom.js","value":""},{"key":"custom.head","value":""},{"key":"seo.title_suffix","value":"| مینی‌مودا"},{"key":"seo.og_image","value":"/images/hero-royal-junior.jpg"},{"key":"theme.primary","value":"#4a1042"},{"key":"theme.accent","value":"#e11d48"},{"key":"theme.gold","value":"#fbbf24"},{"key":"theme.font","value":"Estedad"},{"key":"theme.radius","value":"22"}],"themes":[{"slug":"minimoda-classic","isActive":false,"isDefault":true,"tokens":"{\\"primary\\":\\"#14264a\\",\\"accent\\":\\"#db2777\\",\\"gold\\":\\"#f2b33d\\",\\"font\\":\\"Vazirmatn\\",\\"radius\\":\\"18\\"}","version":"1.4.0"},{"slug":"minimal-modern","isActive":false,"isDefault":false,"tokens":"{\\"primary\\":\\"#334155\\",\\"accent\\":\\"#0f766e\\",\\"gold\\":\\"#a3e635\\",\\"font\\":\\"Noto Kufi Arabic\\",\\"radius\\":\\"12\\"}","version":"1.1.0"},{"slug":"royal-junior-theme","isActive":true,"isDefault":true,"tokens":"{\\"primary\\":\\"#4a1042\\",\\"accent\\":\\"#e11d48\\",\\"gold\\":\\"#fbbf24\\",\\"font\\":\\"Estedad\\",\\"radius\\":\\"22\\"}","version":"2.0.0"}],"sections":[{"id":"hero","enabled":true,"sort":1},{"id":"categories","enabled":true,"sort":2},{"id":"banners","enabled":true,"sort":3},{"id":"trust","enabled":true,"sort":4},{"id":"festival","enabled":true,"sort":5},{"id":"products","enabled":true,"sort":7},{"id":"duo","enabled":true,"sort":8},{"id":"blog","enabled":true,"sort":6}],"banners":[{"title":"کاپشن‌های زمستانی","subtitle":"تا ۳۰٪ تخفیف","cta":"خرید کنید","href":"/products?cat=kids&q=کاپشن","image":"https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-rose-900/80","sort":1,"active":true},{"title":"پیراهن‌های مجلسی","subtitle":"کالکشن سلطنتی","cta":"خرید کنید","href":"/products?cat=formal","image":"https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-purple-900/80","sort":2,"active":true},{"title":"کتانی‌های ورزشی","subtitle":"ضد لغزش و سبک","cta":"خرید کنید","href":"/products?cat=shoes","image":"https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-sky-900/80","sort":3,"active":true},{"title":"کت و شلوار پسرانه","subtitle":"ست کامل رسمی","cta":"خرید کنید","href":"/products?cat=boys&q=کت","image":"https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-slate-900/85","sort":4,"active":true}]}	مدیر فروشگاه	2026-11-24 21:15:28.626454+00
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, token, user_id, expires_at) FROM stdin;
3	a3733774075f61d1179ba8ffb7871fb92dac83a5370e3a2907fc7415f4382c89	3	2026-12-24 19:59:18.459+00
4	b7e773acff7ddcbc0d3622a0741a5f50481c781a2effc26921a62490122f9527	3	2026-12-24 19:59:55.259+00
5	09c89bfa4458550d4b2b2c13032746cc3ae6c450a6d0f0791d1f4331afbc0c16	3	2026-12-24 20:03:18.273+00
6	9e03d3fa0f52de6951aa2dee5e953752e810b56139da2303493be474d50e0dd1	3	2026-12-24 20:06:41.914+00
7	40f1b1b47cafcc51d28b08ceef2b98f52224be8f52af0aac98cf912aa059c848	3	2026-12-24 20:11:47.82+00
8	7a5bc984fcea80eecbaead453d3d120339c734e598f8ffdd8b5257aa856ffe8d	3	2026-12-24 20:11:47.878+00
9	b2600b81adf0a39c742fe9831363a60a7bdc2e1a8b190bfd740f611ec371abeb	3	2026-12-24 20:14:55.824+00
10	8b25dfe74d56633e901d02965935de6223e8134fcb05a9e50cf3c86048e994fb	3	2026-12-24 20:15:39.604+00
11	a3d19bd2edc146579030ee26e8a5dbbade9f8acd48e0fdb7fa6802343a6834bd	3	2026-12-24 20:21:43.935+00
12	18186693af3436af708a96f76ddc3bbd5789c24f24b808f99c5685e8c21af51f	3	2026-12-24 21:15:15.702+00
13	a8ad49428d5256b312b79a2bf631fdba01fc3310bfac5c6eb50a37d820af1dbc	3	2026-12-24 21:22:15.48+00
14	89d5a4df5971be38ce75f7b072b9b1923f44e6b23d079d2318943452b1e4279b	3	2026-12-24 21:22:19.426+00
15	f240d0c4b27d5a9a9bba9de506fe888c64a4074a5c131e240db5138576442c88	3	2026-12-24 21:22:24.708+00
16	9bcfadae0004d1f258ac299cc1c55e751ebf8dd4d4a00bcdd630096e79af089e	3	2026-12-24 21:22:51.23+00
17	b9086d2b17c3669a8e71b844737defb756b7ccc45c0e5d24d9cf53b0d9bb02f2	3	2026-12-24 21:22:55.025+00
18	0ddef3fb672474710e975eeb4ac0dd250217e238c43863659f28db5a24db4bde	3	2026-12-25 15:45:43.2+00
19	a26438e5902b53ea4fbca9d3abfe1a31da25cfaaf1d0a37d280937e2fa1e4632	3	2026-12-25 15:47:17.677+00
20	653de9ccff52db6b0473dd8a1ac8add6f22704e8e93f5607f3c8531fbfb027da	3	2026-12-25 16:21:06.457+00
21	358be9728fb863ca8e935fdf9bdeb3f33f43586d9d87fa29971e0cc46e49df2c	3	2026-12-25 16:22:01.212+00
22	6e5c50376a35a9252fa78497bdcf5d471ed8b9ecc41a922ee1b648699ac44b67	3	2026-12-25 17:02:40.784+00
23	aa8bf8c81e6ad5b85e95b49386fddccd019c64a5abaf8c4264f3f72c8b12fbf7	3	2026-12-25 17:02:45.423+00
24	3582be1199fe7f92db08270da79385aaf48ca0e62f6c45d3930f917a90d477de	3	2026-12-25 17:02:51.813+00
25	9aebfb25bb8926066bcb6f5d6a55d0273d2c7fdf74802d09f6b157f9b38bc40e	3	2026-12-25 17:02:54.037+00
26	d80e52f557b1b99f735bdfca9a5d443886d906c9a193f0080e82a685101661ee	3	2026-12-25 17:02:58.765+00
27	f674804b06f75e87ca40b801cf0401570bd2c82f7823244cfeee947d471fb3fd	4	2026-12-25 17:03:00.218+00
28	cef0a5b018c4aea2847606126856aa97e378ecb562b15971ef850047009cb44f	3	2026-12-25 17:03:02.786+00
29	0fe4c8bf34dbf8c45be91bcabb690621db763cccd2170e509f1cd4db91e0e6db	3	2026-12-25 17:03:09.087+00
30	890c167afc6b5148fde039243f63a9ceeadedbd731e7ac39ee2dfb8fef8ea21d	3	2026-12-25 17:03:10.064+00
31	15d92eeac351860f699e0b1c9b880a0d5bf6f5a576f17da5b6cc317ab0971925	3	2026-12-25 19:39:59.766+00
32	6d4f74d7840e5a757585589087d9b34b3d07465800d3d460905345346f6e1267	3	2026-12-25 19:41:27.376+00
33	c3aecf0eb7c55ad16e9c1ee4d1459dad3f217f926697f74306c0dfcf72d9a3d0	3	2026-12-25 19:43:11.213+00
34	5db3970b1d469f96ac659cd219fa53d8e0ce0b1bbeb08e210862aed1656fdfa0	3	2026-12-25 19:43:13.819+00
35	e85ed7cadb843666f63052bb99f8c15ab33e11826e0ce4bf1906f97a093daf1b	4	2026-12-25 20:04:34.266+00
36	c1ac3c23ff89b4c8ce9e26b6ba58724e8c143ca2e642aabe1ebc19619f6e8acd	3	2026-12-25 20:04:39.158+00
37	309b5ad065296b12d16370531a61e759ab146d726db950d31668be4b991b4f7d	4	2026-12-25 20:04:49.618+00
38	89635ef52f43b7535d9bbf84855b334e94016dd24915fca6b977a88ca1585549	3	2026-12-25 20:04:54.424+00
\.


--
-- Data for Name: shipping_methods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_methods (id, name, cost, free_over, eta_days, active, sort, created_at) FROM stdin;
1	پیک اختصاصی (تهران و کرج)	35000	2000000	1	t	1	2026-11-25 16:14:08.059495+00
2	تیپاکس	45000	2000000	2	t	2	2026-11-25 16:14:08.059495+00
3	پست پیشتاز	38000	2000000	3	t	3	2026-11-25 16:14:08.059495+00
4	باربری (سفارش‌های عمده)	250000	0	4	t	4	2026-11-25 16:14:08.059495+00
\.


--
-- Data for Name: size_charts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.size_charts (id, name, rows, active, created_at) FROM stdin;
1	جدول سایزبندی کودک (۲ تا ۱۱ سال)	[{"size":"2-3","height":"92-98","chest":"56-58","waist":"50-52"},{"size":"4-5","height":"104-110","chest":"60-62","waist":"54-56"},{"size":"6-7","height":"116-122","chest":"64-66","waist":"58-60"},{"size":"8-9","height":"128-134","chest":"68-70","waist":"62-64"},{"size":"10-11","height":"140-146","chest":"72-74","waist":"66-68"}]	t	2026-11-25 19:38:33.473097+00
2	جدول سایزبندی نوزاد (۰ تا ۲۴ ماه)	[{"size":"0-6m","height":"62-68","chest":"44-46","waist":"42-44"},{"size":"6-12m","height":"74-80","chest":"48-50","waist":"46-48"},{"size":"12-24m","height":"86-92","chest":"52-54","waist":"50-52"}]	t	2026-11-25 19:38:33.473097+00
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_movements (id, product_id, delta, reason, note, created_at) FROM stdin;
1	20	50	ورود از تأمین‌کننده	محموله نساجی پارینه یزد — فاکتور پ-1405-021	2026-11-25 16:14:08.110752+00
2	23	30	ورود از تأمین‌کننده	محموله آروشا — ست رسمی پسرانه	2026-11-25 16:14:08.110752+00
3	26	-12	فروش	خروج خودکار از سفارش‌های وب	2026-11-25 16:14:08.110752+00
4	27	-5	مرجوعی مشتری	مرجوع شد — سالم؛ بازگشت به انبار	2026-11-25 16:14:08.110752+00
5	21	20	اصلاح موجودی	شمارش دوره‌ای انبار — مغایرت +۲۰	2026-11-25 16:14:08.110752+00
6	\N	0	شمارش دوره‌ای	انبارگردانی فصلی با دقت ۹۸٪ انجام شد	2026-11-25 16:14:08.110752+00
7	20	90	افزایش موجودی تنوع	سایز 3-4 — SKU MM-20-34	2026-11-25 16:22:12.959649+00
8	20	-79	کاهش موجودی تنوع	سایز 3-4 — SKU MM-20-34	2026-11-25 16:22:12.974068+00
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (id, name, contact_person, phone, address, notes, created_at) FROM stdin;
1	نساجی پارینه یزد	مهندس شریفی	09132567890	یزد، شهرک صنعتی جهان‌آباد	پارچه‌های پنبه‌ای و فلانل — تحویل هفتگی	2026-11-25 16:14:08.057907+00
2	پوشاک کودک آروشا	خانم رحیمی	02144556677	تهران، شهرک صنعتی شمس‌آباد	کالکشن‌های مجلسی؛ ۱۵ روز تسویه	2026-11-25 16:14:08.057907+00
3	کفش پاپی‌فیت	آقا توکلی	03133445566	اصفهان، خیابان شیخ بهایی	زیره EVA اختصاصی — MOQ هر سایز ۱۰۰ جفت	2026-11-25 16:14:08.057907+00
\.


--
-- Data for Name: theme_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.theme_settings (key, value, label, "group", updated_at, updated_by) FROM stdin;
store.name	مینی‌مودا	نام فروشگاه	general	2026-11-25 15:40:04.074636+00	seed
store.tagline	مد و پوشاک کودک و نوزاد	شعار/توضیح کوتاه	general	2026-11-25 15:40:04.074636+00	seed
announcement.enabled	true	نوار اطلاع‌رسانی فعال باشد	announcement	2026-11-25 15:40:04.074636+00	seed
announcement.tone	gold	رنگ نوار (gold | pink | navy)	announcement	2026-11-25 15:40:04.074636+00	seed
free_shipping_at	2000000	آستانه ارسال رایگان (تومان)	commerce	2026-11-25 15:40:04.074636+00	seed
maintenance.enabled	false	حالت تعمیر (فقط مدیران وارد شوند)	commerce	2026-11-25 15:40:04.074636+00	seed
maintenance.message	سایت به‌طور موقت در حال به‌روزرسانی است؛ تا لحظاتی دیگر بازمی‌گردیم.	پیام حالت تعمیر	commerce	2026-11-25 15:40:04.074636+00	seed
layout.products	grid	چیدمان لیست محصولات (grid | list)	layout	2026-11-25 15:40:04.074636+00	seed
home.hero_compact	false	هیرو فشرده در صفحه اصلی	layout	2026-11-25 15:40:04.074636+00	seed
responsive.cat_row_mobile	true	نمایش آیکن‌های دسته‌بندی در موبایل	layout	2026-11-25 15:40:04.074636+00	seed
theme.font	Vazirmatn	فونت بدنه	design	2026-11-25 15:40:04.074636+00	seed
custom.css		CSS سفارشی (تزریق در کل سایت)	code	2026-11-25 15:40:04.074636+00	seed
custom.js		JavaScript سفارشی (تزریق در body)	code	2026-11-25 15:40:04.074636+00	seed
custom.head		کدهای <head> (متا تگ‌ها و وریفیکیشن)	code	2026-11-25 15:40:04.074636+00	seed
seo.title_suffix	| مینی‌مودا	پسوند عنوان صفحات	seo	2026-11-25 15:40:04.074636+00	seed
seo.og_image	/images/hero-royal-junior.jpg	تصویر پیش‌فرض اشتراک‌گذاری	seo	2026-11-25 15:40:04.074636+00	seed
home.categories_enabled	true	نمایش بخش دسته‌بندی‌های محبوب در سایت	home	2026-11-25 15:47:50.925+00	مدیر فروشگاه
home.categories_rows	1	تعداد ردیف‌های نمایش دسته‌بندی‌های محبوب (۱ تا ۳)	home	2026-11-25 15:47:50.926+00	مدیر فروشگاه
theme.primary	#1b3a6b	رنگ اصلی قالب	design	2026-11-25 15:40:04.074636+00	seed
theme.accent	#e91e63	رنگ تأکیدی (دکمه‌ها)	design	2026-11-25 15:40:04.074636+00	seed
theme.gold	#ffc107	رنگ طلایی (هایلایت)	design	2026-11-25 15:40:04.074636+00	seed
theme.radius	20	گردی گوشه‌ها (px)	design	2026-11-25 15:40:04.074636+00	seed
announcement.text	تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی	متن نوار اطلاع‌رسانی	announcement	2026-11-25 15:40:04.074636+00	seed
\.


--
-- Data for Name: themes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.themes (id, name, slug, description, author, version, preview, is_active, is_default, tokens, installed_at, updated_at) FROM stdin;
5	رویال جونیور	royal-junior-theme	پوسته مجلسی و لوکس با بنفش ارغوانی و رز گلد؛ مناسب کالکشن‌های مجلسی و عکاسی.	MiniModa Studio	2.0.0	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800	f	f	{"primary":"#4a1042","accent":"#e11d48","gold":"#fbbf24","font":"Estedad","radius":"22"}	2026-11-25 15:40:04.076734+00	2026-11-25 15:40:04.076734+00
6	مینیمال مدرن	minimal-modern	پوسته خلوت و امروزی با خاکستری اسلیت و سبز زمردی؛ مناسب تجربه خرید سریع و مینیمال.	MiniModa Lab	1.1.0	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800	f	f	{"primary":"#334155","accent":"#0f766e","gold":"#a3e635","font":"Noto Kufi Arabic","radius":"12"}	2026-11-25 15:40:04.076734+00	2026-11-25 15:40:04.076734+00
4	مینی‌مودا کلاسیک	minimoda-classic	قالب رسمی فروشگاه — سرمه‌ای سلطنتی با طلایی و صورتی پررنگ؛ بهینه برای فروش و هویت برند.	MiniModa Studio	1.4.0	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800	t	t	{"primary":"#1b3a6b","accent":"#e91e63","gold":"#ffc107","font":"Vazirmatn","radius":"20"}	2026-11-25 15:40:04.076734+00	2026-11-25 15:40:04.076734+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, phone, password_hash, address, role, created_at) FROM stdin;
3	مدیر فروشگاه	admin@minimoda.ir	02188766554	2ad09c820531cdb9ebbc2423107fe0d9:e3b5ea29a05c0990572d27e82afe734931efb37eaf4fee184ef13a2d5a7d888f711627dbb8f9739cc09ed8d3b3b885596c671f6b2c9f50e4a0fbc0a5ccddd4ee	تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۲	admin	2026-11-24 19:10:56.037937+00
4	سارا محمدی	sara@example.com	09121234567	f539cb84dcb7a1f4f7694bcfa582ae74:4c2021436c8a973164c7cc7f55f32ff103e874f7230098f2b9c119cac5189a06fab79ae0a575fe8d568fb4221a70be81f3e198df1d8f0d4436621941ad83b7b7	تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴	user	2026-11-24 19:10:56.106438+00
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlists (id, user_id, product_id) FROM stdin;
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 42, true);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.banners_id_seq', 8, true);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 8, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_id_seq', 4, true);


--
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.campaigns_id_seq', 3, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 15, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 5, true);


--
-- Name: content_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.content_pages_id_seq', 4, true);


--
-- Name: discount_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discount_codes_id_seq', 5, true);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.newsletter_subscribers_id_seq', 1, true);


--
-- Name: notices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notices_id_seq', 6, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 92, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 49, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 69, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 37, true);


--
-- Name: returns_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.returns_requests_id_seq', 2, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 13, true);


--
-- Name: revisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.revisions_id_seq', 1, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 38, true);


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_methods_id_seq', 4, true);


--
-- Name: size_charts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.size_charts_id_seq', 2, true);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 10, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 3, true);


--
-- Name: themes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.themes_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishlists_id_seq', 1, false);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_unique UNIQUE (slug);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: brands brands_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_slug_unique UNIQUE (slug);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_slug_unique UNIQUE (slug);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: content_pages content_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_pages
    ADD CONSTRAINT content_pages_pkey PRIMARY KEY (id);


--
-- Name: content_pages content_pages_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_pages
    ADD CONSTRAINT content_pages_slug_unique UNIQUE (slug);


--
-- Name: discount_codes discount_codes_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_codes
    ADD CONSTRAINT discount_codes_code_unique UNIQUE (code);


--
-- Name: discount_codes discount_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_codes
    ADD CONSTRAINT discount_codes_pkey PRIMARY KEY (id);


--
-- Name: homepage_sections homepage_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_sections
    ADD CONSTRAINT homepage_sections_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: notices notices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notices
    ADD CONSTRAINT notices_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: returns_requests returns_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns_requests
    ADD CONSTRAINT returns_requests_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: revisions revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revisions
    ADD CONSTRAINT revisions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_token_unique UNIQUE (token);


--
-- Name: shipping_methods shipping_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_methods
    ADD CONSTRAINT shipping_methods_pkey PRIMARY KEY (id);


--
-- Name: size_charts size_charts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.size_charts
    ADD CONSTRAINT size_charts_pkey PRIMARY KEY (id);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: theme_settings theme_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_settings
    ADD CONSTRAINT theme_settings_pkey PRIMARY KEY (key);


--
-- Name: themes themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_pkey PRIMARY KEY (id);


--
-- Name: themes themes_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_slug_unique UNIQUE (slug);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: variant_product_size_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX variant_product_size_unique ON public.product_variants USING btree (product_id, size);


--
-- Name: wishlist_user_product_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX wishlist_user_product_unique ON public.wishlists USING btree (user_id, product_id);


--
-- Name: campaigns campaigns_discount_code_id_discount_codes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_discount_code_id_discount_codes_id_fk FOREIGN KEY (discount_code_id) REFERENCES public.discount_codes(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: product_variants product_variants_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: returns_requests returns_requests_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns_requests
    ADD CONSTRAINT returns_requests_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sessions sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: stock_movements stock_movements_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rAkZ4zP5e4Tpkz80wJDNYHjcfqRghGG4WPi8DCCPvSM5f1qtivpyvmLhZtCWZwe

