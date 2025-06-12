import { useEffect, useRef, useState } from 'react';
import { SlNote } from 'react-icons/sl';
import styles from './App.module.scss';
import type { Diary } from './types/diary';
import { Modal } from './components/Modal/Modal';
import { DiaryCard } from './components/DiaryCard/DiaryCard';

function App() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [diaryToEdit, setDiaryToEdit] = useState<Diary | null>(null);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const diariesArr = localStorage.getItem('diaries');
    if (diariesArr !== null) {
      setDiaries(JSON.parse(diariesArr));
    }
  }, []);

  const openModal = () => {
    modalRef.current?.showModal();
    const diaryTitle = modalRef.current?.querySelector(
      '#diaryTitle'
    ) as HTMLInputElement;
    diaryTitle.focus();
  };

  const resetDiaryToEdit = () => {
    setDiaryToEdit(null);
  };

  const saveDiary = (diaryObject: Diary) => {
    setDiaries((prev) => {
      const isEditing = prev.some((diary) => diary.id === diaryObject.id);
      const updatedDiaries = isEditing
        ? prev.map((diary) =>
            diary.id === diaryObject.id ? diaryObject : diary
          )
        : [...prev, diaryObject];

      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      return updatedDiaries;
    });
  };

  const editDiary = (idToEdit: string) => {
    const selectedDiary = diaries.find((diary) => diary.id === idToEdit);
    if (selectedDiary) {
      setDiaryToEdit(selectedDiary);
    }
    openModal();
  };

  const deleteDiary = (idToDalete: string) => {
    const updatedDiaries = diaries.filter((diary) => diary.id !== idToDalete);
    setDiaries(updatedDiaries);
    localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
  };

  const groupedDiaries = Object.groupBy(
    diaries,
    (diary) => diary.date
  ) as Record<string, Diary[]>;

  return (
    <div className={styles.app}>
      <div className={styles.cardWrapper}>
        {Object.entries(groupedDiaries)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([dateStr, diaries]) => {
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <section className={styles.groupDiaries} key={dateStr}>
                <time className={styles.groupDate} dateTime={dateStr}>
                  {formattedDate}
                </time>
                {diaries.map((diary) => (
                  <DiaryCard
                    key={diary.id}
                    id={diary.id}
                    title={diary.title}
                    date={diary.date}
                    content={diary.content}
                    onEdit={editDiary}
                    onDelete={deleteDiary}
                  />
                ))}
              </section>
            );
          })}
      </div>

      <button
        className={styles.fabButton}
        type="button"
        aria-label="日記を書く"
        onClick={openModal}
      >
        <SlNote size={32} color="white" />
      </button>

      <Modal
        saveDiary={saveDiary}
        editTarget={diaryToEdit}
        resetTarget={resetDiaryToEdit}
        ref={modalRef}
      />
    </div>
  );
}

export default App;
