import { useSearchParams } from "react-router-dom";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/storefront/ProductCard";

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const products = q
    ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(q) || p.category.includes(q))
    : PRODUCTS;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 py-4">
      <h1 className="mb-4 text-xl">
        {q ? (
          <>Results for "<span className="font-bold">{q}</span>" — {products.length}</>
        ) : (
          <>All products — {products.length}</>
        )}
      </h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Search;
