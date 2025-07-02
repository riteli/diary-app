import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../libs/firebase';
// ユーザーの認証状態と、ログイン/ログアウト処理を管理するフック
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChangedで認証状態の変更を監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // アンマウント時に監視を解除
    return () => unsubscribe();
  }, []);

  // Googleログイン処理
  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }, []);

  // emailサインアップ処理
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Firebase Error Code:', error);
      } else {
        console.error('An unexpected error occurred:', error);
      }
      throw error;
    }
  }, []);

  // emailログイン処理
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Firebase Error Code:', error);
      } else {
        console.error('An unexpected error occurred:', error);
      }
      throw error;
    }
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    signOut(auth);
  }, []);

  //プロフィールの変更
  const updateDisplayName = useCallback(async (newName: string) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newName,
        });
        setUser({ ...auth.currentUser });
      } catch (error) {
        console.error('Display name update error:', error);
        throw error;
      }
    } else {
      throw new Error('User not authenticated.');
    }
  }, []);

  return {
    user,
    isLoading,
    signInWithGoogle,
    signUp,
    signIn,
    logout,
    updateDisplayName,
  };
};
