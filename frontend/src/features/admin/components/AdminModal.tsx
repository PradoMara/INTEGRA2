import styles from './AdminModal.module.css';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSave?: () => void;
  children?: ReactNode;
};

export default function AdminModal({ open, title, onClose, onSave, children }: Props) {
  if (!open) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose}>Cancelar</button>
          {onSave && <button className={`${styles.btn} ${styles.primary}`} onClick={onSave}>Guardar</button>}
        </div>
      </div>
    </div>
  );
}