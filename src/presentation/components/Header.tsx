import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

// En el futuro estos enlaces se reemplazarán por <NavLink /> de react-router-dom
// por ahora son anchors simples con href="#" a modo de placeholder.
export const Header: React.FC = () => {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Bloquear scroll del body cuando el panel móvil está abierto
  useEffect(() => {
    const body = document.body
    if (open) {
      const prev = body.style.overflow
      body.setAttribute('data-prev-overflow', prev)
      body.style.overflow = 'hidden'
      // Enfocar campo de búsqueda en móvil (esperar microtask para asegurar montaje)
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    } else {
      const prev = body.getAttribute('data-prev-overflow') || ''
      body.style.overflow = prev
      body.removeAttribute('data-prev-overflow')
    }
    return () => {
      body.style.overflow = body.getAttribute('data-prev-overflow') || ''
      body.removeAttribute('data-prev-overflow')
    }
  }, [open])

  // Cerrar si se hace click afuera
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // ignorar si se clicó el botón toggle
        const toggle = document.getElementById('menu-toggle-btn')
        if (toggle && toggle.contains(e.target as Node)) return
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <header className={styles.headerRoot}>
      <div className={styles.headerInner}>
        <button
          id="menu-toggle-btn"
          type="button"
            className={styles.menuToggle}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu-panel"
          data-open={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={styles.burger} />
        </button>

        <div className={styles.logoArea}>
          <div className={styles.logoPlaceholder} aria-hidden="true" />
          <span>Marketplace UCT</span>
        </div>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            <li><NavLink className={styles.navLink} to="/">Inicio</NavLink></li>
            <li><NavLink className={styles.navLink} to="/crear">Crear Publicación</NavLink></li>
            <li><NavLink className={styles.navLink} to="/mis-publicaciones">Mis Publicaciones</NavLink></li>
          </ul>
        </nav>

        <form className={styles.searchBar} role="search" onSubmit={(e) => { e.preventDefault(); }}>
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
          <NavLink to="/perfil" className={styles.profileLink} aria-label="Perfil usuario">
            <span className={styles.profileAvatar} aria-hidden="true" />
            <span>Perfil</span>
          </NavLink>
        </div>
      </div>

      {/* Panel móvil */}
      <div
        id="mobile-menu-panel"
        ref={panelRef}
        className={`${styles.mobilePanel} ${open ? styles.panelOpen : ''}`}
      >
        <div className={styles.mobilePanelInner}>
          <nav aria-label="Menú móvil principal">
            <ul className={styles.mobileNavList}>
              <li><NavLink to="/" onClick={() => setOpen(false)}>Inicio</NavLink></li>
              <li><NavLink to="/crear" onClick={() => setOpen(false)}>Crear Publicación</NavLink></li>
              <li><NavLink to="/mis-publicaciones" onClick={() => setOpen(false)}>Mis Publicaciones</NavLink></li>
            </ul>
          </nav>
          <div className="mobileSearch">
            <form className={styles.searchBar} role="search" onSubmit={(e) => { e.preventDefault(); setOpen(false) }}>
              <span className={styles.searchIcon} aria-hidden="true">🔍</span>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Buscar publicaciones..."
                aria-label="Buscar"
                name="q"
                autoComplete="off"
                ref={searchInputRef}
              />
            </form>
          </div>
          <div className={styles.mobilePanelFooter}>
            <NavLink to="/perfil" className={styles.profileLink} aria-label="Perfil usuario" onClick={() => setOpen(false)}>
              <span className={styles.profileAvatar} aria-hidden="true" />
              <span>Perfil</span>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
