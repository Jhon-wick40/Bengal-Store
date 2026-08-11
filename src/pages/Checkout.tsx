import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { toast } from "sonner";

type P = { id: string; title: string; price_cents: number; image_url: string | null; currency: string };

const Checkout = () => {
  const { user, loading } = useAuth();
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Record<string, P>>({});
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    country: "United States",
  });

  useEffect(() => { if (!loading && !user) navigate(`/auth?next=/checkout`); }, [loading, user, navigate]);
  useEffect(() => {
    if (items.length === 0) return;
    supabase.from("products").select("id,title,price_cents,image_url,currency").in("id", items.map(i => i.id)).then(({ data }) => {
      const m: Record<string, P> = {};
      (data ?? []).forEach(p => { m[p.id] = p as P; });
      setProducts(m);
    });
  }, [items]);

  const subtotal = items.reduce((s, i) => s + (products[i.id]?.price_cents ?? 0) * i.qty, 0);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    setBusy(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user.id,
        email: user.email ?? "",
        status: "paid", // demo: mark paid; real Stripe checkout below
        total_cents: subtotal,
        currency: "USD",
        shipping_name: form.name,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_postal_code: form.postal,
        shipping_country: form.country,
        payment_provider: "demo",
        payment_ref: `demo_${Date.now()}`,
      }).select().single();
      if (error) throw error;

      const itemsRows = items.map(i => {
        const p = products[i.id];
        return { order_id: order.id, product_id: i.id, title: p?.title ?? "Item", image_url: p?.image_url ?? null, qty: i.qty, unit_price_cents: p?.price_cents ?? 0 };
      });
      const { error: e2 } = await supabase.from("order_items").insert(itemsRows);
      if (e2) throw e2;

      // Initial shipment row
      await supabase.from("shipments").insert({ order_id: order.id, status: "pending" });

      clear();
      toast.success("Order placed!");
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to place order");
    } finally { setBusy(false); }
  };

  if (loading) return null;

  return (
    <div className="mx-auto grid max-w-screen-xl gap-6 px-3 py-6 md:grid-cols-[1fr_360px]">
      <form onSubmit={placeOrder} className="space-y-4 rounded-md bg-card p-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div>
          <h2 className="mb-2 text-lg font-bold">Shipping address</h2>
          <div className="grid gap-3">
            <input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded border border-border bg-background px-3 py-2" />
            <input required placeholder="Street address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="rounded border border-border bg-background px-3 py-2" />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="rounded border border-border bg-background px-3 py-2" />
              <input required placeholder="Postal code" value={form.postal} onChange={e => setForm({ ...form, postal: e.target.value })} className="rounded border border-border bg-background px-3 py-2" />
            </div>
            <input required placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="rounded border border-border bg-background px-3 py-2" />
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-bold">Payment</h2>
          <div className="rounded border border-border bg-background p-3 text-sm text-muted-foreground">
            Demo payment — your order will be marked paid immediately. Hook up Stripe later from the admin panel.
          </div>
        </div>
        <button disabled={busy || items.length === 0} className="w-full rounded-full bg-brand-yellow py-2 font-medium text-background hover:opacity-90 disabled:opacity-50">
          {busy ? "Placing order…" : `Place order — ${money(subtotal)}`}
        </button>
      </form>

      <aside className="h-fit rounded-md bg-card p-4">
        <h2 className="mb-3 text-lg font-bold">Order summary</h2>
        {items.map(i => {
          const p = products[i.id];
          if (!p) return null;
          return (
            <div key={i.id} className="flex items-center gap-3 border-b border-border py-2 last:border-0">
              <img src={p.image_url ?? ""} alt={p.title} className="h-12 w-12 rounded object-cover" />
              <div className="flex-1 text-sm">
                <div className="line-clamp-1">{p.title}</div>
                <div className="text-muted-foreground">Qty {i.qty}</div>
              </div>
              <div className="text-sm font-bold">{money(p.price_cents * i.qty, p.currency)}</div>
            </div>
          );
        })}
        <div className="mt-3 flex justify-between font-bold"><span>Total</span><span>{money(subtotal)}</span></div>
      </aside>
    </div>
  );
};

export default Checkout;
