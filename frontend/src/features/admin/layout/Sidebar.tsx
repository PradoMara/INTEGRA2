import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Admin</div>
      <nav className={styles.nav}>
        <a className={styles.link} href="#dashboard">Dashboard</a>
        <a className={styles.link} href="#users">Usuarios</a>
        <a className={styles.link} href="#posts">Publicaciones</a>
        <a className={styles.link} href="#market">Marketplace</a>
        <a className={styles.link} href="#settings">Ajustes</a>
      </nav>
    </aside>
  );
}