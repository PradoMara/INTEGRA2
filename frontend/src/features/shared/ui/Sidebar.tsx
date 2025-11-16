import { NavLink } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import logo from "@/assets/img/logouct.png";
import styles from './Sidebar.module.css';

export function Sidebar({
  active = "marketplace",
  className = "",
}: {
  active?: "marketplace" | "chats" | "terminos" | "ayuda" | "crear" | "foro";
  className?: string;
}) {
  return (
    <motion.aside 
      className={`${styles.sidebar} ${className}`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className={styles.brand}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className={styles.logo}>
          <img
            src={logo}
            alt="Logo UCT"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h1 className={styles.brandText}>MarketUCT</h1>
      </motion.div>

      <nav className={styles.nav}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <NavLink
            to="/home"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            MarketPlace
          </NavLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <NavLink
            to="/chats"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chats
          </NavLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <NavLink
            to="/terminos"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Términos y Condiciones
          </NavLink>
        </motion.div>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;