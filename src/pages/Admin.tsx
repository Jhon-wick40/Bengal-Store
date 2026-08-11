import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { money } from "@/lib/format";
import { toast } from "sonner";

type Order = { id: string; created_at: string; total_cents: number; status: string; email: string; currency: string };
type Shipment = { id: string; order_id: string; carrier: string | null; tracking_number: string | null; tracking_url: string | null; status: string };

const STATUSES = ["pending", "shipped", "in_transit", "out_for_delivery", "delivered", "returned"];

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipments, setShipments] = useState<Record<string, Shipment>>({});

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      const admin = (data?.length ?? 0) > 0;
      setIsAdmin(admin);
      if (admin) {
        const { data: os } = await supabase.from("orders").select("id,created_at,total_cents,status,email,currency").order("created_at", { ascending: false });
        setOrders((os ?? []) as Order[]);
        const ids = (os ?? []).map(o => o.id);
        if (ids.length) {
          const { data: ss } = await supabase.from("shipments").select("*").in("order_id", ids);
          const m: Record<string, Shipment> = {};
          (ss ?? []).forEach(s => { m[s.order_id] = s as Shipment; });
          setShipments(m);
        }
      }
    })();
  }, [user, loading, navigate]);

  const updateShipment = async (orderId: string, patch: Partial<Shipment>) => {
    const existing = shipments[orderId];
    if (existing) {
      const { error } = await supabase.from("shipments").update({ ...(patch as any), updated_at: new Date().toISOString() }).eq("id", existing.id);
      if (error) return toast.error(error.message);
      setShipments(s => ({ ...s, [orderId]: { ...existing, ...patch } as Shipment }));
    } else {
      const { data, error } = await supabase.from("shipments").insert({ order_id: orderId, ...(patch as any) }).select().single();
      if (error) return toast.error(error.message);
      setShipments(s => ({ ...s, [orderId]: data as Shipment }));
    }
    toast.success("Tracking updated");
  };

  if (loading) return null;
  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-2 text-xl font-bold">Admin only</h1>
        <p className="text-muted-foreground">Your account ({user?.email}) does not have admin role yet. Ask the project owner to grant it from the backend.</p>
        <p className="mt-3 text-sm text-muted-foreground">User ID: <code className="break-all">{user?.id}</code></p>
        <Link to="/" className="mt-4 inline-block text-brand-orange">← Back to store</Link>
      </div>
    );
  }
  if (isAdmin === null) return <div className="p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-screen-xl px-3 py-6">
      <h1 className="mb-4 text-2xl font-bold">Admin · Orders & Tracking</h1>
      <div className="space-y-3">
        {orders.map(o => {
          const sh = shipments[o.id];
          return (
            <div key={o.id} className="rounded-md bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">#{o.id.slice(0, 8)} · {o.email}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{money(o.total_cents, o.currency)}</div>
                  <div className="text-xs uppercase text-brand-orange">{o.status}</div>
                </div>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-4">
                <input defaultValue={sh?.carrier ?? ""} onBlur={(e) => e.target.value !== (sh?.carrier ?? "") && updateShipment(o.id, { carrier: e.target.value })} placeholder="Carrier (UPS, FedEx, ...)" className="rounded border border-border bg-background px-2 py-1 text-sm" />
                <input defaultValue={sh?.tracking_number ?? ""} onBlur={(e) => e.target.value !== (sh?.tracking_number ?? "") && updateShipment(o.id, { tracking_number: e.target.value })} placeholder="Tracking #" className="rounded border border-border bg-background px-2 py-1 text-sm" />
                <input defaultValue={sh?.tracking_url ?? ""} onBlur={(e) => e.target.value !== (sh?.tracking_url ?? "") && updateShipment(o.id, { tracking_url: e.target.value })} placeholder="Tracking URL" className="rounded border border-border bg-background px-2 py-1 text-sm" />
                <select value={sh?.status ?? "pending"} onChange={(e) => updateShipment(o.id, { status: e.target.value as any })} className="rounded border border-border bg-background px-2 py-1 text-sm">
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      </div>
    </div>
  );
};

export default Admin;
