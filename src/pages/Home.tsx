import { Link } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/storefront/ProductCard";

const Home = () => {
  const featured = PRODUCTS.slice(0, 12);

  return (
    <div className="mx-auto max-w-screen-2xl px-3 py-4">
      {/* Hero banner */}
      <div className="mb-4 overflow-hidden rounded-md bg-gradient-to-r from-brand-bar to-brand-bar-2 px-6 py-10 md:py-16">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold md:text-4xl">Style without limits</h1>
          <p className="mt-2 text-muted-foreground">
            Fresh fashion, beauty and electronics — delivered to your door with full parcel tracking.
          </p>
          <Link
            to="/category/fashion"
            className="mt-4 inline-block rounded-full bg-brand-yellow px-5 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Shop Fashion
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            className="group rounded-md bg-card p-3 hover:shadow-lg"
          >
            <div className="aspect-square overflow-hidden rounded">
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="mt-2 text-center font-bold">{c.name}</div>
          </Link>
        ))}
      </div>

      {/* Featured products */}
      <h2 className="mt-8 mb-3 text-xl font-bold">Featured products</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Home;
