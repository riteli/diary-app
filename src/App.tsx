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
    const storedDiariesJson = localStorage.getItem('diaries');
    if (storedDiariesJson !== null) {
      setDiaries(JSON.parse(storedDiariesJson));
    }
  }, []);

  const openModal = () => {
    modalRef.current?.showModal();
    const diaryTitleInput = modalRef.current?.querySelector(
      '#diaryTitle'
    ) as HTMLInputElement;
    diaryTitleInput.focus();
  };

  const resetEditTarget = () => {
    setDiaryToEdit(null);
  };

  const saveDiary = (diaryToSave: Diary) => {
    setDiaries((prevDiaries) => {
      const isEditing = prevDiaries.some((diary) => diary.id === diaryToSave.id);
      const updatedDiaries = isEditing
        ? prevDiaries.map((diary) =>
            diary.id === diaryToSave.id ? diaryToSave : diary
          )
        : [...prevDiaries, diaryToSave];

      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      return updatedDiaries;
    });
  };

  const handleEditDiary = (diaryIdToEdit: string) => {
    const targetDiary = diaries.find((diary) => diary.id === diaryIdToEdit);
    if (targetDiary) {
      setDiaryToEdit(targetDiary);
    }
    openModal();
  };

  const handleDeleteDiary = (diaryIdToDelete: string) => {
    const diariesAfterDeletion = diaries.filter((diary) => diary.id !== diaryIdToDelete);
    setDiaries(diariesAfterDeletion);
    localStorage.setItem('diaries', JSON.stringify(diariesAfterDeletion));
  };

  const diariesGroupedByDate = Object.groupBy(
    diaries,
    (diary) => diary.date
  ) as Record<string, Diary[]>;

  return (
    <div className={styles.app}>
      <div className={styles.cardWrapper}>
        {Object.entries(diariesGroupedByDate)
          .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
          .map(([dateString, diariesForDate]) => {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <section className={styles.groupDiaries} key={dateString}>
                <time className={styles.groupDate} dateTime={dateString}>
                  {formattedDate}
                </time>
                {diariesForDate.map((diary) => (
                  <DiaryCard
                    key={diary.id}
                    id={diary.id}
                    title={diary.title}
                    date={diary.date}
                    content={diary.content}
                    onEdit={handleEditDiary}
                    onDelete={handleDeleteDiary}
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
        resetTarget={resetEditTarget}
        ref={modalRef}
      />
    </div>
  );
}

export default App;
