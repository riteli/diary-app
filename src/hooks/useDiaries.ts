import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { useAuth } from './useAuth';
import { db } from '../libs/firebase';
import type { Diary } from '../types/diary';

// 日記データと関連操作を管理するカスタムフック
export const useDiaries = () => {
  const { user } = useAuth();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diaryToEdit, setDiaryToEdit] = useState<Diary | null>(null);

  useEffect(() => {
    // ユーザー認証がない場合は処理を中断
    if (!user) {
      setIsLoading(false);
      setDiaries([]);
      return;
    }

    setIsLoading(true);
    // Firestoreから日記データを取得
    const diariesColRef = collection(db, 'users', user.uid, 'diaries');
    const q = query(diariesColRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const fetchedDiaries = snapshot.docs.map(
            (doc) => doc.data() as Diary
          );
          setDiaries(fetchedDiaries);
          setError(null);
        } catch (error) {
          console.error('Failed to parse diary data:', error);
          setError('日記の取得に失敗しました');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Firestore subscription failed:', error);
        setError('日記の取得中にエラーが発生しました');
        setIsLoading(false);
      }
    );

    // クリーンアップ関数
    return () => unsubscribe();
  }, [user]);

  // 日記を保存/更新する
  const saveDiary = useCallback(
    async (diary: Diary) => {
      if (!user) throw new Error('User not authenticated');
      const diaryDocRef = doc(db, 'users', user.uid, 'diaries', diary.id);
      await setDoc(diaryDocRef, diary);
    },
    [user]
  );

  // 日記を削除する
  const deleteDiary = useCallback(
    async (diaryId: string) => {
      if (!user) throw new Error('User not authenticated');
      const diaryDocRef = doc(db, 'users', user.uid, 'diaries', diaryId);
      await deleteDoc(diaryDocRef);
    },
    [user]
  );

  // 編集対象の日記を選択する
  const selectDiaryToEdit = useCallback(
    (diaryId: string | null) => {
      if (diaryId === null) {
        setDiaryToEdit(null);
        return;
      }
      const targetDiary = diaries.find((d) => d.id === diaryId);
      setDiaryToEdit(targetDiary ?? null);
    },
    [diaries]
  );

  return {
    diaries,
    isLoading,
    error,
    diaryToEdit,
    saveDiary,
    deleteDiary,
    selectDiaryToEdit,
  };
};
