import {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import clsx from 'clsx';
import styles from './Modal.module.scss';
import type { Diary } from '../../types/diary';

// ModalコンポーネントのProps
interface ModalProps {
  onSave: (diary: Diary) => Promise<void>;
  onClose: () => void;
  editTarget: Diary | null;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ onSave, onClose, editTarget }, ref) => {
    const today = new Date().toISOString().split('T')[0];

    // フォームの内部状態
    const [date, setDate] = useState(today);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // フォームの値をリセットする内部関数
    const resetForm = useCallback(() => {
      setDate(today);
      setTitle('');
      setContent('');
    }, [today]);

    // 編集対象が変更された場合、フォームに値を設定する
    useEffect(() => {
      if (editTarget) {
        setDate(editTarget.date);
        setTitle(editTarget.title);
        setContent(editTarget.content);
      } else {
        // 新規作成時はフォームをリセット
        resetForm();
      }
    }, [editTarget, resetForm]);

    // 保存処理
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const diaryToSave: Diary = {
          id: editTarget?.id ?? crypto.randomUUID(),
          date,
          title,
          content,
        };
        await onSave(diaryToSave);
      } catch (error) {
        console.error('Save operation failed in Modal:', error);
        alert('保存に失敗しました');
      } finally {
        setIsSubmitting(false);
      }
    };

    // dialogが閉じる時に親のonCloseを呼ぶ
    const handleDialogClose = () => {
      resetForm();
      onClose();
    };

    const isEditing = Boolean(editTarget);
    const modalTitle = isEditing ? '日記を編集' : '日記を書く';
    const submitButtonText = isEditing ? '更新する' : '保存する';
    const isSaveDisabled = isSubmitting || !title.trim() || !content.trim();

    return (
      <dialog ref={ref} className={styles.modal} onClose={handleDialogClose}>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <fieldset className={styles.fieldset} disabled={isSubmitting}>
            <legend className={styles.title}>{modalTitle}</legend>
            <button
              className={clsx(styles.button, styles.buttonClose)}
              type="button"
              aria-label="閉じる"
              onClick={() =>
                (ref as React.RefObject<HTMLDialogElement>)?.current?.close()
              }
            >
              <MdOutlineCancel size={48} />
            </button>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="diaryDate">
                日付
              </label>
              <input
                className={styles.formControl}
                type="date"
                id="diaryDate"
                value={date}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDate(e.target.value)
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="diaryTitle">
                タイトル
              </label>
              <input
                className={styles.formControl}
                type="text"
                id="diaryTitle"
                placeholder="タイトルを入力"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="diaryContent">
                本文
              </label>
              <textarea
                className={clsx(styles.formControl, styles.textarea)}
                id="diaryContent"
                placeholder="今日の出来事や気持ちを書こう"
                value={content}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setContent(e.target.value)
                }
              ></textarea>
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.button}
                type="submit"
                disabled={isSaveDisabled}
              >
                {isSubmitting ? '保存中...' : submitButtonText}
              </button>
              <button
                className={styles.button}
                type="button"
                onClick={() =>
                  (ref as React.RefObject<HTMLDialogElement>)?.current?.close()
                }
              >
                キャンセル
              </button>
            </div>
          </fieldset>
        </form>
      </dialog>
    );
  }
);

Modal.displayName = 'Modal';
