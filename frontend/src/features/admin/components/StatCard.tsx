import styles from './StatCard.module.css';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'positive' | 'negative';
};

export default function StatCard({ title, value, subtitle, variant = 'default' }: Props) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{value}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}