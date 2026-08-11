import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, MapPin, Menu, User as UserIcon, Package, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CATS = [
  { slug: "fashion", name: "Fashion" },
  { slug: "Perfume", name: "Perfume" },
  { slug: "electronics", name: "Electronics" },
  { slug: "home", name: "Home & Kitchen" },
  { slug: "sports", name: "Sports" },
];

export function Header() {
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => { setQ(params.get("q") ?? ""); }, [params]);

  const submit = (value: string) => navigate(`/search?q=${encodeURIComponent(value)}`);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-brand-bar text-foreground">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-2 px-3 py-2 md:gap-4">
          <Link to="/" className="rounded border border-transparent px-2 py-1 text-xl font-bold hover:border-foreground/50 md:text-2xl">
            Bengal <span className="text-brand-orange">Store</span>
          </Link>
          <div className="hidden items-center gap-1 text-xs md:flex">
            <MapPin className="h-4 w-4" />
            <div>
              <div className="text-muted-foreground">Deliver to</div>
              <div className="font-bold">Your location</div>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); submit(q); }} className="flex flex-1 items-center overflow-hidden rounded-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Bengal Store"
              className="h-10 flex-1 bg-background px-3 text-sm text-foreground outline-none"
            />
            <button type="submit" className="flex h-10 w-12 items-center justify-center bg-brand-yellow text-background hover:opacity-90">
              <Search className="h-5 w-5" />
            </button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger className="hidden text-left text-xs md:block px-2 py-1 rounded border border-transparent hover:border-foreground/50">
              <div className="text-muted-foreground">Hello, {user ? user.email?.split("@")[0] : "sign in"}</div>
              <div className="font-bold">Account & Lists</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("/orders")}><Package className="mr-2 h-4 w-4" /> My orders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin")}><UserIcon className="mr-2 h-4 w-4" /> Admin</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate("/auth")}>Sign in</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/auth?mode=signup")}>Create account</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/cart" className="flex items-center gap-1 rounded border border-transparent px-2 py-1 hover:border-foreground/50">
            <div className="relative">
              <ShoppingCart className="h-7 w-7" />
              <span className="absolute -right-2 -top-1 rounded-full bg-brand-orange px-1.5 text-xs font-bold text-background">{count}</span>
            </div>
            <span className="hidden font-bold md:inline">Cart</span>
          </Link>
        </div>
      </div>
      <div className="bg-brand-bar-2 text-foreground">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-1 overflow-x-auto px-3 py-1 text-sm">
          <button className="flex items-center gap-1 rounded border border-transparent px-2 py-1 font-bold hover:border-foreground/50">
            <Menu className="h-4 w-4" /> All
          </button>
          {CATS.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="whitespace-nowrap rounded border border-transparent px-2 py-1 hover:border-foreground/50">
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
