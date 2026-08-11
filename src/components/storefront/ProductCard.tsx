import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export type { Product as ProductCardData };

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const rating = Number(product.rating ?? 0);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <div className="group flex h-full flex-col rounded-md bg-card p-3 shadow-sm transition hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden rounded bg-secondary">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm text-foreground hover:text-brand-orange">
          {product.title}
        </h3>
      </Link>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "fill-rating text-rating" : "text-muted"}`}
            />
          ))}
        </div>
        <span>({(product.reviews ?? 0).toLocaleString()})</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold text-foreground">{fmt(product.price)}</span>
        {product.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">{fmt(product.oldPrice)}</span>
        )}
      </div>
      <button
        onClick={() => add(product.id)}
        className="mt-3 rounded-full bg-brand-yellow py-1.5 text-xs font-medium text-background hover:opacity-90"
      >
        Add to Cart
      </button>
    </div>
  );
}
