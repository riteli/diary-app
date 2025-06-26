import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth';
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
  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google login error:', error);
      alert('ログインに失敗しました');
    }
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    signOut(auth);
  }, []);

  return { user, isLoading, login, logout };
};
