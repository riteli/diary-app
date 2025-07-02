import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import DiaryApp from './components/DiaryApp/DiaryApp';
import { LoginPage } from './components/LoginPage/LoginPage';
import styles from './App.module.scss';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className={styles.loadingText}>読み込み中...</div>;
  }

  return (
    <BrowserRouter basename="/diary-app">
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/*"
          element={user ? <DiaryApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
