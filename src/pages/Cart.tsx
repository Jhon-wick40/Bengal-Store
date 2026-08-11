import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const Cart = () => {
  const { detailed, setQty, remove, count, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="mx-auto grid max-w-screen-xl gap-6 px-3 py-6 md:grid-cols-[1fr_320px]">
      <div className="rounded-md bg-card p-4">
        <h1 className="mb-4 text-2xl font-bold">Shopping Cart</h1>
        {detailed.length === 0 ? (
          <div>
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/" className="mt-3 inline-block text-brand-orange hover:underline">
              Continue shopping →
            </Link>
          </div>
        ) : (
          detailed.map(({ product: p, qty }) => (
            <div key={p.id} className="flex gap-4 border-b border-border py-3 last:border-0">
              <Link to={`/product/${p.id}`}>
                <img src={p.image} alt={p.title} className="h-24 w-24 rounded object-cover" />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${p.id}`} className="font-medium hover:text-brand-orange">
                  {p.title}
                </Link>
                <div className="mt-1 text-sm text-green-500">In stock</div>
                <div className="mt-2 flex items-center gap-3">
                  <select
                    value={qty}
                    onChange={(e) => setQty(p.id, Number(e.target.value))}
                    className="rounded border border-border bg-background px-2 py-1 text-sm"
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <option key={i} value={i + 1}>Qty: {i + 1}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(p.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
              <div className="font-bold">{fmt(p.price * qty)}</div>
            </div>
          ))
        )}
      </div>

      <aside className="h-fit rounded-md bg-card p-4">
        <div className="text-lg">
          Subtotal ({count} {count === 1 ? "item" : "items"}):{" "}
          <span className="font-bold">{fmt(subtotal)}</span>
        </div>
        <button
          disabled={detailed.length === 0}
          onClick={() => navigate("/checkout")}
          className="mt-3 w-full rounded-full bg-brand-yellow py-2 font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          Proceed to checkout
        </button>
      </aside>
    </div>
  );
};

export default Cart;
