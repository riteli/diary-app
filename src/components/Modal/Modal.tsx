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

  const [diaryDate, setDiaryDate] = useState(today);
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');

  useEffect(() => {
    if (editTarget) {
      setDiaryDate(editTarget.date);
      setDiaryTitle(editTarget.title);
      setDiaryContent(editTarget.content);
    }
  }, [editTarget]);

  const resetForm = () => {
    setDiaryDate(today);
    setDiaryTitle('');
    setDiaryContent('');
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDiaryDate(event.target.value);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDiaryTitle(event.target.value);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDiaryContent(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const diaryObject = {
      id: editTarget?.id ?? crypto.randomUUID(),
      date: diaryDate,
      title: diaryTitle,
      content: diaryContent,
    };
    saveDiary(diaryObject);

    if (ref && 'current' in ref && ref.current) {
      ref.current.close();
    }
    if (editTarget) {
      resetTarget();
    }
    resetForm();
  };

  const handleClose = () => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.close();
    }
    if (editTarget) {
      resetTarget();
    }
    resetForm();
  };

  return (
    <dialog ref={ref} className={styles.modal}>
      <button
        className={clsx(styles.button, styles.buttonClose)}
        type="button"
        aria-label="閉じる"
        onClick={handleClose}
      >
        <MdOutlineCancel size={48} />
      </button>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.title}>日記を書く</legend>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="diaryDate">
              日付
            </label>
            <input
              className={styles.formControl}
              type="date"
              name="diaryDate"
              id="diaryDate"
              value={diaryDate}
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
              value={diaryTitle}
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
              value={diaryContent}
              onChange={handleContentChange}
            ></textarea>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.button} type="submit">
              保存する
            </button>
            <button
              className={styles.button}
              type="button"
              onClick={handleClose}
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
