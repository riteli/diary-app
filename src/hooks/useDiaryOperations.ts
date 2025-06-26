import { useCallback, useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../libs/firebase';
import { saveDiaryToFirestore } from '../libs/firestoreDiary';
import type { Diary } from '../types/diary';

interface UseDiaryOperationsReturn {
  diaries: Diary[];
  diaryToEdit: Diary | null;
  isLoading: boolean;
  error: string | null;
  saveDiary: (diary: Diary) => Promise<void>;
  deleteDiary: (diaryId: string) => Promise<void>;
  setDiaryToEdit: (diary: Diary | null) => void;
}

export const useDiaryOperations = (
  userId: string | undefined
): UseDiaryOperationsReturn => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [diaryToEdit, setDiaryToEdit] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firestoreから日記データを取得
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const diariesColRef = collection(db, 'users', userId, 'diaries');

    const unsubscribe = onSnapshot(
      diariesColRef,
      (snapshot) => {
        try {
          const fetchedDiaries = snapshot.docs.map(
            (doc) => doc.data() as Diary
          );
          setDiaries(fetchedDiaries);
          setError(null);
        } catch (err) {
          setError('日記の取得に失敗しました');
          console.error('Diary fetch error:', err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError('日記の取得に失敗しました');
        setIsLoading(false);
        console.error('Firestore listener error:', err);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // 日記の保存
  const saveDiary = useCallback(
    async (diary: Diary): Promise<void> => {
      if (!userId) {
        throw new Error('ユーザーがログインしていません');
      }

      try {
        await saveDiaryToFirestore(userId, diary);
      } catch (err) {
        const errorMessage = '日記の保存に失敗しました';
        setError(errorMessage);
        console.error('Save diary error:', err);
        throw new Error(errorMessage);
      }
    },
    [userId]
  );

  // 日記の削除
  const deleteDiary = useCallback(
    async (diaryId: string): Promise<void> => {
      if (!userId) {
        throw new Error('ユーザーがログインしていません');
      }

      try {
        const diaryDocRef = doc(db, 'users', userId, 'diaries', diaryId);
        await deleteDoc(diaryDocRef);
      } catch (err) {
        const errorMessage = '日記の削除に失敗しました';
        setError(errorMessage);
        console.error('Delete diary error', err);
      }
    },
    [userId]
  );

  return {
    diaries,
    diaryToEdit,
    isLoading,
    error,
    saveDiary,
    deleteDiary,
    setDiaryToEdit,
  };
};
