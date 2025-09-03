import React, { useMemo, useState } from "react";
import styles from "./MarketplaceDesktop.module.css";
import img from "./assets/img/logouct.png";

type Item = {
  id: string;
  title: string;
  author: string;
  category: string;
  buyNow: number;
  sellerSales: number;
  sellerRating: number;
  stock: number;
};

const CATEGORIES = ["Todo", "Electonica", "Musica", "Deportes", "Entretenimiento", "Servicios"] as const;
type Category = typeof CATEGORIES[number];

const RAW_ITEMS: Item[] = [
  { id: "1", title: "Andrew Ng", author: "Maritta Bris", category: "Entretenimiento",    buyNow: 10000,  sellerSales: 124, sellerRating: 4.6, stock: 25 },
  { id: "2", title: "Battle for Digital", author: "Ham Chowo", category: "Deportes", buyNow: 14500,  sellerSales: 88,  sellerRating: 4.2, stock: 5 },
  { id: "3", title: "A Rare Path", author: "Langke Zambo", category: "Electonica",     buyNow: 18500,  sellerSales: 51,  sellerRating: 4.9, stock: 0 },
  { id: "4", title: "Software Secret Algorithms", author: "Shirai Subaru", category: "Servicios", buyNow: 10990, sellerSales: 12,  sellerRating: 3.8, stock: 12 },
  { id: "5", title: "Wait Before Buying", author: "Azah Anyeri", category: "Entretenimiento",   buyNow: 15000,  sellerSales: 203, sellerRating: 4.7, stock: 2 },
  { id: "6", title: "Blazon Killer", author: "Ludmila Vielsary", category: "Musica", buyNow: 20000,  sellerSales: 67,  sellerRating: 4.3, stock: 18 },
  { id: "7", title: "Block Bulk Search", author: "Saima Fonesca", category: "Deportes", buyNow: 15000,  sellerSales: 39,  sellerRating: 4.1, stock: 7 },
  { id: "8", title: "Repeal of Online Privacy", author: "Yi HanYing", category: "Servicios", buyNow: 14500, sellerSales: 19,  sellerRating: 3.9, stock: 0 },
];

export default function MarketplaceDesktop() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Category>("Todo");
  const [sort, setSort] = useState<"Relevance" | "Price ↑" | "Price ↓">("Relevance");

  const items = useMemo(() => {
    let data = RAW_ITEMS.filter((i) =>
      [i.title, i.author, i.category].join(" ").toLowerCase().includes(query.toLowerCase())
    );
    if (tab !== "Todo") data = data.filter((i) => i.category === tab);
    if (sort === "Price ↑") data = [...data].sort((a, b) => a.buyNow - b.buyNow);
    if (sort === "Price ↓") data = [...data].sort((a, b) => b.buyNow - a.buyNow);
    return data;
  }, [query, tab, sort]);

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src={img} alt="Logo UCT" className={styles.logoImg} loading="lazy" decoding="async" />
          </div>
          <strong>MarketUCT</strong>
        </div>

        <nav className={styles.sideNav}>
          <a className={`${styles.sideLink} ${styles.sideLinkActive}`}>MarketPlace</a>
        </nav>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <input
            className={styles.search}
            placeholder="Buscar en el Marketplace"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.topbarRight}>
            <button className={`${styles.button} ${styles.ghost}`}>Publicar</button>
            <div className={styles.avatar} />
          </div>
        </header>

        <div className={styles.container}>
          <div className={styles.headRow}>
            <h1 className={styles.h1}>Explorar</h1>
          </div>

          <div className={styles.tabs}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setTab(c)}
                className={`${styles.tab} ${tab === c ? styles.tabActive : ""}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.toolbar}>
            <div className={styles.sortWrap}>
              <span>Filtrar por</span>
              <select
                className={styles.select}
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                <option>Fecha ↑</option>
                <option>Fecha ↓</option>
                <option>Precio ↑</option>
                <option>Precio ↓</option>
              </select>
            </div>
          </div>

          <main className={styles.grid}>
            {items.map((it) => (
              <article key={it.id} className={styles.card}>
                <div className={styles.media}>
                  <div style={placeholder(it.id)} />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.title}>{it.title}</h3>
                  </div>

                  {/* Stock + Precio */}
                  <div className={styles.priceRow}>
                    <div className={styles.stockCol}>
                      <span className={styles.caption}>Disponibilidad</span>
                      <span
                        className={`${styles.stockPill} ${
                          it.stock === 0
                            ? styles.outOfStock
                            : it.stock <= 5
                            ? styles.lowStock
                            : styles.inStock
                        }`}
                        aria-label={`Stock ${it.stock === 0 ? "agotado" : it.stock}`}
                        title={it.stock === 0 ? "Agotado" : `${it.stock} disponibles`}
                      >
                        {it.stock === 0 ? "Agotado" : `${formatInt(it.stock)} disponibles`}
                      </span>
                    </div>

                    <div className={styles.priceCol}>
                      <span className={styles.caption}>Precio</span>
                      <strong className={styles.price}>{formatCLP(it.buyNow)}</strong>
                    </div>
                  </div>

                  {/* Datos del vendedor */}
                  <div className={styles.sellerRow}>
                    <div className={styles.metaLeft}>
                      <div className={styles.avatarSm} />
                      <span className={styles.author}>{it.author}</span>
                    </div>
                    <div className={styles.metaRight}>
                      <RatingStars rating={it.sellerRating} />
                      <span className={styles.ratingText}>{it.sellerRating.toFixed(1)}</span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.sales}>{formatInt(it.sellerSales)} ventas</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </main>

          <div className={styles.loadMoreWrap}>
            <button className={styles.button}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function placeholder(seed: string): React.CSSProperties {
  const hue = (hash(seed) % 360) | 0;
  return {
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg, hsl(${hue} 70% 88%), hsl(${(hue + 40) % 360} 70% 78%))`,
  };
}
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return Math.abs(h); }

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span className={styles.stars} aria-label={`Seller rating ${rating.toFixed(1)} out of 5`}>
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} kind="full" />)}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} kind="empty" />)}
    </span>
  );
}
function Star({ kind }: { kind: "full" | "empty" }) {
  return (
    <svg className={`${styles.star} ${kind === "full" ? styles.starFull : styles.starEmpty}`} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
    </svg>
  );
}

const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const formatInt = (n: number) =>
  new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(Math.round(n));
