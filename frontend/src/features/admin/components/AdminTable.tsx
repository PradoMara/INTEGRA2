import styles from './AdminTable.module.css';
import { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  title: string;
  render?: (item: T) => ReactNode;
  width?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  rowKey?: (item: T) => string | number;
};

export default function AdminTable<T>({ columns, data, onRowClick, rowKey }: Props<T>) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width }}>{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            const key = rowKey ? rowKey(item) : idx;
            return (
              <tr key={String(key)} className={onRowClick ? styles.clickable : ''} onClick={() => onRowClick?.(item)}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.render ? c.render(item) : (item as any)[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}