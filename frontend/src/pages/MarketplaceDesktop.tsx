import { Link } from "react-router-dom";
import { Sidebar, PublicationCard } from "../components";
import user from "../assets/img/user_default.png";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "Todo",
  "Electonica",
  "Musica",
  "Deportes",
  "Entretenimiento",
  "Servicios",
] as const;

type Category = (typeof CATEGORIES)[number];

const RAW_ITEMS: Publication[] = [
  { id: "1", title: "Andrew Ng", author: "Maritta Bris", buyNow: 10000, sellerSales: 124, sellerRating: 4.6, stock: 25 },
  { id: "2", title: "Battle for Digital", author: "Ham Chowo", buyNow: 14500, sellerSales: 88, sellerRating: 4.2, stock: 5 },
  { id: "3", title: "A Rare Path", author: "Langke Zambo", buyNow: 18500, sellerSales: 51, sellerRating: 4.9, stock: 0 },
  { id: "4", title: "Software Secret Algorithms", author: "Shirai Subaru", buyNow: 10990, sellerSales: 12, sellerRating: 3.8, stock: 12 },
  { id: "5", title: "Wait Before Buying", author: "Azah Anyeri", buyNow: 15000, sellerSales: 203, sellerRating: 4.7, stock: 2 },
  { id: "6", title: "Blazon Killer", author: "Ludmila Vielsary", buyNow: 20000, sellerSales: 67, sellerRating: 4.3, stock: 18 },
  { id: "7", title: "Block Bulk Search", author: "Saima Fonesca", buyNow: 15000, sellerSales: 39, sellerRating: 4.1, stock: 7 },
  { id: "8", title: "Repeal of Online Privacy", author: "Yi HanYing", buyNow: 14500, sellerSales: 19, sellerRating: 3.9, stock: 0 },
];

export default function MarketplaceDesktop() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Category>("Todo");
  const [sort, setSort] = useState<"Relevance" | "Price ↑" | "Price ↓">("Relevance");

  const items = useMemo(() => {
    let data = RAW_ITEMS.filter((i) =>
      [i.title, i.author].join(" ").toLowerCase().includes(query.toLowerCase())
    );
    if (tab !== "Todo") data = data.filter((i) => i.title === tab);
    if (sort === "Price ↑") data = [...data].sort((a, b) => a.buyNow - b.buyNow);
    if (sort === "Price ↓") data = [...data].sort((a, b) => b.buyNow - a.buyNow);
    return data;
  }, [query, tab, sort]);

  return (
    <div className="w-full min-h-dvh grid grid-cols-[260px_1fr] bg-slate-100 text-slate-900 overflow-x-hidden">
      <Sidebar active="marketplace" />

      <div className="grid grid-rows-[64px_1fr] min-h-full min-w-0 overflow-x-clip">
        <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 bg-white border-b">
          <input
            className="w-[80%] h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            placeholder="Buscar en el Marketplace"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Link
              to="/publicar"
              className="inline-flex h-10 items-center rounded-full border-2 border-violet-600 bg-violet-600 px-4 font-extrabold text-white hover:brightness-95 active:scale-[0.99] transition"
            >
              Publicar
            </Link>
            <Link to="/perfil" className="size-8 rounded-full bg-slate-300 overflow-hidden">
              <img src={user} alt="Perfil" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        <div className="w-full max-w-[1600px] min-w-0 mx-auto px-6 pt-5 grid gap-3">
          <div className="flex items-center justify-between">
            <h1 className="m-0 text-2xl font-bold">Explorar</h1>
          </div>

          {/* Tabs (demo simple) */}
          <div className="flex flex-wrap gap-2 mt-1">
            {CATEGORIES.map((c) => {
              const active = tab === c;
              return (
                <button
                  key={c}
                  onClick={() => setTab(c)}
                  className={[
                    "h-9 px-3 rounded-full border text-sm font-semibold transition",
                    active
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <main className="grid gap-6 pt-2 grid-cols-[repeat(auto-fit,minmax(280px,320px))] justify-start content-start">
            {items.map((it) => (
              <PublicationCard key={it.id} item={it} />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}