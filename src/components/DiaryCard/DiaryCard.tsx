import clsx from 'clsx';
import styles from './DiaryCard.module.scss';

// DiaryCardコンポーネントのProps
interface DiaryCardProps {
  id: string;
  title: string;
  content: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DiaryCard = (props: DiaryCardProps) => {
  const { id, title, content, onEdit, onDelete } = props;

  const handleEdit = () => onEdit(id);
  const handleDelete = () => onDelete(id);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <p className={styles.content}>{content}</p>

      <div className={styles.buttonGroup}>
        <button
          className={clsx(styles.button, styles.editButton)}
          type="button"
          onClick={handleEdit}
        >
          編集
        </button>
        <button
          className={clsx(styles.button, styles.deleteButton)}
          type="button"
          onClick={handleDelete}
        >
          削除
        </button>
      </div>
    </article>
  );
};
