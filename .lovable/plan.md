## Goal

Build a clothing/accessories storefront on Lovable Cloud (Supabase backend) with auth, payments, checkout, and parcel tracking — using the look & feel from the uploaded `style-sparkle-shop` zip.

## What gets built

### 1. Storefront (frontend)
- Port the visual design (Tailwind + shadcn/ui components) and page structure from the uploaded sparkle shop into this React + Vite project.
- Pages: Home, Category, Product detail, Search, Cart, Checkout, Order confirmation, My Orders, Order detail (with tracking), Sign in, Sign up.
- Persistent navbar with cart badge and account menu.
- Cart stored in localStorage for guests, synced to DB on login.

### 2. Backend (Lovable Cloud / Supabase)
Tables:
- `profiles` (id, full_name, phone) — auto-created on signup via trigger
- `products` (id, slug, name, description, price_cents, currency, images[], stock, category_id)
- `categories` (id, slug, name)
- `orders` (id, user_id, status, total_cents, shipping_address, payment_provider, payment_ref, created_at)
- `order_items` (id, order_id, product_id, qty, unit_price_cents)
- `shipments` (id, order_id, carrier, tracking_number, tracking_url, status, updated_at)
- `user_roles` + `app_role` enum + `has_role()` security-definer function (for admin)

RLS:
- Products/categories: public read.
- Orders/order_items/shipments: owner read; admins read/write all.
- Profiles: owner read/update.

Seed: a handful of sample products from the sparkle shop assets.

### 3. Auth
- Email + password sign up / sign in / sign out.
- `onAuthStateChange` listener + session bootstrap.
- Protected routes for `/account`, `/orders`, `/checkout` (checkout allows guest → prompts login).

### 4. Payments
- Use Lovable's **built-in Stripe payments** (no API key needed from user).
- Test mode out of the box; live mode after account claim.
- Edge function `create-checkout` creates a Stripe Checkout session for current cart; `stripe-webhook` marks order paid and decrements stock.
- After successful payment → redirect to `/orders/:id` confirmation.

### 5. Parcel tracking (manual)
- Admin page `/admin/orders` lists paid orders; admin can set carrier, tracking number, tracking URL, and status (`pending → shipped → in_transit → delivered`).
- Customer order page shows current status, carrier, tracking number, and a "Track parcel" link.
- Status timeline with timestamps.

### 6. Admin
- First user can be promoted to `admin` via SQL snippet shown after setup.
- Admin pages: products CRUD, orders list, set tracking.

## Technical notes
- Stack stays React 18 + Vite + Tailwind + shadcn/ui + TanStack Query + react-router-dom (already wired). The uploaded project uses TanStack Router — we'll re-implement its routes under react-router-dom rather than swap routers.
- Lovable Cloud will be enabled; Stripe enabled via `enable_stripe_payments` after eligibility check.
- All assets from the sparkle zip copied to `src/assets/`.

## Out of scope (for now)
- Google/social sign-in, password reset email customization, automated carrier API tracking, reviews, wishlists, discount codes. Easy to add later.

## Build order
1. Enable Lovable Cloud + create schema, RLS, trigger, seed products.
2. Auth (sign in / sign up / session).
3. Storefront pages + cart.
4. Run Stripe eligibility check → enable Stripe payments → checkout edge function + webhook.
5. Orders + tracking UI (customer + admin).
