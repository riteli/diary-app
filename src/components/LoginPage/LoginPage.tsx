import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  const { user, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <main className={styles.container}>
      <h1 className={styles.logo}>
        <img
          src="../../../public/images/app-logo.png"
          width={238}
          height={46}
          alt="シンプル日記"
        />
      </h1>
      <p className={styles.description}>あなたの毎日を記録する場所</p>
      <button className={styles.loginButton} type="button" onClick={login}>
        Googleでログイン
      </button>
    </main>
  );
};
