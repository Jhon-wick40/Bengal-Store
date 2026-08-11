import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Truck, Package, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/format";
import { getProductById } from "@/lib/products";

type Order = any;
type Item = any;
type Shipment = any;

const STATUS_FLOW = ["pending", "shipped", "in_transit", "out_for_delivery", "delivered"];

const OrderDetail = () => {
  const { id = "" } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [shipment, setShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    (async () => {
      const { data: o } = await supabase.from("orders").select("*").eq("id", product.id).maybeSingle();
      setOrder(o);
      const { data: it } = await supabase.from("order_items").select("*").eq("order_id", id);
      setItems(it ?? []);
      const { data: sh } = await supabase.from("shipments").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      setShipment(sh);
    })();
  }, [id]);

  if (!order) return <div className="mx-auto max-w-screen-xl p-6">Loading…</div>;

  const stepIdx = shipment ? STATUS_FLOW.indexOf(shipment.status) : 0;

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-3 py-6">
      <div>
        <Link to="/orders" className="text-sm text-muted-foreground hover:underline">← All orders</Link>
        <h1 className="mt-2 text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
        <div className="text-sm text-muted-foreground">Placed {new Date(order.created_at).toLocaleString()}</div>
      </div>

      <div className="rounded-md bg-card p-4">
        <h2 className="mb-3 text-lg font-bold flex items-center gap-2"><Truck className="h-5 w-5" /> Tracking</h2>
        {shipment?.carrier ? (
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Carrier: </span>{shipment.carrier}</div>
            <div><span className="text-muted-foreground">Tracking #: </span>{shipment.tracking_number}</div>
            {shipment.tracking_url && <a className="text-brand-orange hover:underline" href={shipment.tracking_url} target="_blank" rel="noreferrer">Track parcel on carrier site →</a>}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Tracking details will appear here once your order ships.</p>
        )}

        <div className="mt-5 flex items-center justify-between gap-2">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${i <= stepIdx ? "bg-brand-yellow text-background" : "bg-secondary text-muted-foreground"}`}>
                {i < stepIdx ? <CheckCircle2 className="h-5 w-5" /> : i === stepIdx ? <Package className="h-5 w-5" /> : <span>{i + 1}</span>}
              </div>
              <div className="mt-1 text-center text-xs capitalize">{s.replace(/_/g, " ")}</div>
              {i < STATUS_FLOW.length - 1 && <div className={`mt-2 hidden h-1 w-full md:block ${i < stepIdx ? "bg-brand-yellow" : "bg-secondary"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md bg-card p-4">
          <h2 className="mb-2 text-lg font-bold">Items</h2>
          {items.map(i => (
            <div key={i.id} className="flex items-center gap-3 border-b border-border py-2 last:border-0">
              <img src={i.image_url ?? ""} alt={i.title} className="h-14 w-14 rounded object-cover" />
              <div className="flex-1 text-sm">
                <div>{i.title}</div>
                <div className="text-muted-foreground">Qty {i.qty}</div>
              </div>
              <div className="font-bold">{money(i.unit_price_cents * i.qty, order.currency)}</div>
            </div>
          ))}
          <div className="mt-3 flex justify-between font-bold"><span>Total</span><span>{money(order.total_cents, order.currency)}</span></div>
        </div>
        <div className="rounded-md bg-card p-4">
          <h2 className="mb-2 text-lg font-bold">Shipping to</h2>
          <div className="text-sm text-muted-foreground">
            <div>{order.shipping_name}</div>
            <div>{order.shipping_address}</div>
            <div>{order.shipping_city}, {order.shipping_postal_code}</div>
            <div>{order.shipping_country}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
