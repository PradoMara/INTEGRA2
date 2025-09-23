import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logouct.png";
import bg from "../assets/img/uctregister.jpg";

const ALUMNO_DOMAIN = "alu.uct.cl";
const PROFESOR_DOMAIN = "uct.cl"; // <-- ajústalo si cambia

export default function LoginInstitutional() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-dvh w-screen overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Fondo */}
      <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }} />
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenido */}
      <div className="relative z-10 grid min-h-dvh place-items-center p-4">
        <div className="w-[min(420px,92vw)] rounded-2xl bg-white/40 p-7 shadow-[0_10px_30px_rgba(0,0,0,0.07)] backdrop-blur-sm grid gap-3">
          <header className="grid gap-2.5 justify-items-start">
            <div className="size-11 rounded-xl grid place-items-center bg-white/70">
              <img
                src={logo}
                alt="Logo UCT"
                className="max-w-[70%] max-h-[70%] object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h2 className="m-0 text-[22px] font-bold text-slate-900">Iniciar sesión</h2>
            <span className="inline-block rounded-full bg-black/50 px-2.5 py-1 text-xs font-bold text-white font-serif">
              Solo cuentas @{PROFESOR_DOMAIN} @{ALUMNO_DOMAIN}
            </span>
          </header>

          <button
            type="button"
            onClick={() => navigate("/marketplace")}
            className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 font-bold text-slate-900 shadow-[0_2px_0_rgba(0,0,0,0.03)] hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-violet-400/40 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 533.5 544.3" aria-hidden>
      <path fill="#EA4335" d="M533.5 278.4c0-18.6-1.6-37-5-54.8H272v103.8h147.2c-6.3 34.5-25 63.7-53.2 83.2l86 66.7c50.3-46.4 81.5-114.7 81.5-198.9z"/>
      <path fill="#34A853" d="M272 544.3c72.9 0 134.3-24.1 179-65.4l-86-66.7c-23.8 16-54.2 25.4-93 25.4-71.4 0-132-48.1-153.8-112.6l-89.4 69.3C66.7 482.8 161.5 544.3 272 544.3z"/>
      <path fill="#4A90E2" d="M118.2 324.9c-10.8-32.4-10.8-68.1 0-100.5l-89.4-69.3c-39.5 78.9-39.5 160.2 0 239.1l89.4-69.3z"/>
      <path fill="#FBBC05" d="M272 106.2c39.6-.6 77.9 14.3 106.8 41l79.6-79.6C413.3 22.8 345.9-.2 272 0 161.5 0 66.7 61.5 28.8 180.8l89.4 69.3C140 186.6 200.6 106.2 272 106.2z"/>
    </svg>
  );
}
