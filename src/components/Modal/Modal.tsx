import {
  forwardRef,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import clsx from 'clsx';
import styles from './Modal.module.scss';
import type { ModalProps } from '../../types/modalProps';

export const Modal = forwardRef<HTMLDialogElement, ModalProps>((props, ref) => {
  const { saveDiary, resetTarget, editTarget } = props;

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editTarget) {
      setDate(editTarget.date);
      setTitle(editTarget.title);
      setContent(editTarget.content);
    }
  }, [editTarget]);

  const resetForm = () => {
    setDate(today);
    setTitle('');
    setContent('');
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const diaryToSave = {
      id: editTarget?.id ?? crypto.randomUUID(),
      date: date,
      title: title,
      content: content,
    };
    saveDiary(diaryToSave);

    if (ref && 'current' in ref && ref.current) {
      ref.current.close();
    }
    if (editTarget) {
      resetTarget();
    }
    resetForm();
  };

  const handleModalClose = () => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.close();
    }
    if (editTarget) {
      resetTarget();
    }
    resetForm();
  };

  const isEditing = Boolean(editTarget);
  const modalTitle = isEditing ? '日記を編集' : '日記を書く';
  const submitButtonText = isEditing ? '更新する' : '保存する';

  return (
    <dialog ref={ref} className={styles.modal}>
      <button
        className={clsx(styles.button, styles.buttonClose)}
        type="button"
        aria-label="閉じる"
        onClick={handleModalClose}
      >
        <MdOutlineCancel size={48} />
      </button>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.title}>{modalTitle}</legend>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="diaryDate">
              日付
            </label>
            <input
              className={styles.formControl}
              type="date"
              name="diaryDate"
              id="diaryDate"
              value={date}
              onChange={handleDateChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="diaryTitle">
              タイトル
            </label>
            <input
              className={styles.formControl}
              type="text"
              name="diaryTitle"
              id="diaryTitle"
              placeholder="タイトルを入力"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="diaryContent">
              本文
            </label>
            <textarea
              className={clsx(styles.formControl, styles.textarea)}
              name="diaryContent"
              id="diaryContent"
              placeholder="今日の出来事や気持ちを書こう"
              value={content}
              onChange={handleContentChange}
            ></textarea>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.button} type="submit">
              {submitButtonText}
            </button>
            <button
              className={styles.button}
              type="button"
              onClick={handleModalClose}
            >
              キャンセル
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>
  );
});

Modal.displayName = 'Modal';
