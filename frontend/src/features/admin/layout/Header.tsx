import styles from './Header.module.css';
import SearchInput from '../components/SearchInput';

type Props = { title?: string };

export default function Header({ title }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title ?? 'Panel de administración'}</h1>
      <div className={styles.actions}>
        <SearchInput placeholder="Buscar..." onChange={() => {}} />
        <div className={styles.user}>Admin</div>
      </div>
    </header>
  );
}