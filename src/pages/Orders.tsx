import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { money } from "@/lib/format";

type Order = { id: string; created_at: string; total_cents: number; status: string; currency: string };

const Orders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id,created_at,total_cents,status,currency").order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as Order[]));
  }, [user]);

  if (loading) return null;
  if (!user) return <div className="mx-auto max-w-md p-6">Please <Link to="/auth" className="text-brand-orange">sign in</Link> to see your orders.</div>;

  return (
    <div className="mx-auto max-w-screen-xl px-3 py-6">
      <h1 className="mb-4 text-2xl font-bold">My orders</h1>
      {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      <div className="space-y-3">
        {orders.map(o => (
          <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between rounded-md bg-card p-4 hover:shadow-lg">
            <div>
              <div className="text-sm text-muted-foreground">Order #{o.id.slice(0, 8)}</div>
              <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{money(o.total_cents, o.currency)}</div>
              <div className="text-xs uppercase tracking-wide text-brand-orange">{o.status}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
