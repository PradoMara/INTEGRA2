import React from 'react'
import styles from './Header.module.css'

// En el futuro estos enlaces se reemplazarán por <NavLink /> de react-router-dom
// por ahora son anchors simples con href="#" a modo de placeholder.
export const Header: React.FC = () => {
  return (
    <header className={styles.headerRoot}>
      <div className={styles.headerInner}>
        <div className={styles.logoArea}>
          <div className={styles.logoPlaceholder} aria-hidden="true" />
          <span>Marketplace UCT</span>
        </div>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            <li><a className={styles.navLink} href="#">Inicio</a></li>
            <li><a className={styles.navLink} href="#">Crear Publicación</a></li>
            <li><a className={styles.navLink} href="#">Mis Publicaciones</a></li>
          </ul>
        </nav>

        <form className={styles.searchBar} role="search" onSubmit={(e) => { e.preventDefault(); /* TODO: implementar búsqueda */ }}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar publicaciones..."
            aria-label="Buscar"
            name="q"
            autoComplete="off"
          />
        </form>

        <div className={styles.actions}>
          <a href="#perfil" className={styles.profileLink} aria-label="Perfil usuario">
            <span className={styles.profileAvatar} aria-hidden="true" />
            <span>Perfil</span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
