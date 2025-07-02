import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginPage.module.scss';
import clsx from 'clsx';
import appLogo from '/images/app-logo.png';

export const LoginPage = () => {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const PASSWORD_MIN_LENGTH = 10;
  const isProcessing = !!user;

  const toggleView = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoginView(!isLoginView);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isLoginView) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      setAuthError('');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setAuthError('このメールアドレスは既に使用されています。');
            break;
          case 'auth/wrong-password':
            setAuthError('パスワードが間違っています。');
            break;
          case 'auth/user-not-found':
            setAuthError('このメールアドレスは登録されていません。');
            break;
          default:
            setAuthError('ログインまたは登録に失敗しました。');
        }
      } else {
        setAuthError('予期せぬエラーが発生しました。');
      }
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.logo}>
        <img src={appLogo} width={238} height={46} alt="シンプル日記" />
      </h1>
      <p className={styles.description}>あなたの毎日を記録する場所</p>

      <form action="#" onSubmit={handleSubmit}>
        <button
          className={clsx(styles.button, styles.loginButton)}
          type="button"
          onClick={signInWithGoogle}
          disabled={isProcessing}
        >
          Googleでログイン
        </button>

        <div className={styles.emailAuthContainer}>
          <input
            className={styles.inputEmail}
            type="email"
            name="email"
            id="inputEmail"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.inputPassword}
            type="password"
            name="password"
            id="inputPassword"
            placeholder={`パスワードを入力(${PASSWORD_MIN_LENGTH}文字以上)`}
            minLength={PASSWORD_MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLoginView ? 'current-password' : 'new-password'}
          />
          <button
            className={clsx(styles.button, styles.loginButton)}
            type="submit"
            disabled={
              isProcessing ||
              (!isLoginView && password.length < PASSWORD_MIN_LENGTH)
            }
          >
            {isLoginView ? 'メールアドレスでログイン' : 'メールアドレスで登録'}
          </button>

          <div className={styles.errorMessageContainer}>
            {authError && <p className={styles.errorMessage}>{authError}</p>}
          </div>

          {isLoginView ? (
            <div className={styles.toggleViewContainer}>
              <p>アカウントをお持ちでないですか？</p>
              <button
                className={styles.toggleButton}
                type="button"
                onClick={toggleView}
              >
                新規登録
              </button>
            </div>
          ) : (
            <div className={styles.toggleViewContainer}>
              <p>アカウントをお持ちですか？</p>
              <button
                className={styles.toggleButton}
                type="button"
                onClick={toggleView}
              >
                ログイン
              </button>
            </div>
          )}
        </div>
      </form>
    </main>
  );
};
