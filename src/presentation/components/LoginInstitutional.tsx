import img from "/favicon.png";
import styles from './Login.module.css'

type Props = {
  onOAuth?: () => void | Promise<void>
}

const ALUMNO_DOMAIN = "alu.uct.cl"
const PROFESOR_DOMAIN = "uct.cl"

export default function LoginInstitutional({ onOAuth }: Props) {
  return (
    <div className={styles.heroBg}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={img} alt="Logo UCT" className={styles.logoImg} loading="lazy" decoding="async" />
          </div>
          <h2 className={styles.title}>Iniciar sesión</h2>
          <span className={styles.badge}>Solo cuentas @{PROFESOR_DOMAIN} @{ALUMNO_DOMAIN}</span>
        </header>

        <button className={styles.googleBtn} onClick={() => { if (onOAuth) onOAuth() }}>
          <GoogleIcon />
          <span>Continuar con Google</span>
        </button>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
  <svg className={styles.g} viewBox="0 0 533.5 544.3" aria-hidden>
      <path fill="#EA4335" d="M533.5 278.4c0-18.6-1.6-37-5-54.8H272v103.8h147.2c-6.3 34.5-25 63.7-53.2 83.2l86 66.7c50.3-46.4 81.5-114.7 81.5-198.9z"/>
      <path fill="#34A853" d="M272 544.3c72.9 0 134.3-24.1 179-65.4l-86-66.7c-23.8 16-54.2 25.4-93 25.4-71.4 0-132-48.1-153.8-112.6l-89.4 69.3C66.7 482.8 161.5 544.3 272 544.3z"/>
      <path fill="#4A90E2" d="M118.2 324.9c-10.8-32.4-10.8-68.1 0-100.5l-89.4-69.3c-39.5 78.9-39.5 160.2 0 239.1l89.4-69.3z"/>
      <path fill="#FBBC05" d="M272 106.2c39.6-.6 77.9 14.3 106.8 41l79.6-79.6C413.3 22.8 345.9-.2 272 0 161.5 0 66.7 61.5 28.8 180.8l89.4 69.3C140 186.6 200.6 106.2 272 106.2z"/>
    </svg>
  )
}
