--
-- PostgreSQL database dump
--

\restrict MCnI7cLRjBbv5kBbyetqVXOWgup2AL9kgsROkHtj9o1mmWMSlFUXUKOeddXGelO

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
ALTER TABLE IF EXISTS ONLY public.widgets DROP CONSTRAINT IF EXISTS widgets_pkey;
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
ALTER TABLE IF EXISTS ONLY public.menu_items DROP CONSTRAINT IF EXISTS menu_items_pkey;
ALTER TABLE IF EXISTS ONLY public.layout_presets DROP CONSTRAINT IF EXISTS layout_presets_pkey;
ALTER TABLE IF EXISTS ONLY public.homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_pkey;
ALTER TABLE IF EXISTS ONLY public.discount_codes DROP CONSTRAINT IF EXISTS discount_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.discount_codes DROP CONSTRAINT IF EXISTS discount_codes_code_unique;
ALTER TABLE IF EXISTS ONLY public.content_pages DROP CONSTRAINT IF EXISTS content_pages_slug_unique;
ALTER TABLE IF EXISTS ONLY public.content_pages DROP CONSTRAINT IF EXISTS content_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.code_history DROP CONSTRAINT IF EXISTS code_history_pkey;
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
ALTER TABLE IF EXISTS public.widgets ALTER COLUMN id DROP DEFAULT;
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
ALTER TABLE IF EXISTS public.menu_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.layout_presets ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.discount_codes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.content_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.code_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.campaigns ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.brands ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blog_posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.banners ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.activity_logs ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.wishlists_id_seq;
DROP TABLE IF EXISTS public.wishlists;
DROP SEQUENCE IF EXISTS public.widgets_id_seq;
DROP TABLE IF EXISTS public.widgets;
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
DROP SEQUENCE IF EXISTS public.menu_items_id_seq;
DROP TABLE IF EXISTS public.menu_items;
DROP SEQUENCE IF EXISTS public.layout_presets_id_seq;
DROP TABLE IF EXISTS public.layout_presets;
DROP TABLE IF EXISTS public.homepage_sections;
DROP SEQUENCE IF EXISTS public.discount_codes_id_seq;
DROP TABLE IF EXISTS public.discount_codes;
DROP SEQUENCE IF EXISTS public.content_pages_id_seq;
DROP TABLE IF EXISTS public.content_pages;
DROP SEQUENCE IF EXISTS public.contact_messages_id_seq;
DROP TABLE IF EXISTS public.contact_messages;
DROP SEQUENCE IF EXISTS public.code_history_id_seq;
DROP TABLE IF EXISTS public.code_history;
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
-- Name: code_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.code_history (
    id integer NOT NULL,
    key text NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    created_by text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: code_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.code_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: code_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.code_history_id_seq OWNED BY public.code_history.id;


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
-- Name: layout_presets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.layout_presets (
    id integer NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    snapshot text NOT NULL,
    created_by text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: layout_presets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.layout_presets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: layout_presets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.layout_presets_id_seq OWNED BY public.layout_presets.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    location text DEFAULT 'main'::text NOT NULL,
    label text NOT NULL,
    href text DEFAULT '/'::text NOT NULL,
    parent_id integer,
    sort integer DEFAULT 0 NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    highlight boolean DEFAULT false NOT NULL
);


--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


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
-- Name: widgets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widgets (
    id integer NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    config text DEFAULT '{}'::text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: widgets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.widgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: widgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.widgets_id_seq OWNED BY public.widgets.id;


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
-- Name: code_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.code_history ALTER COLUMN id SET DEFAULT nextval('public.code_history_id_seq'::regclass);


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
-- Name: layout_presets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.layout_presets ALTER COLUMN id SET DEFAULT nextval('public.layout_presets_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


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
-- Name: widgets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widgets ALTER COLUMN id SET DEFAULT nextval('public.widgets_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, actor, action, detail, created_at) FROM stdin;
47	سیستم	نصب قالب	قالب «مینی‌مودا کلاسیک» v1.4.0 به‌عنوان قالب پیش‌فرض فعال شد	2026-11-26 11:07:11.375086+00
48	سیستم	بارگذاری اولیه	مهاجرت خودکار تنظیمات پوسته از نسخه قبلی انجام شد	2026-11-26 11:07:11.375086+00
49	مدیر فروشگاه	ویرایش تنظیمات	آستانه ارسال رایگان روی ۲,۰۰۰,۰۰۰ تومان تنظیم شد	2026-11-26 11:07:11.375086+00
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (id, title, subtitle, cta, href, image, tone, sort, active) FROM stdin;
9	کاپشن‌های زمستانی	تا ۳۰٪ تخفیف	خرید کنید	/products?cat=kids&q=کاپشن	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-rose-900/80	1	t
10	پیراهن‌های مجلسی	کالکشن سلطنتی	خرید کنید	/products?cat=formal	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-purple-900/80	2	t
11	کتانی‌های ورزشی	ضد لغزش و سبک	خرید کنید	/products?cat=shoes	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-sky-900/80	3	t
12	کت و شلوار پسرانه	ست کامل رسمی	خرید کنید	/products?cat=boys&q=کت	https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000	from-slate-900/85	4	t
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_posts (id, title, slug, excerpt, content, image, tag, views, created_at) FROM stdin;
9	اصول انتخاب لباس مجلسی مناسب کودک برای مراسم رسمی	kids-formal-dress-guide	از انتخاب پارچه تا سایزبندی درست؛ هر آنچه قبل از خرید لباس مجلسی کودک باید بدانید.	انتخاب لباس مجلسی برای کودکان فقط مسئله ظاهر نیست؛ راحتی، جنس پارچه و دوخت تمیز اهمیت اصلی را دارد. پارچه‌های ویسکوز و پنبه مخلوط برای مهمانی‌های طولانی گزینه‌های بهتری هستند چون تنفس‌پذیرند و حساسیت ایجاد نمی‌کنند.\n\nهنگام خرید، یک سایز بالاتر انتخاب کنید چون کودکان به سرعت رشد می‌کنند و لباس نباید تنگ باشد. همچنین از یقه‌های سفت و دوخت‌های زبر که پوست گردن را می‌خراشد پرهیز کنید.\n\nدر پایان، حتماً رنگ و فرم را با موقعیت مراسم هماهنگ کنید؛ برای عصرها رنگ‌های تیره و برای روز رنگ‌های روشن و شاد مناسب‌ترند.	https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	راهنمای خرید	3421	2026-11-26 11:07:10.60582+00
10	چطور کفش استاندارد برای رشد پای کودک انتخاب کنیم؟	right-shoes-for-kids	پنج نکته طلایی برای انتخاب کفش سالم که قدم‌های اول را برای فرزندتان خاطره‌انگیز می‌کند.	پای کودک تا ۱۲ سالگی در حال رشد است و پای افزار نامناسب می‌تواند باعث مشکلات اسکلتی شود. پنجه کفش باید حداقل یک سانتی‌متر فضا داشته باشد و پاشنه بیش از دو سانتی‌متر نباشد.\n\nزیره EVA و EVA-Ruبری با انعطاف مناسب بهترین انتخاب است. کفشی که خم نمی‌شود، پای کودک را خسته می‌کند.\n\nخرید کفش ارتوپدی برای کودکان سالم ضروری نیست، اما در ناهنجاری‌های کف پا حتماً با پزشک ارتوپد مشورت کنید.	https://images.pexels.com/photos/30395128/pexels-photo-30395128.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	سلامت کودک	2874	2026-11-26 11:07:10.60582+00
11	ترندهای پاییز و زمستان مد کودک در سال ۲۰۲۶	fall-winter-2026-trends	از پالت رنگ‌های خاکی تا پارچه‌های بازیافتی؛ مهم‌ترین ترندهای امسال را بشناسید.	پالت رنگ فصل جاری بر پایه خاکی، کاراملی و سبز زیتونی با تأکید بر صورتی گردویی استوار است. برندهای مطرح دنیا به سمت پارچه‌های ارگانیک و بازیافتی رفته‌اند.\n\nکاپشن‌های اورسایز با جزئیات رفلکتور ایمنی و کت تک‌های اسپرت دوطرفه از پرفروش‌ترین آیتم‌های فصل هستند.\n\nدر ایران نیز استقبال از ست‌های خانوادگی و رنگ‌های خنثی با اکسسوری‌های رنگی چشمگیر افزایش یافته است.	https://images.pexels.com/photos/35607631/pexels-photo-35607631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	ترند مد	4102	2026-11-26 11:07:10.60582+00
12	لباس زمستانی گرم و ایمن؛ راهنمای مادران باهوش	winter-clothes-guide	لایه‌لایه بپوشانید، هوشمند خرید کنید؛ نکات ایمنی کاپشن و پالتو کودک.	قانون سه لایه بهترین راه برای گرم نگه‌داشتن کودک است: لایه اول حرارتی پنبه‌ای، لایه میانی پشمی یا فلانل و لایه بیرونی ضدآب و ضدباد.\n\nاز کلاه‌های بنددار بلند که خطر گره خوردن دارند پرهیز کنید و زیپ‌ها را با محافظ پارچه‌ای بپوشانید تا چانه کودک آسیب نبیند.\n\nکاپشن خیلی بزرگ هم به اندازه کاپشن تنگ خطرناک است؛ باد از زیر وارد می‌شود و کودک سردش می‌شود. اندازه بهتر، یک سایز بزرگ‌تر با کمرکشی است.	https://images.pexels.com/photos/19579097/pexels-photo-19579097.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	سبک زندگی	1953	2026-11-26 11:07:10.60582+00
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name, slug, logo, created_at) FROM stdin;
5	مینی‌مودا (برند اختصاصی)	minimoda		2026-11-26 11:07:13.045653+00
6	آروشا	arusha		2026-11-26 11:07:13.045653+00
7	پاپی‌فیت	papyfit		2026-11-26 11:07:13.045653+00
8	نساجی پارینه	parineh		2026-11-26 11:07:13.045653+00
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaigns (id, title, slug, description, banner_image, start_at, end_at, discount_code_id, active, created_at) FROM stdin;
4	جشنواره بهاره مینی‌مودا	spring-festival	تا ۶۰٪ تخفیف روی کالکشن جدید بهاره؛ پیراهن‌های مجلسی، کاپشن‌های سبک و ست‌های ملوانی.	https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1200	2026-11-16 11:07:13.038+00	2026-12-16 11:07:13.038+00	7	t	2026-11-26 11:07:13.041207+00
5	شروع سال تحصیلی	back-to-school	کتانی و ست‌های مدرسه با کد تخفیف خوش‌آمد؛ آماده‌سازی برای بازگشت به کلاس.	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1200	2026-12-01 11:07:13.038+00	2027-01-10 11:07:13.038+00	6	t	2026-11-26 11:07:13.041207+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, image, icon, sort_order, show_on_home) FROM stdin;
16	دخترانه	girls	پیراهن، سارافون و لباس‌های دخترانه	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Crown	1	t
17	پسرانه	boys	کت، شلوار و تیشرت‌های پسرانه	https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Shirt	2	t
18	بچگانه	kids	کاپشن و لباس‌های روزمره بچگانه	https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Sparkles	3	t
19	نوزاد	baby	سرهمی و لباس‌های نرم نوزاد	https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Baby	4	t
20	لباس مجلسی	formal	لباس‌های رسمی و مجلسی کودک	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Gem	5	t
21	کفش	shoes	کتانی، کفش اسپرت و مجلسی کودک	https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	Footprints	6	t
22	اکسسوری	accessories	کلاه، کیف و اکسسوری‌های کودک	https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	ShoppingBag	7	t
\.


--
-- Data for Name: code_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.code_history (id, key, content, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, contact, subject, body, read, created_at) FROM stdin;
6	مریم رضایی	09121234567	سوال درباره سایز	قد دخترم ۱۱۰ سانته؛ برای خرید کاپشن سایز ۶-۷ مناسب است یا ۸-۹؟	f	2026-11-26 11:07:12.159876+00
7	علی حسینی	ali@example.com	پیگیری سفارش	سفارش MM-00031 هنوز به دستم نرسیده ولی وضعیتش ارسال‌شده ثبت شده؛ لطفاً پیگیری کنید.	f	2026-11-26 11:07:12.159876+00
8	زهرا کاظمی	09351112233	درخواست تعویض سایز	یک ست ملوانی سایز ۸-۹ سفارش دادم ولی کوچک بود؛ امکان تعویض با سایز ۱۰-۱۱ هست؟	t	2026-11-26 11:07:12.159876+00
9	الهام نوری	09195556677	پیشنهاد همکاری	برای فروشگاه اینستاگرامی‌ام برای تأمین عمده ست‌های نوزادی قیمت عمده دارید؟	t	2026-11-26 11:07:12.159876+00
10	رضا توکلی	reza.t@example.com	فاکتور خرید	برای خرید شرکت‌مان فاکتور رسمی با کد اقتصادی نیاز داریم؛ چطور اقدام کنیم؟	f	2026-11-26 11:07:12.159876+00
\.


--
-- Data for Name: content_pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.content_pages (id, title, slug, body, updated_at) FROM stdin;
5	درباره مینی‌مودا	about	مینی‌مودا فروشگاه آنلاین تخصصی مد و پوشاک کودک و نوزاد است که از سال ۱۳۹۸ با هدف ارائه لباس‌های باکیفیت، اصل و خوش‌قیمت به خانواده‌های ایرانی آغاز به کار کرده است.\n\nما معتقدیم کودکان سزاوار بهترین‌ها هستند؛ به همین دلیل تمام محصولاتمان را از برندهای معتبر و کارگاه‌های باسابقه تهیه می‌کنیم، پیش از عرضه کیفیت هر کالا را بررسی می‌کنیم و با ضمانت اصالت و سلامت فیزیکی کالا به دست شما می‌رسانیم.\n\nتیم مینی‌مودا در تهران مستقر است و با پشتیبانی پاسخگو در تمام روزهای هفته همراه شماست.	2026-11-26 11:07:13.044338+00
6	قوانین و مقررات	terms	۱) تمامی محصولات مینی‌مودا دارای ضمانت اصالت کالا هستند.\n۲) سفارش‌های بالای ۲ میلیون تومان شامل ارسال رایگان می‌شوند.\n۳) تا ۷ روز پس از تحویل، امکان بازگشت کالا با ارائه فاکتور و برچسب سلامت وجود دارد.\n۴) در صورت مغایرت یا ایراد کالا، هزینه ارسال برگشت با فروشگاه است.\n۵) پرداخت آنلاین از طریق درگاه رسمی بانکی انجام می‌شود و هیچ اطلاعات کارتی ذخیره نمی‌گردد.	2026-11-26 11:07:13.044338+00
7	حریم خصوصی	privacy	اطلاعات شخصی شما (نام، موبایل، آدرس) صرفاً برای انجام سفارش و هماهنگی ارسال استفاده می‌شود و هرگز با اشخاص ثالث به اشتراک گذاشته نمی‌شود.\n\nرمز عبور حساب کاربری شما با الگوریتم‌های امن رمزنگاری می‌شود و هیچ‌کس — حتی مدیران فروشگاه — به آن دسترسی ندارد.\n\nدر صورت نیاز به تغییر یا حذف اطلاعات حساب، کافی است با پشتیبانی تماس بگیرید.	2026-11-26 11:07:13.044338+00
\.


