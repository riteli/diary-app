import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import DiaryApp from './components/DiaryApp/DiaryApp';
import { LoginPage } from './components/LoginPage/LoginPage';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <BrowserRouter>
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
