
-- ROLES
create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create policy "users read own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "admins read all roles" on public.user_roles for select using (public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);
create policy "admins read profiles" on public.profiles for select using (public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- CATEGORIES
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  image_url text,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "public read categories" on public.categories for select using (true);
create policy "admins manage categories" on public.categories for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  old_price_cents integer,
  currency text not null default 'USD',
  image_url text,
  rating numeric(2,1) default 4.5,
  reviews integer default 0,
  stock integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "public read products" on public.products for select using (active = true);
create policy "admins read all products" on public.products for select using (public.has_role(auth.uid(),'admin'));
create policy "admins manage products" on public.products for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create index on public.products(category_id);

-- ORDERS
create type public.order_status as enum ('pending','paid','fulfilled','cancelled','refunded');
create type public.shipment_status as enum ('pending','shipped','in_transit','out_for_delivery','delivered','returned');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status public.order_status not null default 'pending',
  total_cents integer not null default 0,
  currency text not null default 'USD',
  shipping_name text,
  shipping_address text,
  shipping_city text,
  shipping_postal_code text,
  shipping_country text,
  payment_provider text,
  payment_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "users insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "admins read all orders" on public.orders for select using (public.has_role(auth.uid(),'admin'));
create policy "admins manage orders" on public.orders for update using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ORDER ITEMS
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  image_url text,
  qty integer not null check (qty > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0)
);
alter table public.order_items enable row level security;
create policy "users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "users insert own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "admins read all order items" on public.order_items for select using (public.has_role(auth.uid(),'admin'));
create policy "admins manage order items" on public.order_items for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- SHIPMENTS
create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  tracking_url text,
  status public.shipment_status not null default 'pending',
  notes text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shipments enable row level security;
create policy "users read own shipments" on public.shipments for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "admins read all shipments" on public.shipments for select using (public.has_role(auth.uid(),'admin'));
create policy "admins manage shipments" on public.shipments for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- SEED categories
insert into public.categories (slug, name, image_url) values
 ('fashion','Fashion','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80'),
 ('beauty','Beauty','https://images.unsplash.com/photo-1522335789203-aaa2b91b13c6?w=600&q=80'),
 ('electronics','Electronics','https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80'),
 ('home','Home & Kitchen','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'),
 ('sports','Sports','https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80');

-- SEED products
with c as (select id, slug from public.categories)
insert into public.products (category_id, slug, title, description, price_cents, old_price_cents, image_url, rating, reviews, stock)
select c.id, p.slug, p.title, p.description, p.price_cents, p.old_price_cents, p.image_url, p.rating, p.reviews, 100
from (values
 ('fashion','denim-jacket','Mens Classic Denim Jacket','A timeless denim jacket with a classic fit and quality stitching.',4999,7999,'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',4.5,1240),
 ('fashion','floral-dress','Womens Summer Floral Dress','Lightweight floral dress perfect for sunny days.',3450,5900,'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',4.6,982),
 ('fashion','crossbody-bag','Leather Crossbody Handbag','Premium leather handbag with adjustable strap.',7900,null,'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',4.7,654),
 ('fashion','running-sneakers','Unisex Running Sneakers','Comfortable running sneakers with breathable mesh.',6499,8999,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',4.4,2310),
 ('fashion','aviator-sunglasses','Aviator Sunglasses','Classic aviator sunglasses with UV protection.',1999,null,'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',4.3,540),
 ('fashion','wool-beanie','Wool Winter Beanie','Warm wool beanie for cold days.',1499,null,'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80',4.6,312),
 ('beauty','face-serum','Hydrating Face Serum 30ml','Daily hydrating serum for glowing skin.',2299,3200,'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',4.7,1845),
 ('beauty','lipstick-set','Matte Liquid Lipstick Set','Long-lasting matte liquid lipstick set.',1850,null,'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',4.5,921),
 ('beauty','brush-kit','Professional Makeup Brush Kit','Complete brush set for professional results.',2999,4999,'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80',4.6,1320),
 ('electronics','wireless-headphones','Wireless Bluetooth Headphones','Over-ear headphones with active noise cancellation.',8999,12999,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',4.6,3210),
 ('electronics','smartwatch','Fitness Smartwatch','Track workouts, heart rate and sleep.',12999,17999,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',4.5,2410),
 ('electronics','portable-speaker','Portable Bluetooth Speaker','Waterproof speaker with 24h battery life.',4999,null,'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',4.4,1280),
 ('home','knife-set','Stainless Steel Knife Set','Professional 8-piece chef knife set.',7900,11900,'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80',4.5,540),
 ('home','coffee-maker','12-Cup Coffee Maker','Programmable coffee maker for the perfect brew.',5999,null,'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',4.4,820),
 ('sports','yoga-mat','Eco-Friendly Yoga Mat','Non-slip yoga mat made from natural rubber.',3499,4999,'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=500&q=80',4.7,910),
 ('sports','dumbbell-set','Adjustable Dumbbell Set','Space-saving adjustable dumbbells, 5-50lb.',19900,24900,'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',4.8,430)
) as p(category_slug, slug, title, description, price_cents, old_price_cents, image_url, rating, reviews)
join c on c.slug = p.category_slug;
