export function Footer() {
  return (
    <footer className="mt-12 bg-brand-bar-2 text-foreground/80">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        {[
          { h: "Get to Know Us", l: ["About", "Careers", "Press"] },
          { h: "Make Money", l: ["Sell on Bengal Store", "Affiliate", "Advertise"] },
          { h: "Payment", l: ["Cards", "Shop with points", "Gift cards"] },
          { h: "Help", l: ["Your account", "Shipping", "Returns"] },
        ].map((c) => (
          <div key={c.h}>
            <h4 className="mb-2 font-bold text-foreground">{c.h}</h4>
            <ul className="space-y-1 text-sm">
              {c.l.map((x) => <li key={x} className="text-muted-foreground hover:underline">{x}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bengal Store
      </div>
    </footer>
  );
}