--
-- Data for Name: discount_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discount_codes (id, code, type, value, min_order, max_uses, used_count, expires_at, active, created_at) FROM stdin;
6	WELCOME10	percent	10	0	500	128	2027-02-24 11:07:12.152+00	t	2026-11-26 11:07:12.155048+00
7	NOROOZ25	percent	25	3000000	200	74	2026-12-26 11:07:12.152+00	t	2026-11-26 11:07:12.155048+00
8	SHIPFREE	fixed	45000	0	1000	342	\N	t	2026-11-26 11:07:12.155048+00
9	KIDS20	percent	20	1500000	150	150	2026-11-21 11:07:12.152+00	f	2026-11-26 11:07:12.155048+00
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
-- Data for Name: layout_presets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.layout_presets (id, name, description, snapshot, created_by, created_at) FROM stdin;
1	فروشگاهی کامل (پیش‌فرض)	همه بخش‌ها فعال — مناسب ویترین پر	{"sections":[{"id":"hero","enabled":true,"sort":1},{"id":"categories","enabled":true,"sort":2},{"id":"banners","enabled":true,"sort":3},{"id":"trust","enabled":true,"sort":4},{"id":"festival","enabled":true,"sort":5},{"id":"blog","enabled":true,"sort":6},{"id":"products","enabled":true,"sort":7},{"id":"duo","enabled":true,"sort":8}],"tokens":{"primary":"#1b3a6b","accent":"#e91e63","gold":"#ffc107","radius":"20"}}	system	2026-11-26 11:07:13.924715+00
2	مینیمال سریع	فقط هیرو، دسته‌ها و محصولات — بارگذاری سریع‌تر	{"sections":[{"id":"hero","enabled":true,"sort":1},{"id":"categories","enabled":true,"sort":2},{"id":"banners","enabled":false,"sort":3},{"id":"trust","enabled":false,"sort":4},{"id":"festival","enabled":false,"sort":5},{"id":"blog","enabled":false,"sort":6},{"id":"products","enabled":true,"sort":7},{"id":"duo","enabled":false,"sort":8}],"tokens":{"primary":"#334155","accent":"#0f766e","gold":"#a3e635","radius":"12"}}	system	2026-11-26 11:07:13.924715+00
3	کمپین و حراج	تمرکز روی بنرها و جشنواره	{"sections":[{"id":"hero","enabled":true,"sort":1},{"id":"categories","enabled":false,"sort":2},{"id":"banners","enabled":true,"sort":3},{"id":"trust","enabled":false,"sort":4},{"id":"festival","enabled":true,"sort":5},{"id":"blog","enabled":false,"sort":6},{"id":"products","enabled":true,"sort":7},{"id":"duo","enabled":true,"sort":8}],"tokens":{"primary":"#4a1042","accent":"#e11d48","gold":"#fbbf24","radius":"22"}}	system	2026-11-26 11:07:13.924715+00
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menu_items (id, location, label, href, parent_id, sort, enabled, highlight) FROM stdin;
1	main	خانه	/	\N	1	t	t
2	main	بچگانه	/products?cat=kids	\N	2	t	f
3	main	کودکان	/products?cat=boys	\N	3	t	f
4	main	نوزاد	/products?cat=baby	\N	4	t	f
5	main	پسرانه	/products?cat=boys	\N	5	t	f
6	main	دخترانه	/products?cat=girls	\N	6	t	f
7	main	لباس مجلسی	/products?cat=formal	\N	7	t	f
8	main	کفش	/products?cat=shoes	\N	8	t	f
9	main	تماس با ما	/help#contact	\N	9	t	f
10	main	کت و شلوار	/products?cat=boys&q=کت	5	1	t	f
11	main	تیشرت	/products?cat=boys&q=تیشرت	5	2	t	f
12	main	رسمی و مجلسی	/products?cat=boys	5	3	t	f
13	main	پیراهن مجلسی	/products?cat=girls&q=پیراهن	6	1	t	f
14	main	سارافون و ست	/products?cat=formal	6	2	t	f
15	main	لباس روزمره	/products?cat=girls	6	3	t	f
16	footer_quick	محصولات پرفروش	/products?sort=sales	\N	1	t	f
17	footer_quick	تخفیف‌های ویژه	/products?offer=1	\N	2	t	f
18	footer_quick	مجله مد	/blog	\N	3	t	f
19	footer_quick	لباس مجلسی	/products?cat=formal	\N	4	t	f
20	footer_quick	کفش و کتانی	/products?cat=shoes	\N	5	t	f
21	footer_quick	نوزاد	/products?cat=baby	\N	6	t	f
22	footer_service	راهنمای خرید	/help#delivery	\N	1	t	f
23	footer_service	شیوه‌های ارسال	/help#delivery	\N	2	t	f
24	footer_service	پیگیری سفارش	/orders	\N	3	t	f
25	footer_service	سوالات متداول	/help#faq	\N	4	t	f
26	footer_service	ضمانت بازگشت کالا	/help#return	\N	5	t	f
27	footer_service	تماس با ما	/help#contact	\N	6	t	f
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
7	success	به پنل مدیریت قالب خوش آمدید	از این پس می‌توانید رنگ‌ها، فونت، بنرها و اجزای صفحه اصلی را از همین‌جا مدیریت کنید.	f	2026-11-26 11:07:11.373937+00
8	warning	نسخه جدید قالب در دسترس است	نسخه 1.5.0 قالب «مینی‌مودا کلاسیک» با بهبود سرعت لود و پشتیبانی از فونت نستعلیق منتشر شد. برای به‌روزرسانی به تب «مدیریت قالب‌ها» بروید.	f	2026-11-26 11:07:11.373937+00
9	security	توصیه امنیتی	رمز مدیر را به‌صورت دوره‌ای تغییر دهید و نشست‌های قدیمی را از بخش «امنیت و نشست‌ها» باطل کنید.	f	2026-11-26 11:07:11.373937+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, name, image, price, quantity, size, color) FROM stdin;
93	50	38	پیراهن مجلسی سلطنتی صورتی آرگونا	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	3890000	1	6-7	صورتی
94	50	44	تیشرت اسپرت پسرانه طرح رِد وال	https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	390000	1	6-7	زرشکی
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, total, status, customer_name, phone, address, note, payment_method, created_at) FROM stdin;
50	6	4280000	delivered	سارا محمدی	09121234567	تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴	لطفاً قبل از ارسال هماهنگ کنید.	online	2026-11-26 11:07:10.603177+00
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, product_id, size, stock, sku, created_at) FROM stdin;
70	38	4-5	8	MM-38-45	2026-11-26 11:07:12.164738+00
71	38	6-7	7	MM-38-67	2026-11-26 11:07:12.165807+00
72	38	8-9	6	MM-38-89	2026-11-26 11:07:12.166607+00
73	38	10-11	4	MM-38-1011	2026-11-26 11:07:12.167456+00
74	39	3-4	8	MM-39-34	2026-11-26 11:07:12.168326+00
75	39	5-6	11	MM-39-56	2026-11-26 11:07:12.169059+00
76	39	7-8	4	MM-39-78	2026-11-26 11:07:12.16978+00
77	39	9-10	10	MM-39-910	2026-11-26 11:07:12.170401+00
78	40	3-4	5	MM-40-34	2026-11-26 11:07:12.171012+00
79	40	5-6	7	MM-40-56	2026-11-26 11:07:12.171773+00
80	40	7-8	5	MM-40-78	2026-11-26 11:07:12.172392+00
81	41	5-6	5	MM-41-56	2026-11-26 11:07:12.173135+00
82	41	7-8	2	MM-41-78	2026-11-26 11:07:12.174055+00
83	41	9-10	3	MM-41-910	2026-11-26 11:07:12.174997+00
84	41	11-12	3	MM-41-1112	2026-11-26 11:07:12.176066+00
85	42	4-5	7	MM-42-45	2026-11-26 11:07:12.177115+00
86	42	6-7	6	MM-42-67	2026-11-26 11:07:12.177953+00
87	42	8-9	7	MM-42-89	2026-11-26 11:07:12.178821+00
88	42	10-11	10	MM-42-1011	2026-11-26 11:07:12.179615+00
89	43	4-5	3	MM-43-45	2026-11-26 11:07:12.180416+00
90	43	6-7	6	MM-43-67	2026-11-26 11:07:12.181168+00
91	43	8-9	4	MM-43-89	2026-11-26 11:07:12.18184+00
92	44	4-5	28	MM-44-45	2026-11-26 11:07:12.182634+00
93	44	6-7	18	MM-44-67	2026-11-26 11:07:12.183323+00
94	44	8-9	22	MM-44-89	2026-11-26 11:07:12.184323+00
95	44	10-11	26	MM-44-1011	2026-11-26 11:07:12.185081+00
96	44	12-13	19	MM-44-1213	2026-11-26 11:07:12.185842+00
97	45	3-4	9	MM-45-34	2026-11-26 11:07:12.186527+00
98	45	5-6	10	MM-45-56	2026-11-26 11:07:12.187513+00
99	45	7-8	7	MM-45-78	2026-11-26 11:07:12.188264+00
100	45	9-10	8	MM-45-910	2026-11-26 11:07:12.188956+00
101	46	2-3	6	MM-46-23	2026-11-26 11:07:12.189684+00
102	46	4-5	5	MM-46-45	2026-11-26 11:07:12.190442+00
103	46	6-7	9	MM-46-67	2026-11-26 11:07:12.191178+00
104	46	8-9	12	MM-46-89	2026-11-26 11:07:12.191963+00
105	47	2-3	19	MM-47-23	2026-11-26 11:07:12.192766+00
106	47	4-5	12	MM-47-45	2026-11-26 11:07:12.193439+00
107	47	6-7	13	MM-47-67	2026-11-26 11:07:12.194298+00
108	47	8-9	7	MM-47-89	2026-11-26 11:07:12.195142+00
109	48	0-6m	17	MM-48-06m	2026-11-26 11:07:12.196072+00
110	48	6-12m	15	MM-48-612m	2026-11-26 11:07:12.196983+00
111	48	12-24m	13	MM-48-1224m	2026-11-26 11:07:12.197842+00
112	49	3-4	21	MM-49-34	2026-11-26 11:07:12.198755+00
113	49	5-6	25	MM-49-56	2026-11-26 11:07:12.199803+00
114	49	7-8	8	MM-49-78	2026-11-26 11:07:12.200684+00
115	49	9-10	10	MM-49-910	2026-11-26 11:07:12.20146+00
116	50	4-5	4	MM-50-45	2026-11-26 11:07:12.202255+00
117	50	6-7	4	MM-50-67	2026-11-26 11:07:12.202997+00
118	50	8-9	4	MM-50-89	2026-11-26 11:07:12.203839+00
119	51	28	28	MM-51-28	2026-11-26 11:07:12.204565+00
120	51	30	23	MM-51-30	2026-11-26 11:07:12.205152+00
121	51	32	12	MM-51-32	2026-11-26 11:07:12.205914+00
122	51	34	20	MM-51-34	2026-11-26 11:07:12.206915+00
123	51	36	17	MM-51-36	2026-11-26 11:07:12.207895+00
124	52	17	20	MM-52-17	2026-11-26 11:07:12.209118+00
125	52	18	23	MM-52-18	2026-11-26 11:07:12.210275+00
126	52	19	31	MM-52-19	2026-11-26 11:07:12.211443+00
127	52	20	22	MM-52-20	2026-11-26 11:07:12.212348+00
128	53	25	13	MM-53-25	2026-11-26 11:07:12.21315+00
129	53	27	15	MM-53-27	2026-11-26 11:07:12.214038+00
130	53	29	17	MM-53-29	2026-11-26 11:07:12.215617+00
131	53	31	17	MM-53-31	2026-11-26 11:07:12.216781+00
132	53	33	17	MM-53-33	2026-11-26 11:07:12.217603+00
133	54	4-5	19	MM-54-45	2026-11-26 11:07:12.21839+00
134	54	6-7	22	MM-54-67	2026-11-26 11:07:12.219199+00
135	54	8-9	11	MM-54-89	2026-11-26 11:07:12.220091+00
136	54	10-11	21	MM-54-1011	2026-11-26 11:07:12.220868+00
137	55	6-12m	6	MM-55-612m	2026-11-26 11:07:12.221654+00
138	55	12-24m	4	MM-55-1224m	2026-11-26 11:07:12.222354+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, slug, description, price, discount_price, category_id, stock, sizes, colors, images, rating, review_count, sales_count, is_new, is_featured, is_offer, created_at) FROM stdin;
38	پیراهن مجلسی سلطنتی صورتی آرگونا	royal-pink-gown	پیراهن مجلسی دخترانه از پارچه ابریشم و تور فرانسوی با گلدوزی دستی، مناسب مراسم رسمی و تولد. آستر لطیف و سازگار با پوست حساس کودک دارد.	4850000	3890000	20	32	["4-5","6-7","8-9","10-11"]	[{"name":"صورتی","hex":"#f2a7c3"},{"name":"بژ","hex":"#e6d3b8"}]	["https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	128	542	t	t	t	2026-11-26 11:07:10.598698+00
39	سارافون گلدار وینتاج رزالی	vintage-floral-pinafore	سارافون گلدار با الگوی کلاسیک وینتاج، دوخت فرانسوی با پشت بندهای قابل تنظیم؛ همراه با پیراهن سفید حریر هدیه‌ای.	3200000	\N	20	41	["3-4","5-6","7-8","9-10"]	[{"name":"گلدار کرمی","hex":"#d9c6a5"}]	["https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	96	388	t	t	f	2026-11-26 11:07:10.598698+00
40	پیراهن سفید مهمانی ملکه بالن‌ها	balloon-queen-white-dress	پیراهن سفید کوتاه آستین‌بالنی با دامن پفی لایه‌لایه؛ انتخابی رویایی برای مهمانی‌ها. زیور کفش و تل رایگان داخل بسته ارسال می‌شود.	5600000	4480000	20	25	["3-4","5-6","7-8"]	[{"name":"سفید","hex":"#ffffff"}]	["https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	5	74	260	f	t	t	2026-11-26 11:07:10.598698+00
41	کت و شلوار رسمی مشکی پسرانه آرش	arash-black-suit	کت و شلوار دو دکمه از پارچه فاستونی ایتالیایی با پنج‌جیب دوزی اصیل، کراوات هدیه؛ مناسب مراسم عقد، تولد و عکاسی رسمی.	6150000	\N	17	28	["5-6","7-8","9-10","11-12"]	[{"name":"مشکی","hex":"#1c1c1e"}]	["https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	152	471	f	t	f	2026-11-26 11:07:10.598698+00
42	کت تک سرمه‌ای پسرانه با اسلش جین	navy-blazer-boy	کت تک اسپرت سرمه‌ای با یقه آرگونا و دکمه‌های طلایی؛ قابل ست شدن با جین و کتان. داخل آستر نخی ضد حساسیت دارد.	3890000	\N	17	36	["4-5","6-7","8-9","10-11"]	[{"name":"سرمه‌ای","hex":"#22344f"}]	["https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.7	88	342	f	f	f	2026-11-26 11:07:10.598698+00
43	ست کت و شلوار پاپیون‌دار پسرانه بارون	baron-bowtie-suit	ست سه تیکه کت، شلوار و پاپیون قرمز طرح چهارخانه؛ طراحی اروپایی با دوختی لطیف برای مهمانی‌های رسمی کودک.	5280000	4590000	17	22	["4-5","6-7","8-9"]	[{"name":"مشکی","hex":"#1c1c1e"}]	["https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	64	215	t	f	t	2026-11-26 11:07:10.598698+00
44	تیشرت اسپرت پسرانه طرح رِد وال	redwall-sport-tee	تیشرت پنبه‌ای ۱۰۰٪ با چاپ مقاوم و دوردوزی شده؛ خنک، لطیف و مناسب استفاده روزمره و ورزش.	890000	690000	17	120	["4-5","6-7","8-9","10-11","12-13"]	[{"name":"زرشکی","hex":"#a93226"},{"name":"آبی","hex":"#2e6da4"}]	["https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.6	210	830	t	f	t	2026-11-26 11:07:10.598698+00
45	کاپشن صورتی کلاسیک بچگانه هاوانا	havana-pink-coat	کاپشن زمستانی با عایق پر طبیعی، ضد آب و ضد باد؛ مناسب روزهای سرد پاییز و زمستان. داخل با پشم مرینو آستر شده است.	2750000	\N	18	47	["3-4","5-6","7-8","9-10"]	[{"name":"صورتی","hex":"#f4a7b9"},{"name":"قرمز","hex":"#d94f4f"}]	["https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	167	689	f	t	f	2026-11-26 11:07:10.598698+00
46	کاپشن قرمز ورزشی دخترانه پیک	red-parka-girl	کاپشن اسپرت قرمز با کلاه خزدار جداشونده؛ سبک و گرم با زیپ فلزی ضدزنگ. مناسب بازی در فضای باز و برف.	2350000	1980000	18	58	["2-3","4-5","6-7","8-9"]	[{"name":"قرمز","hex":"#d43a3a"}]	["https://images.pexels.com/photos/11111822/pexels-photo-11111822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.7	134	512	t	t	t	2026-11-26 11:07:10.598698+00
47	کاپشن نارنجی ماجراجو بچگانه اکسپلورر	explorer-orange-jacket	کاپشن فلوئورسنت نارنجی با رفلکتور ایمنی در تاریکی؛ انتخابی عالی برای کودکان پرانرژی. جیب‌های زیپ‌دار و ضد آب.	2600000	\N	18	64	["2-3","4-5","6-7","8-9"]	[{"name":"نارنجی","hex":"#e2703a"}]	["https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.5	91	296	f	f	f	2026-11-26 11:07:10.598698+00
48	پالتو صورتی نوزاد زمستانی بیبی‌رز	baby-rose-winter-coat	پالتو پشمی نوزاد با کلاه گوش‌دار و دستکش دو دکمه؛ از پارچه نرم ضدحساسیت با آستر فلانل. مناسب ۰ تا ۲۴ ماه.	1980000	\N	19	73	["0-6m","6-12m","12-24m"]	[{"name":"صورتی","hex":"#f7c6d0"}]	["https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	143	604	t	t	f	2026-11-26 11:07:10.598698+00
49	پیراهن آبی استودیو دخترانه آرمیتا	armita-blue-dress	پیراهن آبی کاربنی با پایه‌ی ویسکوز لطیف و کمر کشی؛ مناسب مهمانی و عکاسی. دوخت دقیق و رنگ ثابت در شستشو.	1450000	\N	16	85	["3-4","5-6","7-8","9-10"]	[{"name":"آبی","hex":"#4a6fa5"}]	["https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.6	112	458	t	f	f	2026-11-26 11:07:10.598698+00
50	پیراهن سفید تور و پاپیون دخترانه رها	raha-tulle-dress	پیراهن مجلسی لایه‌ای با تور فرانسوی و پاپیون مخملی؛ با پاپیون یدکی اضافه. مناسب مراسم رسمی و عکاسی تولد.	4950000	3960000	16	29	["4-5","6-7","8-9"]	[{"name":"سفید","hex":"#ffffff"},{"name":"زرشکی","hex":"#8e2a3c"}]	["https://images.pexels.com/photos/14897706/pexels-photo-14897706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	79	238	f	f	t	2026-11-26 11:07:10.598698+00
51	کفش ورزشی خاکستری سامیکس رانر	samix-gray-runner	کفش ورزشی با زیره EVA سبک و انعطاف‌پذیر؛ تهویه عالی و پنجه پهن مناسب رشد طبیعی پا. در سه سایز رنگ‌بندی.	1740000	\N	21	95	["28","30","32","34","36"]	[{"name":"خاکستری","hex":"#8a8d91"}]	["https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.7	189	720	f	f	f	2026-11-26 11:07:10.598698+00
52	کتانی قرمز نوزاد پاپی‌فیت	papy-fit-red-sneaker	کتانی نوزادی با زیره نرم ابری و چسبک قابل تنظیم؛ اولین کفش ایده‌آل برای نوزادان در حال راه‌افتادن.	950000	790000	21	110	["17","18","19","20"]	[{"name":"قرمز","hex":"#c0392b"}]	["https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	156	815	f	f	t	2026-11-26 11:07:10.598698+00
53	کتانی سفید مینی رانر سفید استار	mini-star-white-sneaker	کتانی سفید تمام‌چرم با دوخت دودوزی و زیره لاستیکی ضد لغزش؛ مناسب مدرسه و روزمره. همراه با بند اضافه هدیه.	1290000	\N	21	78	["25","27","29","31","33"]	[{"name":"سفید","hex":"#ffffff"}]	["https://images.pexels.com/photos/5275386/pexels-photo-5275386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.5	121	540	t	t	f	2026-11-26 11:07:10.598698+00
54	ست نامیکی دو تیکه بچگانه مارین	marine-nautical-set	ست دو تیکه بلوز راه‌راه ملوانی و شلوارک کتان؛ پارچه خنک تابستانی با دوخت تقویت‌شده. مناسب ست دونفره.	1680000	\N	18	88	["4-5","6-7","8-9","10-11"]	[{"name":"سرمه‌ای-سفید","hex":"#22344f"}]	["https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.8	148	633	f	t	f	2026-11-26 11:07:10.598698+00
55	پیراهن تور عاجی نوزاد پرنسس آوا	ava-ivory-tulle	پیراهن بلند تور عاجی با سنگ‌دوزی ظریف و تل پاپیون هدیه؛ انتخابی رویایی برای عکاسی و جشن‌های نوزادی.	3350000	2680000	19	34	["6-12m","12-24m"]	[{"name":"عاجی","hex":"#efe6d8"}]	["https://images.pexels.com/photos/29610395/pexels-photo-29610395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]	4.9	87	265	t	f	t	2026-11-26 11:07:10.598698+00
\.


--
-- Data for Name: returns_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.returns_requests (id, order_id, type, reason, status, note, created_at) FROM stdin;
3	50	exchange	سایز کوچک بود	requested	تعویض با سایز بالاتر	2026-11-26 11:07:12.22829+00
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, user_id, author_name, rating, comment, created_at) FROM stdin;
14	38	6	سارا محمدی	5	پارچه و دوخت فوق‌العاده بود، دخترم عاشق پیراهن شد. بسته‌بندی هم عالی بود.	2026-11-26 11:07:10.601748+00
15	38	\N	مریم کاظمی	5	دقیقاً مثل عکس‌هاست؛ گلدوزی‌ها خیلی تمیز کار شده.	2026-11-26 11:07:10.601748+00
16	41	6	سارا محمدی	5	برای عکاسی رسمی پسرم گرفتم؛ همه از شدت خوش‌تیپی تعجب کردند!	2026-11-26 11:07:10.601748+00
17	41	\N	رضا توکلی	4	کیفیت خوب، فقط کمی دم‌پا بلند بود که خیاط کوتاه کرد.	2026-11-26 11:07:10.601748+00
18	45	\N	لیلا احمدی	5	خیلی گرم و سبک است، برای برف کاملاً مناسبه.	2026-11-26 11:07:10.601748+00
19	52	\N	الهه نوری	5	اولین کفش پسرم؛ زیره‌اش واقعاً نرمه و پای بچه رو اذیت نمی‌کنه.	2026-11-26 11:07:10.601748+00
\.


--
-- Data for Name: revisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.revisions (id, label, snapshot, created_by, created_at) FROM stdin;
1	پشتیبان تست نهایی	{"version":1,"takenAt":"2026-11-24T21:15:28.625Z","settings":[{"key":"store.name","value":"مینی‌مودا"},{"key":"store.tagline","value":"مد و پوشاک کودک و نوزاد"},{"key":"announcement.enabled","value":"true"},{"key":"announcement.text","value":"ارسال رایگان سفارش‌های بالای ۲,۰۰۰,۰۰۰ تومان + ۷ روز ضمانت بازگشت کالا"},{"key":"announcement.tone","value":"gold"},{"key":"free_shipping_at","value":"2000000"},{"key":"maintenance.enabled","value":"false"},{"key":"maintenance.message","value":"سایت به‌طور موقت در حال به‌روزرسانی است؛ تا لحظاتی دیگر بازمی‌گردیم."},{"key":"layout.products","value":"grid"},{"key":"home.hero_compact","value":"false"},{"key":"responsive.cat_row_mobile","value":"true"},{"key":"custom.css","value":""},{"key":"custom.js","value":""},{"key":"custom.head","value":""},{"key":"seo.title_suffix","value":"| مینی‌مودا"},{"key":"seo.og_image","value":"/images/hero-royal-junior.jpg"},{"key":"theme.primary","value":"#4a1042"},{"key":"theme.accent","value":"#e11d48"},{"key":"theme.gold","value":"#fbbf24"},{"key":"theme.font","value":"Estedad"},{"key":"theme.radius","value":"22"}],"themes":[{"slug":"minimoda-classic","isActive":false,"isDefault":true,"tokens":"{\\"primary\\":\\"#14264a\\",\\"accent\\":\\"#db2777\\",\\"gold\\":\\"#f2b33d\\",\\"font\\":\\"Vazirmatn\\",\\"radius\\":\\"18\\"}","version":"1.4.0"},{"slug":"minimal-modern","isActive":false,"isDefault":false,"tokens":"{\\"primary\\":\\"#334155\\",\\"accent\\":\\"#0f766e\\",\\"gold\\":\\"#a3e635\\",\\"font\\":\\"Noto Kufi Arabic\\",\\"radius\\":\\"12\\"}","version":"1.1.0"},{"slug":"royal-junior-theme","isActive":true,"isDefault":true,"tokens":"{\\"primary\\":\\"#4a1042\\",\\"accent\\":\\"#e11d48\\",\\"gold\\":\\"#fbbf24\\",\\"font\\":\\"Estedad\\",\\"radius\\":\\"22\\"}","version":"2.0.0"}],"sections":[{"id":"hero","enabled":true,"sort":1},{"id":"categories","enabled":true,"sort":2},{"id":"banners","enabled":true,"sort":3},{"id":"trust","enabled":true,"sort":4},{"id":"festival","enabled":true,"sort":5},{"id":"products","enabled":true,"sort":7},{"id":"duo","enabled":true,"sort":8},{"id":"blog","enabled":true,"sort":6}],"banners":[{"title":"کاپشن‌های زمستانی","subtitle":"تا ۳۰٪ تخفیف","cta":"خرید کنید","href":"/products?cat=kids&q=کاپشن","image":"https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-rose-900/80","sort":1,"active":true},{"title":"پیراهن‌های مجلسی","subtitle":"کالکشن سلطنتی","cta":"خرید کنید","href":"/products?cat=formal","image":"https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-purple-900/80","sort":2,"active":true},{"title":"کتانی‌های ورزشی","subtitle":"ضد لغزش و سبک","cta":"خرید کنید","href":"/products?cat=shoes","image":"https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-sky-900/80","sort":3,"active":true},{"title":"کت و شلوار پسرانه","subtitle":"ست کامل رسمی","cta":"خرید کنید","href":"/products?cat=boys&q=کت","image":"https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-slate-900/85","sort":4,"active":true}]}	مدیر فروشگاه	2026-11-24 21:15:28.626454+00
2	پشتیبان مقایسه‌ای	{"version":1,"takenAt":"2026-11-26T10:53:19.736Z","settings":[{"key":"store.name","value":"مینی‌مودا"},{"key":"store.tagline","value":"مد و پوشاک کودک و نوزاد"},{"key":"announcement.enabled","value":"true"},{"key":"announcement.tone","value":"gold"},{"key":"free_shipping_at","value":"2000000"},{"key":"maintenance.enabled","value":"false"},{"key":"maintenance.message","value":"سایت به‌طور موقت در حال به‌روزرسانی است؛ تا لحظاتی دیگر بازمی‌گردیم."},{"key":"layout.products","value":"grid"},{"key":"home.hero_compact","value":"false"},{"key":"responsive.cat_row_mobile","value":"true"},{"key":"theme.font","value":"Vazirmatn"},{"key":"custom.css","value":""},{"key":"custom.js","value":""},{"key":"custom.head","value":""},{"key":"seo.title_suffix","value":"| مینی‌مودا"},{"key":"seo.og_image","value":"/images/hero-royal-junior.jpg"},{"key":"home.categories_enabled","value":"true"},{"key":"home.categories_rows","value":"1"},{"key":"theme.primary","value":"#1b3a6b"},{"key":"theme.accent","value":"#e91e63"},{"key":"theme.gold","value":"#ffc107"},{"key":"theme.radius","value":"20"},{"key":"announcement.text","value":"تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی"}],"themes":[{"slug":"royal-junior-theme","isActive":false,"isDefault":false,"tokens":"{\\"primary\\":\\"#4a1042\\",\\"accent\\":\\"#e11d48\\",\\"gold\\":\\"#fbbf24\\",\\"font\\":\\"Estedad\\",\\"radius\\":\\"22\\"}","version":"2.0.0"},{"slug":"minimal-modern","isActive":false,"isDefault":false,"tokens":"{\\"primary\\":\\"#334155\\",\\"accent\\":\\"#0f766e\\",\\"gold\\":\\"#a3e635\\",\\"font\\":\\"Noto Kufi Arabic\\",\\"radius\\":\\"12\\"}","version":"1.1.0"},{"slug":"minimoda-classic","isActive":true,"isDefault":true,"tokens":"{\\"primary\\":\\"#1b3a6b\\",\\"accent\\":\\"#e91e63\\",\\"gold\\":\\"#ffc107\\",\\"font\\":\\"Vazirmatn\\",\\"radius\\":\\"20\\"}","version":"1.4.0"},{"slug":"zip-theme-mwxfp7zi","isActive":false,"isDefault":false,"tokens":"{\\"primary\\":\\"#14532d\\",\\"accent\\":\\"#f97316\\",\\"gold\\":\\"#fde047\\",\\"font\\":\\"Vazirmatn\\",\\"radius\\":\\"16\\"}","version":"1.2.0"}],"sections":[{"id":"hero","enabled":true,"sort":1},{"id":"categories","enabled":true,"sort":2},{"id":"banners","enabled":true,"sort":3},{"id":"trust","enabled":true,"sort":4},{"id":"festival","enabled":true,"sort":5},{"id":"blog","enabled":true,"sort":6},{"id":"products","enabled":true,"sort":7},{"id":"duo","enabled":true,"sort":8}],"banners":[{"title":"کاپشن‌های زمستانی","subtitle":"تا ۳۰٪ تخفیف","cta":"خرید کنید","href":"/products?cat=kids&q=کاپشن","image":"https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-rose-900/80","sort":1,"active":true},{"title":"پیراهن‌های مجلسی","subtitle":"کالکشن سلطنتی","cta":"خرید کنید","href":"/products?cat=formal","image":"https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-purple-900/80","sort":2,"active":true},{"title":"کتانی‌های ورزشی","subtitle":"ضد لغزش و سبک","cta":"خرید کنید","href":"/products?cat=shoes","image":"https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-sky-900/80","sort":3,"active":true},{"title":"کت و شلوار پسرانه","subtitle":"ست کامل رسمی","cta":"خرید کنید","href":"/products?cat=boys&q=کت","image":"https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000","tone":"from-slate-900/85","sort":4,"active":true}]}	مدیر فروشگاه	2026-11-26 10:53:19.737255+00
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, token, user_id, expires_at) FROM stdin;
47	106c86d8d90241bf896d7482af93ccae6478c193524ead9251d79e44c104a80e	5	2026-12-26 11:08:01.011+00
\.


--
-- Data for Name: shipping_methods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_methods (id, name, cost, free_over, eta_days, active, sort, created_at) FROM stdin;
5	پیک اختصاصی (تهران و کرج)	35000	2000000	1	t	1	2026-11-26 11:07:12.158266+00
6	تیپاکس	45000	2000000	2	t	2	2026-11-26 11:07:12.158266+00
7	پست پیشتاز	38000	2000000	3	t	3	2026-11-26 11:07:12.158266+00
8	باربری (سفارش‌های عمده)	250000	0	4	t	4	2026-11-26 11:07:12.158266+00
\.


--
-- Data for Name: size_charts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.size_charts (id, name, rows, active, created_at) FROM stdin;
3	جدول سایزبندی کودک (۲ تا ۱۱ سال)	[{"size":"2-3","height":"92-98","chest":"56-58","waist":"50-52"},{"size":"4-5","height":"104-110","chest":"60-62","waist":"54-56"},{"size":"6-7","height":"116-122","chest":"64-66","waist":"58-60"},{"size":"8-9","height":"128-134","chest":"68-70","waist":"62-64"},{"size":"10-11","height":"140-146","chest":"72-74","waist":"66-68"}]	t	2026-11-26 11:07:13.043179+00
4	جدول سایزبندی نوزاد (۰ تا ۲۴ ماه)	[{"size":"0-6m","height":"62-68","chest":"44-46","waist":"42-44"},{"size":"6-12m","height":"74-80","chest":"48-50","waist":"46-48"},{"size":"12-24m","height":"86-92","chest":"52-54","waist":"50-52"}]	t	2026-11-26 11:07:13.043179+00
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_movements (id, product_id, delta, reason, note, created_at) FROM stdin;
11	38	50	ورود از تأمین‌کننده	محموله نساجی پارینه یزد — فاکتور پ-1405-021	2026-11-26 11:07:12.223688+00
12	41	30	ورود از تأمین‌کننده	محموله آروشا — ست رسمی پسرانه	2026-11-26 11:07:12.223688+00
13	44	-12	فروش	خروج خودکار از سفارش‌های وب	2026-11-26 11:07:12.223688+00
14	45	-5	مرجوعی مشتری	مرجوع شد — سالم؛ بازگشت به انبار	2026-11-26 11:07:12.223688+00
15	39	20	اصلاح موجودی	شمارش دوره‌ای انبار — مغایرت +۲۰	2026-11-26 11:07:12.223688+00
16	\N	0	شمارش دوره‌ای	انبارگردانی فصلی با دقت ۹۸٪ انجام شد	2026-11-26 11:07:12.223688+00
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (id, name, contact_person, phone, address, notes, created_at) FROM stdin;
4	نساجی پارینه یزد	مهندس شریفی	09132567890	یزد، شهرک صنعتی جهان‌آباد	پارچه‌های پنبه‌ای و فلانل — تحویل هفتگی	2026-11-26 11:07:12.156669+00
5	پوشاک کودک آروشا	خانم رحیمی	02144556677	تهران، شهرک صنعتی شمس‌آباد	کالکشن‌های مجلسی؛ ۱۵ روز تسویه	2026-11-26 11:07:12.156669+00
6	کفش پاپی‌فیت	آقا توکلی	03133445566	اصفهان، خیابان شیخ بهایی	زیره EVA اختصاصی — MOQ هر سایز ۱۰۰ جفت	2026-11-26 11:07:12.156669+00
\.


--
-- Data for Name: theme_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.theme_settings (key, value, label, "group", updated_at, updated_by) FROM stdin;
store.name	مینی‌مودا	نام فروشگاه	general	2026-11-26 11:07:11.366386+00	seed
store.tagline	مد و پوشاک کودک و نوزاد	شعار/توضیح کوتاه	general	2026-11-26 11:07:11.366386+00	seed
announcement.enabled	true	نوار اطلاع‌رسانی فعال باشد	announcement	2026-11-26 11:07:11.366386+00	seed
announcement.text	تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی	متن نوار اطلاع‌رسانی	announcement	2026-11-26 11:07:11.366386+00	seed
announcement.tone	gold	رنگ نوار (gold | pink | navy)	announcement	2026-11-26 11:07:11.366386+00	seed
free_shipping_at	2000000	آستانه ارسال رایگان (تومان)	commerce	2026-11-26 11:07:11.366386+00	seed
maintenance.enabled	false	حالت تعمیر (فقط مدیران وارد شوند)	commerce	2026-11-26 11:07:11.366386+00	seed
maintenance.message	سایت به‌طور موقت در حال به‌روزرسانی است؛ تا لحظاتی دیگر بازمی‌گردیم.	پیام حالت تعمیر	commerce	2026-11-26 11:07:11.366386+00	seed
layout.products	grid	چیدمان لیست محصولات (grid | list)	layout	2026-11-26 11:07:11.366386+00	seed
home.hero_compact	false	هیرو فشرده در صفحه اصلی	layout	2026-11-26 11:07:11.366386+00	seed
responsive.cat_row_mobile	true	نمایش آیکن‌های دسته‌بندی در موبایل	layout	2026-11-26 11:07:11.366386+00	seed
home.categories_enabled	true	نمایش بخش دسته‌بندی‌های محبوب در سایت	home	2026-11-26 11:07:11.366386+00	seed
home.categories_rows	1	تعداد ردیف‌های نمایش دسته‌بندی‌های محبوب (۱ تا ۳)	home	2026-11-26 11:07:11.366386+00	seed
theme.primary	#1b3a6b	رنگ اصلی قالب	design	2026-11-26 11:07:11.366386+00	seed
theme.accent	#e91e63	رنگ تأکیدی (دکمه‌ها)	design	2026-11-26 11:07:11.366386+00	seed
theme.gold	#ffc107	رنگ طلایی (هایلایت)	design	2026-11-26 11:07:11.366386+00	seed
theme.font	Vazirmatn	فونت بدنه	design	2026-11-26 11:07:11.366386+00	seed
theme.radius	20	گردی گوشه‌ها (px)	design	2026-11-26 11:07:11.366386+00	seed
custom.css		CSS سفارشی (تزریق در کل سایت)	code	2026-11-26 11:07:11.366386+00	seed
custom.js		JavaScript سفارشی (تزریق در body)	code	2026-11-26 11:07:11.366386+00	seed
custom.head		کدهای <head> (متا تگ‌ها و وریفیکیشن)	code	2026-11-26 11:07:11.366386+00	seed
seo.title_suffix	| مینی‌مودا	پسوند عنوان صفحات	seo	2026-11-26 11:07:11.366386+00	seed
seo.og_image	/images/hero-royal-junior.jpg	تصویر پیش‌فرض اشتراک‌گذاری	seo	2026-11-26 11:07:11.366386+00	seed
design.font_size_base	14	اندازه پایه فونت (px)	design	2026-11-26 11:07:13.901277+00	seed
design.font_weight_heading	900	وزن فونت تیترها	design	2026-11-26 11:07:13.902575+00	seed
design.font_latin	Inter	فونت لاتین	design	2026-11-26 11:07:13.903767+00	seed
design.content_width	1280	عرض محتوای سایت (px)	design	2026-11-26 11:07:13.904647+00	seed
design.section_gap	24	فاصله بین بخش‌ها (px)	design	2026-11-26 11:07:13.905639+00	seed
design.shadow	soft	شدت سایه (none | soft | strong)	design	2026-11-26 11:07:13.906559+00	seed
design.bg_color	#f3f4f8	رنگ پس‌زمینه سایت	design	2026-11-26 11:07:13.907387+00	seed
design.animations	true	انیمیشن‌ها و افکت‌های انتقال	design	2026-11-26 11:07:13.908152+00	seed
design.transition_ms	250	سرعت انتقال (ms)	design	2026-11-26 11:07:13.908943+00	seed
responsive.hide_banners_mobile	false	پنهان‌کردن بنرهای ۴تایی در موبایل	responsive	2026-11-26 11:07:13.909637+00	seed
responsive.hide_trust_mobile	false	پنهان‌کردن نوار اعتماد در موبایل	responsive	2026-11-26 11:07:13.910354+00	seed
responsive.hide_blog_mobile	false	پنهان‌کردن مجله در موبایل	responsive	2026-11-26 11:07:13.911011+00	seed
responsive.hide_duo_tablet	false	پنهان‌کردن بنرهای دوگانه در تبلت	responsive	2026-11-26 11:07:13.911733+00	seed
responsive.product_cols_mobile	2	تعداد ستون محصول در موبایل (1|2)	responsive	2026-11-26 11:07:13.912346+00	seed
header.phone	021-88766554	تلفن پشتیبانی	header	2026-11-26 11:07:13.912986+00	seed
header.hours	شنبه تا پنجشنبه ۹ تا ۲۱	ساعت کاری	header	2026-11-26 11:07:13.913699+00	seed
footer.about	فروشگاه اینترنتی پوشاک کودک و نوجوان — کیفیت و جدیدترین مدل‌ها با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.	متن درباره فوتر	footer	2026-11-26 11:07:13.914619+00	seed
footer.address	تهران، خیابان ولیعصر، بالاتر از پارک ملت، مجتمع نیایش، طبقه ۲	آدرس	footer	2026-11-26 11:07:13.915294+00	seed
footer.email	support@minimoda.ir	ایمیل پشتیبانی	footer	2026-11-26 11:07:13.916042+00	seed
footer.instagram	https://www.instagram.com/minimoda.ir	لینک اینستاگرام	footer	2026-11-26 11:07:13.916743+00	seed
footer.telegram	https://t.me/minimoda_ir	لینک تلگرام	footer	2026-11-26 11:07:13.917405+00	seed
footer.copyright	© ۱۴۰۴ مینی‌مودا — کلیه حقوق محفوظ است	متن کپی‌رایت	footer	2026-11-26 11:07:13.918061+00	seed
footer.show_trust_badges	true	نمایش نمادهای اعتماد	footer	2026-11-26 11:07:13.918712+00	seed
seo.default_description	خرید آنلاین لباس کودک و نوجوان با ضمانت اصالت کالا و ارسال سریع	توضیحات متا پیش‌فرض	seo	2026-11-26 11:07:13.919457+00	seed
seo.schema_org	true	درج داده‌های ساختاریافته Schema.org	seo	2026-11-26 11:07:13.920086+00	seed
seo.lazy_images	true	بارگذاری تنبل تصاویر	seo	2026-11-26 11:07:13.920684+00	seed
admin.dark_mode	false	حالت تاریک پنل مدیریت	admin	2026-11-26 11:07:13.921296+00	seed
\.


--
-- Data for Name: themes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.themes (id, name, slug, description, author, version, preview, is_active, is_default, tokens, installed_at, updated_at) FROM stdin;
10	مینی‌مودا کلاسیک	minimoda-classic	قالب رسمی فروشگاه — سرمه‌ای سلطنتی با طلایی و صورتی پررنگ؛ بهینه برای فروش و هویت برند.	MiniModa Studio	1.4.0	https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800	t	t	{"primary":"#1b3a6b","accent":"#e91e63","gold":"#ffc107","font":"Vazirmatn","radius":"20"}	2026-11-26 11:07:11.368685+00	2026-11-26 11:07:11.368685+00
11	رویال جونیور	royal-junior-theme	پوسته مجلسی و لوکس با بنفش ارغوانی و رز گلد؛ مناسب کالکشن‌های مجلسی و عکاسی.	MiniModa Studio	2.0.0	https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800	f	f	{"primary":"#4a1042","accent":"#e11d48","gold":"#fbbf24","font":"Estedad","radius":"22"}	2026-11-26 11:07:11.368685+00	2026-11-26 11:07:11.368685+00
12	مینیمال مدرن	minimal-modern	پوسته خلوت و امروزی با خاکستری اسلیت و سبز زمردی؛ مناسب تجربه خرید سریع و مینیمال.	MiniModa Lab	1.1.0	https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800	f	f	{"primary":"#334155","accent":"#0f766e","gold":"#a3e635","font":"Noto Kufi Arabic","radius":"12"}	2026-11-26 11:07:11.368685+00	2026-11-26 11:07:11.368685+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, phone, password_hash, address, role, created_at) FROM stdin;
5	مدیر فروشگاه	admin@minimoda.ir	02188766554	9f9873fafe3a57add6c06ff724dcf44b:e0f36540ff92f2b8a44b60e1abaa074dcd06b10ba452f0d114d94c736bad95294ca90f4729e3263b2ea20016ed91e328e8288a1b2c4841a4b445fc506ac84105	تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۲	admin	2026-11-26 11:07:10.540839+00
6	سارا محمدی	sara@example.com	09121234567	f253436d3f9fe5245f0067f069b3efa7:47648a8e21fc71e4ec96d643cad3fc928d6b14da5e513641489bbecbf1d0ba357a090bb6d88814ebfc823d45eb4a9883a82314f89b9e4bad193b94676c8b0de2	تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴	user	2026-11-26 11:07:10.590879+00
\.


--
-- Data for Name: widgets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.widgets (id, type, title, config, enabled, sort, updated_at) FROM stdin;
1	popup	پاپ‌آپ خوش‌آمدگویی	{"heading":"به مینی‌مودا خوش آمدید 🎉","body":"با کد WELCOME10 اولین خرید خود را با ۱۰٪ تخفیف انجام دهید.","cta":"شروع خرید","href":"/products","delay":4,"showOnce":true}	f	1	2026-11-26 11:07:13.89988+00
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlists (id, user_id, product_id) FROM stdin;
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 49, true);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.banners_id_seq', 12, true);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 12, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_id_seq', 8, true);


--
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.campaigns_id_seq', 5, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 22, true);


--
-- Name: code_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.code_history_id_seq', 1, false);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 10, true);


--
-- Name: content_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.content_pages_id_seq', 7, true);


--
-- Name: discount_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discount_codes_id_seq', 9, true);


--
-- Name: layout_presets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.layout_presets_id_seq', 3, true);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 27, true);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.newsletter_subscribers_id_seq', 1, true);


--
-- Name: notices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notices_id_seq', 9, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 94, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 50, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 138, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 55, true);


--
-- Name: returns_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.returns_requests_id_seq', 3, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 19, true);


--
-- Name: revisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.revisions_id_seq', 2, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 47, true);


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_methods_id_seq', 8, true);


--
-- Name: size_charts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.size_charts_id_seq', 4, true);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 16, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 6, true);


--
-- Name: themes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.themes_id_seq', 12, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: widgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.widgets_id_seq', 1, true);


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
-- Name: code_history code_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.code_history
    ADD CONSTRAINT code_history_pkey PRIMARY KEY (id);


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
-- Name: layout_presets layout_presets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.layout_presets
    ADD CONSTRAINT layout_presets_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


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
-- Name: widgets widgets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widgets
    ADD CONSTRAINT widgets_pkey PRIMARY KEY (id);


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

\unrestrict MCnI7cLRjBbv5kBbyetqVXOWgup2AL9kgsROkHtj9o1mmWMSlFUXUKOeddXGelO

