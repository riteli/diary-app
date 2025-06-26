import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { Diary } from '../types/diary';

export const saveDiaryToFirestore = async (userId: string, diary: Diary) => {
  const diaryDocRef = doc(db, 'users', userId, 'diaries', diary.id);
  await setDoc(diaryDocRef, diary);
};
