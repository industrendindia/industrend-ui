-- Indus Trend isolated application schema. Run as the existing application DB role.
BEGIN;
CREATE SCHEMA IF NOT EXISTS industrendindia AUTHORIZATION CURRENT_USER;
SET LOCAL search_path = industrendindia, pg_catalog;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS app_config (
  config_key text PRIMARY KEY,
  config_value text NOT NULL,
  is_secret boolean NOT NULL DEFAULT false,
  description text,
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_by text NOT NULL DEFAULT current_user
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id uuid PRIMARY KEY,
  mobile_e164 varchar(16) NOT NULL UNIQUE,
  first_name varchar(80),
  last_name varchar(80),
  email varchar(254),
  mobile_verified_at timestamptz NOT NULL,
  email_verified_at timestamptz,
  profile_completed_at timestamptz,
  status varchar(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','LOCKED','DELETED')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT customers_email_format CHECK (email IS NULL OR email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
CREATE UNIQUE INDEX IF NOT EXISTS customers_email_uq ON customers (lower(email)) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS customer_addresses (
  address_id uuid PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  address_type varchar(20) NOT NULL DEFAULT 'DELIVERY',
  address_line1 varchar(240) NOT NULL,
  area_landmark varchar(240),
  city varchar(100) NOT NULL,
  state_name varchar(100) NOT NULL,
  postal_code char(6) NOT NULL CHECK (postal_code ~ '^[1-9][0-9]{5}$'),
  is_default boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS customer_addresses_customer_idx ON customer_addresses(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS customer_default_address_uq ON customer_addresses(customer_id) WHERE is_default;

CREATE TABLE IF NOT EXISTS otp_challenges (
  challenge_id uuid PRIMARY KEY,
  destination varchar(254) NOT NULL,
  channel varchar(12) NOT NULL CHECK (channel IN ('SMS','EMAIL')),
  purpose varchar(24) NOT NULL CHECK (purpose IN ('LOGIN','MOBILE_CHANGE','EMAIL_CHANGE')),
  otp_hash char(64) NOT NULL,
  expires_at timestamptz NOT NULL,
  attempt_count smallint NOT NULL DEFAULT 0,
  max_attempts smallint NOT NULL DEFAULT 5,
  consumed_at timestamptz,
  verified_at timestamptz,
  verified_customer_id uuid REFERENCES customers(customer_id),
  requested_ip inet,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS otp_destination_created_idx ON otp_challenges(destination, created_at DESC);
CREATE INDEX IF NOT EXISTS otp_expiry_idx ON otp_challenges(expires_at) WHERE consumed_at IS NULL;

CREATE TABLE IF NOT EXISTS postal_code_reference (
  postal_code char(6) PRIMARY KEY CHECK (postal_code ~ '^[1-9][0-9]{5}$'),
  city varchar(100) NOT NULL,
  state_name varchar(100) NOT NULL,
  active boolean NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS postal_code_city_state_idx ON postal_code_reference(state_name, city);

CREATE TABLE IF NOT EXISTS customer_sessions (
  session_id uuid PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE,
  csrf_hash char(64) NOT NULL,
  user_agent_hash char(64),
  ip_created inet,
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS customer_sessions_customer_idx ON customer_sessions(customer_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS customer_sessions_active_idx ON customer_sessions(token_hash, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS stores (
  store_id uuid PRIMARY KEY,
  slug varchar(120) NOT NULL UNIQUE,
  display_name varchar(160) NOT NULL,
  description text,
  status varchar(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','SUSPENDED')),
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS stores_active_idx ON stores(status, display_name);

CREATE TABLE IF NOT EXISTS media_assets (
  asset_id uuid PRIMARY KEY,
  store_id uuid REFERENCES stores(store_id) ON DELETE CASCADE,
  object_key text NOT NULL UNIQUE,
  public_url text NOT NULL,
  mime_type varchar(100) NOT NULL,
  alt_text varchar(300),
  width integer CHECK (width IS NULL OR width > 0),
  height integer CHECK (height IS NULL OR height > 0),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS media_assets_store_idx ON media_assets(store_id);

CREATE TABLE IF NOT EXISTS categories (
  category_id uuid PRIMARY KEY,
  parent_category_id uuid REFERENCES categories(category_id),
  slug varchar(120) NOT NULL UNIQUE,
  name varchar(140) NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  status varchar(20) NOT NULL DEFAULT 'ACTIVE',
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS categories_parent_sort_idx ON categories(parent_category_id, sort_order);

CREATE TABLE IF NOT EXISTS products (
  product_id uuid PRIMARY KEY,
  store_id uuid NOT NULL REFERENCES stores(store_id),
  sku varchar(100) NOT NULL,
  slug varchar(180) NOT NULL,
  name varchar(220) NOT NULL,
  description text,
  price_minor bigint NOT NULL CHECK (price_minor >= 0),
  compare_at_price_minor bigint CHECK (compare_at_price_minor IS NULL OR compare_at_price_minor >= price_minor),
  currency char(3) NOT NULL DEFAULT 'INR',
  inventory_quantity integer NOT NULL DEFAULT 0 CHECK (inventory_quantity >= 0),
  status varchar(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','ARCHIVED')),
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(store_id, sku), UNIQUE(store_id, slug)
);
CREATE INDEX IF NOT EXISTS products_store_status_idx ON products(store_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS products_attributes_gin ON products USING gin(attributes);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id uuid NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
  PRIMARY KEY(product_id, category_id)
);
CREATE INDEX IF NOT EXISTS product_categories_category_idx ON product_categories(category_id, product_id);

CREATE TABLE IF NOT EXISTS product_media (
  product_id uuid NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES media_assets(asset_id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY(product_id, asset_id)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id uuid PRIMARY KEY,
  order_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  customer_id uuid NOT NULL REFERENCES customers(customer_id),
  status varchar(24) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','PAID','FULFILLED','CANCELLED','REFUNDED')),
  currency char(3) NOT NULL DEFAULT 'INR',
  subtotal_minor bigint NOT NULL CHECK (subtotal_minor >= 0),
  shipping_minor bigint NOT NULL DEFAULT 0 CHECK (shipping_minor >= 0),
  total_minor bigint NOT NULL CHECK (total_minor >= 0),
  delivery_address jsonb NOT NULL,
  idempotency_key varchar(100) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS orders_customer_created_idx ON orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(product_id),
  store_id uuid NOT NULL REFERENCES stores(store_id),
  sku varchar(100) NOT NULL,
  product_name varchar(220) NOT NULL,
  unit_price_minor bigint NOT NULL CHECK (unit_price_minor >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total_minor bigint NOT NULL CHECK (line_total_minor >= 0)
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_store_idx ON order_items(store_id, order_id);

CREATE TABLE IF NOT EXISTS payment_attempts (
  payment_attempt_id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(order_id),
  provider varchar(40) NOT NULL,
  provider_payment_id varchar(160),
  status varchar(24) NOT NULL CHECK (status IN ('CREATED','AUTHORIZED','CAPTURED','FAILED','REFUNDED')),
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  currency char(3) NOT NULL DEFAULT 'INR',
  idempotency_key varchar(100) NOT NULL UNIQUE,
  provider_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS payment_attempts_order_idx ON payment_attempts(order_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS payment_provider_id_uq ON payment_attempts(provider, provider_payment_id) WHERE provider_payment_id IS NOT NULL;


CREATE TABLE IF NOT EXISTS shopping_carts (
  cart_id uuid PRIMARY KEY,
  customer_id uuid REFERENCES customers(customer_id) ON DELETE CASCADE,
  anonymous_token_hash char(64),
  status varchar(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','CONVERTED','ABANDONED')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (customer_id IS NOT NULL OR anonymous_token_hash IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS shopping_carts_customer_active_uq ON shopping_carts(customer_id) WHERE status='ACTIVE' AND customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS shopping_carts_expiry_idx ON shopping_carts(expires_at) WHERE status='ACTIVE';

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id uuid NOT NULL REFERENCES shopping_carts(cart_id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(product_id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_snapshot_minor bigint NOT NULL CHECK (unit_price_snapshot_minor >= 0),
  added_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS site_content (
  content_key varchar(160) PRIMARY KEY,
  locale varchar(20) NOT NULL DEFAULT 'en-IN',
  content jsonb NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
  version integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_by text NOT NULL DEFAULT current_user
);
CREATE INDEX IF NOT EXISTS site_content_status_locale_idx ON site_content(status, locale);
CREATE INDEX IF NOT EXISTS site_content_gin ON site_content USING gin(content);

CREATE TABLE IF NOT EXISTS integration_outbox (
  event_id uuid PRIMARY KEY,
  aggregate_type varchar(80) NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type varchar(120) NOT NULL,
  payload jsonb NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','PUBLISHED','FAILED')),
  available_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  attempt_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  published_at timestamptz
);
CREATE INDEX IF NOT EXISTS integration_outbox_dispatch_idx ON integration_outbox(status, available_at, created_at) WHERE status IN ('PENDING','FAILED');

CREATE TABLE IF NOT EXISTS audit_events (
  audit_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_type varchar(30) NOT NULL,
  actor_id uuid,
  action varchar(120) NOT NULL,
  entity_type varchar(80) NOT NULL,
  entity_id uuid,
  request_id varchar(100),
  ip_address inet,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS audit_events_entity_idx ON audit_events(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_actor_idx ON audit_events(actor_id, created_at DESC) WHERE actor_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS notification_deliveries (
  notification_id uuid PRIMARY KEY,
  customer_id uuid REFERENCES customers(customer_id),
  channel varchar(20) NOT NULL,
  template_key varchar(120) NOT NULL,
  destination varchar(254) NOT NULL,
  provider varchar(40),
  provider_message_id varchar(180),
  status varchar(20) NOT NULL,
  error_code varchar(80),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  delivered_at timestamptz
);
CREATE INDEX IF NOT EXISTS notification_destination_idx ON notification_deliveries(destination, created_at DESC);

INSERT INTO app_config(config_key, config_value, description) VALUES
('auth.otp.ttl_seconds','300','OTP validity'),
('auth.otp.resend_seconds','45','Minimum resend interval'),
('auth.otp.max_attempts','5','Maximum verification attempts'),
('auth.session.ttl_seconds','604800','Customer session lifetime'),
('notification.provider','mock','mock or msg91'),
('notification.msg91.base_url','https://control.msg91.com/api/v5/otp','MSG91 OTP endpoint'),
('notification.msg91.template_id','','MSG91 OTP template id'),
('notification.msg91.template_namespace','','MSG91 template namespace'),
('notification.msg91.sender_id','','MSG91 sender id')
ON CONFLICT (config_key) DO NOTHING;

INSERT INTO postal_code_reference(postal_code, city, state_name) VALUES ('411017','Pune','Maharashtra') ON CONFLICT (postal_code) DO NOTHING;

INSERT INTO schema_migrations(version) VALUES ('001_industrendindia') ON CONFLICT DO NOTHING;
COMMIT;
