import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logouct.png";

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */
const CLP = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

function gradient(seed: string): React.CSSProperties {
  const hue = Math.abs(
    seed.split("").reduce((a, c) => (a * 33 + c.charCodeAt(0)) | 0, 7)
  ) % 360;
  return {
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg,hsl(${hue} 70% 85%),hsl(${(hue + 40) % 360} 70% 75%))`,
  };
}

/* -------------------------------------------------------------------------- */
/*                                    data                                    */
/* -------------------------------------------------------------------------- */
const profile = {
  name: "Nombre",
  email: "nombre@alu.uct.cl",
  campus: "Campus San Juan Pablo II",
  rating: 4.6,
};

const reviews = [
  { id: "r1", author: "Nombre", rating: 5 },
  { id: "r2", author: "Nombre", rating: 3.5 },
  { id: "r3", author: "Nombre", rating: 5 },
];

const publications = [
  { id: "p1", title: "Publicación", price: 15000, stock: 10 },
  { id: "p2", title: "Publicación", price: 15000, stock: 0 },
  { id: "p3", title: "Publicación", price: 15000, stock: 10 },
];

/* -------------------------------------------------------------------------- */
/*                                 main view                                  */
/* -------------------------------------------------------------------------- */
export default function ProfilePage() {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr] bg-slate-100 text-slate-900">
      {/* Sidebar (parche: fondo llega al final; contenido sticky) */}
      <aside className="relative bg-white border-r">
        <div className="sticky top-0 h-dvh flex flex-col gap-4 p-4">
          <div className="flex items-center gap-2.5 px-1 py-1.5">
            <div className="size-9 rounded-xl grid place-items-center bg-slate-50">
              <img
                src={logo}
                alt="Logo UCT"
                className="max-w-[70%] max-h-[70%] object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <strong className="font-extrabold">MarketUCT</strong>
          </div>

          <nav className="grid gap-1.5">
            <Link
              to="/marketplace"
              className="px-3 py-2 rounded-xl text-slate-500 font-semibold no-underline bg-violet-50 text-violet-600"
            >
              MarketPlace
            </Link>
            <button className="text-left px-3 py-2 rounded-xl text-slate-500 font-semibold hover:bg-violet-50 hover:text-violet-600">
              Chats
            </button>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        <div className="mx-auto w-full max-w-[1150px] p-6">
          {/* Header */}
          <section className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5">
            <div className="grid grid-cols-[min(220px,30vw)_1fr] gap-6 items-center">
              <div className="aspect-square rounded-full bg-slate-200 grid place-items-center overflow-hidden">
                {/* avatar placeholder */}
                <svg className="w-3/5 opacity-60" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5Zm0 2c-4.4 0-8 2.7-8 6v1h16v-1c0-3.3-3.6-6-8-6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="m-0 text-2xl font-bold">{profile.name}</h1>
                  <div className="inline-flex items-center gap-2">
                    <RatingStars rating={profile.rating} size={18} />
                    <span className="text-sm font-semibold text-slate-600">
                      {profile.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="m-0 text-[15px] text-slate-700">{profile.email}</p>
                <p className="m-0 text-[15px] text-slate-700">{profile.campus}</p>
              </div>
            </div>
          </section>

          {/* Valoraciones */}
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4">Valoraciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl bg-white p-3 ring-1 ring-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-slate-200 grid place-items-center">
                      <svg className="w-5 opacity-60" viewBox="0 0 24 24" aria-hidden>
                        <path
                          d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5Zm0 2c-4.4 0-8 2.7-8 6v1h16v-1c0-3.3-3.6-6-8-6Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="grid">
                      <span className="text-sm font-semibold">{r.author}</span>
                      <RatingStars rating={r.rating} />
                    </div>
                  </div>
                  <span className="text-slate-300">›</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tus publicaciones */}
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4">Tus Publicaciones</h2>

            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,300px))]">
              {publications.map((p) => (
                <article
                  key={p.id}
                  className="rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200 flex flex-col"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <div style={gradient(p.id)} />
                  </div>

                  <div className="p-4 grid gap-3">
                    <h3 className="m-0 text-base font-bold">{p.title}</h3>

                    <div className="grid gap-1 text-[13px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Disponibilidad</span>
                        {p.stock === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-900 font-semibold">
                            Agotado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-800 font-semibold">
                            {p.stock} disponibles
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Precio</span>
                        <span className="font-semibold">{CLP(p.price)}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <Link
                        to={`/editar/${p.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  subviews                                  */
/* -------------------------------------------------------------------------- */
function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="inline-flex items-center gap-1 leading-none">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} kind="full" size={size} />
      ))}
      {half === 1 && <Star kind="half" size={size} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} kind="empty" size={size} />
      ))}
    </span>
  );
}

function Star({ kind, size = 14 }: { kind: "full" | "half" | "empty"; size?: number }) {
  const common = {
    className: "inline-block",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as any,
  } as const;
  if (kind === "empty")
    return (
      <svg {...common} fill="none" stroke="#d1d5db" strokeWidth={1.6}>
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
      </svg>
    );
  if (kind === "half")
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="half" x1="0" x2="1">
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path fill="url(#half)" stroke="#f59e0b" strokeWidth={0.4} d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
      </svg>
    );
  return (
    <svg {...common} fill="#f59e0b">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  );
}
