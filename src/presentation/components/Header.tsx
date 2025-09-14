import React from 'react'
import styles from './Header.module.css'

export const Header: React.FC = () => {
  return (
    <header className={styles.headerRoot}>
      <div className={styles.headerInner}>
        <div className={styles.logoArea}>
          <div className={styles.logoPlaceholder}>LOGO</div>
          <span>Nombre Plataforma</span>
        </div>

        <nav className={styles.nav} aria-label="Principal">
          <div className={styles.navItemPlaceholder}></div>
          <div className={styles.navItemPlaceholder}></div>
          <div className={styles.navItemPlaceholder}></div>
        </nav>

        <div className={styles.actions}>
          <button className={styles.actionBtn} type="button">Acceder</button>
          <button className={styles.actionBtn} type="button">Registro</button>
        </div>
      </div>
    </header>
  )
}

export default Header
