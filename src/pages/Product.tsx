import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { getProductById } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const ProductPage = () => {
  const { id = "" } = useParams();
  const p = getProductById(id);
  const { add } = useCart();

  if (!p) return <div className="mx-auto max-w-screen-xl px-3 py-8">Product not found.</div>;

  return (
    <div className="mx-auto grid max-w-screen-xl gap-6 px-3 py-6 md:grid-cols-[1fr_1.2fr_320px]">
      <div className="rounded-md bg-card p-3">
        <img src={p.image} alt={p.title} className="aspect-square w-full rounded object-cover" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{p.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(p.rating) ? "fill-rating text-rating" : "text-muted"}`}
              />
            ))}
          </div>
          <span>{p.reviews.toLocaleString()} ratings</span>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-bold">{fmt(p.price)}</span>
          {p.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">{fmt(p.oldPrice)}</span>
          )}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground capitalize">{p.category} item</p>
      </div>
      <aside className="h-fit rounded-md bg-card p-4">
        <div className="text-2xl font-bold">{fmt(p.price)}</div>
        <div className="mt-2 text-sm text-muted-foreground">FREE delivery</div>
        <div className="mt-2 text-sm text-green-500">In Stock</div>
        <button
          onClick={() => { add(p.id); toast.success("Added to cart"); }}
          className="mt-4 w-full rounded-full bg-brand-yellow py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Add to Cart
        </button>
      </aside>
    </div>
  );
};

export default ProductPage;
