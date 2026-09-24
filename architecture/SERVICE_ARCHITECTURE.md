# Indus Trend service architecture

## Decision

Start as a Spring Boot modular service with independently owned packages and tables, fronted by Nginx. This keeps the prototype operationally simple while preserving boundaries that can be extracted into services when load, team ownership, or release cadence requires it. Do not create a distributed monolith prematurely.

## Bounded contexts

| Context | Responsibility | Current state | Extraction trigger |
|---|---|---|---|
| Identity & Customer | Mobile OTP, sessions, profiles, addresses | Implemented in Spring Boot | Independent identity team or multiple client apps |
| Configuration | Runtime non-secret configuration with 30-second cache | Implemented | Central administration and change audit requirements |
| Notification | MSG91 adapter and delivery audit | Implemented behind an interface | Multiple providers/channels or high send volume |
| Catalog | Stores, categories, products, media metadata | Schema ready; UI data remains static during migration | Seller self-service editing begins |
| Cart & Order | Cart, pricing snapshot, checkout, order lifecycle | Schema ready | Checkout implementation begins |
| Payment | Provider attempts, idempotency and reconciliation | Schema ready | Payment gateway integration begins |
| Content | Site/store configuration and localized page content | Schema ready | Admin content editor begins |

All PostgreSQL objects are explicitly created in `industrendindia`; application SQL always schema-qualifies tables and the pool sets `search_path=industrendindia,pg_catalog`. Nothing is intentionally created in `public`. The existing PostgreSQL application role should run Flyway so the schema is owned by that role.

## Security model

- Six-digit OTP uses `SecureRandom`; only an HMAC-SHA-256 digest is stored.
- OTP TTL, resend window and attempt limit are runtime configuration values.
- MSG91 Auth Key is an environment secret; template, sender and provider mode are database configuration.
- Customer sessions are opaque 256-bit values. Only HMAC digests are stored in PostgreSQL.
- Session cookie is `HttpOnly`, `Secure`, `SameSite=Lax`, path `/`.
- Mutating authenticated APIs require a rotated `X-CSRF-Token`.
- Logout revokes the server-side session and clears the cookie. API responses are `no-store`, so browser Back cannot revive authentication.
- Mobile/email changes require a recent purpose-bound OTP challenge.
- Internal service extraction should use mTLS plus short-lived workload credentials. Never forward customer cookies service-to-service.
- Payment webhooks must verify provider signatures and use the unique idempotency key before changing an order.

## Runtime configuration

`industrendindia.app_config` is the source of reloadable, non-secret values. Values are cached for 30 seconds, so database changes apply without restart. Secrets stay in the process environment or a future secret manager.

Required production environment variables:

- `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`
- `OTP_PEPPER` (strong random secret; never rotate without invalidating outstanding OTP/session hashes)
- `MSG91_AUTH_KEY`
- `COOKIE_SECURE=true`
- `EXPOSE_MOCK_OTP=false`

Set `notification.provider=msg91` only after `notification.msg91.template_id` and `notification.msg91.sender_id` are configured.

## Data ownership and events

The transactional outbox table allows a transaction to save business state and an integration event atomically. When services are extracted, an outbox publisher can deliver events to a broker without dual-write loss. Consumers must use event IDs for idempotency.

Images belong in object storage/CDN; PostgreSQL stores only object keys, URLs, dimensions, MIME type and metadata. Store presentation settings belong in `stores.configuration`; localized page blocks belong in `site_content`.