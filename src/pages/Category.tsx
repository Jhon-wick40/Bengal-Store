import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/storefront/ProductCard";

type Category = { id: string; slug: string; name: string };
type Product = {
  id: string;
  slug: string;
  title: string;
  price_cents: number;
  old_price_cents: number | null;
  currency: string;
  image_url: string | null;
  rating: number;
  reviews: number;
};

const Category = () => {
  const { slug = "" } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    (async () => {
      // 1. Resolve category by slug (no UUID in the URL)
      const { data: cat } = await supabase
        .from("categories")
        .select("id, slug, name")
        .eq("slug", slug)
        .maybeSingle();

      setCategory(cat ?? null);

      if (!cat) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // 2. Fetch active products for that category using the real UUID internally
      const { data: prods } = await supabase
        .from("products")
        .select("id, slug, title, price_cents, old_price_cents, currency, image_url, rating, reviews")
        .eq("category_id", cat.id)   // ← real UUID used here, never from URL params
        .eq("active", true)
        .order("created_at", { ascending: false });

      setProducts((prods ?? []) as Product[]);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="mx-auto max-w-screen-2xl px-3 py-8">Loading…</div>;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 py-4">
      <h1 className="mb-4 text-2xl font-bold capitalize">
        {category?.name ?? slug}
      </h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {!loading && products.length === 0 && (
        <p className="text-muted-foreground">No products in this category yet.</p>
      )}
    </div>
  );
};

export default Category;
