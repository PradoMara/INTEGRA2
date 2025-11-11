import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Header.module.css'
import LogoMUCT from '@/assets/img/logoMUCT.png'
import UserDefault from '@/assets/img/user_default.png'
import { LogoutUser } from '@/features/shared/Shared.Types/LogoutUser'

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const body = document.body
    if (open) {
      const prev = (body as any).style.overflow
      body.setAttribute('data-prev-overflow', prev)
      ;(body as any).style.overflow = 'hidden'
      setTimeout(() => { searchInputRef.current?.focus() }, 0)
    } else {
      const prev = body.getAttribute('data-prev-overflow') || ''
      ;(body as any).style.overflow = prev
      body.removeAttribute('data-prev-overflow')
    }
    return () => {
      ;(body as any).style.overflow = body.getAttribute('data-prev-overflow') || ''
      body.removeAttribute('data-prev-overflow')
    }
  }, [open])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const toggle = document.getElementById('menu-toggle-btn')
        if (toggle && toggle.contains(e.target as Node)) return
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const handleLogout = () => {
    try {
      const logoutUseCase = new LogoutUser()
      logoutUseCase.execute()
      
      // Cerrar menú móvil si está abierto
      setOpen(false)
      
      // Redireccionar al login
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Hubo un error al cerrar sesión. Por favor, intenta nuevamente.')
    }
  }

  return (
    <motion.header 
      className={styles.headerRoot}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.headerInner}>
        <motion.button
          id="menu-toggle-btn"
          type="button"
          className={styles.menuToggle}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu-panel"
          data-open={open}
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.burger} />
        </motion.button>

        <motion.div 
          className={styles.logoArea}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >      
          <motion.div 
            className={styles.logoPlaceholder} 
            aria-hidden="true"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <img
              src={LogoMUCT}
              alt="Marketplace UCT"
              className={styles.logoImg}
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
          <span>Marketplace UCT</span>
        </motion.div>

        <nav className={styles.nav} aria-label="Principal">
          <motion.ul 
            className={styles.navList}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { to: '/home', label: 'Inicio' },
              { to: '/crear', label: 'Crear Publicación' },
              { to: '/mis-publicaciones', label: 'Mis Publicaciones' },
              { to: '/Ayuda', label: 'Ayuda' },
              { to: '/about', label: 'Acerca de' }
            ].map((link, i) => (
              <motion.li
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              >
                <NavLink className={styles.navLink} to={link.to}>
                  {link.label}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        <motion.div 
          className={styles.actions}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink to="/perfil" className={styles.profileLink} aria-label="Perfil usuario">
              <img 
                src={UserDefault} 
                alt="Usuario" 
                className={styles.profileAvatar}
              />
              <span>Perfil</span>
            </NavLink>
          </motion.div>
          
          <motion.button
            onClick={handleLogout}
            className={styles.logoutButton}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.logoutAvatar} aria-hidden="true" />
            <span>Cerrar sesión</span>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu-panel"
            ref={panelRef}
            className={styles.mobilePanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.mobilePanelInner}>
              <nav aria-label="Menú móvil principal">
                <ul className={styles.mobileNavList}>
                  {[
                    { to: '/home', label: 'Inicio' },
                    { to: '/crear', label: 'Crear Publicación' },
                    { to: '/mis-publicaciones', label: 'Mis Publicaciones' },
                    { to: '/ayuda', label: 'Ayuda' },
                    { to: '/about', label: 'Acerca de' }
                  ].map((link, i) => (
                    <motion.li
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <NavLink to={link.to} onClick={() => setOpen(false)}>
                        {link.label}
                      </NavLink>
                    </motion.li>
                  ))}
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
              <motion.div 
                className={styles.mobilePanelFooter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <NavLink to="/perfil" className={styles.profileLink} aria-label="Perfil usuario" onClick={() => setOpen(false)}>
                  <img 
                    src={UserDefault} 
                    alt="Usuario" 
                    className={styles.profileAvatar}
                  />
                  <span>Perfil</span>
                </NavLink>
                
                <button
                  onClick={handleLogout}
                  className={styles.logoutButtonMobile}
                  aria-label="Cerrar sesión"
                >
                  <span className={styles.logoutAvatar} aria-hidden="true" />
                  <span>Cerrar sesión</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
