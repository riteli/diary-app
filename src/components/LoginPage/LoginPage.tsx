import { useAuth } from '../../hooks/useAuth';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  const { user, login } = useAuth();

  const isProcessing = !!user;

  return (
    <main className={styles.container}>
      <h1 className={styles.logo}>
        <img
          src="/images/app-logo.png"
          width={238}
          height={46}
          alt="シンプル日記"
        />
      </h1>
      <p className={styles.description}>あなたの毎日を記録する場所</p>
      <button
        className={styles.loginButton}
        type="button"
        onClick={login}
        disabled={isProcessing} //ログイン処理中は無効化
      >
        Googleでログイン
      </button>
    </main>
  );
};
