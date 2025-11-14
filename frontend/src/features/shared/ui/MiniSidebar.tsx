import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../assets/img/logouct.png";
import styles from './MiniSidebar.module.css';

type SidebarProps = {
  active?: "marketplace" | "chats";
};

function IconStore(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 10.5V8.8c0-.6.3-1.2.8-1.6l2.9-2.2c.3-.2.6-.3 1-.3h6.6c.4 0 .7.1 1 .3l2.9 2.2c.5.4.8 1 .8 1.6v1.7M5 10.5V19c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-8.5M9 20v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChats(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 15l-3 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9h7M8.5 12h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MiniSidebar({ active = "marketplace" }: SidebarProps) {
  return (
    <motion.aside 
      className={styles.miniSidebar}
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.container}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          <NavLink to="/home" className={styles.logoLink}>
            <img
              src={logo}
              alt="Logo UCT"
              loading="lazy"
              decoding="async"
            />
          </NavLink>
        </motion.div>

        <nav className={styles.nav}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <NavLink
              to="/home"
              title="Marketplace"
              aria-label="Marketplace"
              className={({ isActive }) => `${styles.iconLink} ${isActive ? styles.active : ''}`}
            >
              <IconStore />
              <span className="sr-only">Marketplace</span>
            </NavLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <NavLink
              to="/chats"
              title="Chats"
              aria-label="Chats"
              className={({ isActive }) => `${styles.iconLink} ${isActive ? styles.active : ''}`}
            >
              <IconChats />
              <span className="sr-only">Chats</span>
            </NavLink>
          </motion.div>
        </nav>
      </div>
    </motion.aside>
  );
}

export default MiniSidebar;