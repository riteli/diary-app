import { useRef, useState, type ChangeEvent } from 'react';
import { SlNote } from 'react-icons/sl';
import styles from './DiaryApp.module.scss';
import { useAuth } from '../../hooks/useAuth';
import { useDiaries } from '../../hooks/useDiaries';
import { Modal } from '../../components/Modal/Modal';
import { DiaryCard } from '../../components/DiaryCard/DiaryCard';
import {
  groupDiariesByDate,
  formatDateForDisplay,
} from '../../utils/dateUtils';
import type { Diary } from '../../types/diary';

function DiaryApp() {
  const { user, logout, updateDisplayName } = useAuth();
  // 日記関連の状態とロジックをフックから取得
  const {
    diaries,
    isLoading,
    error,
    diaryToEdit,
    saveDiary,
    deleteDiary,
    selectDiaryToEdit,
  } = useDiaries();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const modalRef = useRef<HTMLDialogElement | null>(null);

  // ユーザー名の変更
  const handleStartEditing = () => {
    setNewName(user?.displayName || '');
    setIsEditingName(true);
  };

  const handleUpdateName = async () => {
    try {
      await updateDisplayName(newName);
    } catch (error) {
      alert('名前の更新に失敗しました');
      console.error('Failed to update display name', error);
    } finally {
      setIsEditingName(false);
    }
  };

  const handleCancelEditing = () => {
    setNewName('');
    setIsEditingName(false);
  };

  // モーダルを開いて、タイトルにフォーカスを当てる関数
  const openModalAndFocus = () => {
    modalRef.current?.showModal();
    const titleInput =
      modalRef.current?.querySelector<HTMLInputElement>('#diaryTitle');
    titleInput?.focus();
  };

  // 新規日記作成モーダルを開く
  const handleOpenNewDiaryModal = () => {
    selectDiaryToEdit(null);
    openModalAndFocus();
  };

  // 編集モーダルを開く
  const handleEdit = (diaryId: string) => {
    selectDiaryToEdit(diaryId);
    openModalAndFocus();
  };
  // モーダルが閉じた時に編集状態をリセットする
  const handleCloseModal = () => {
    selectDiaryToEdit(null);
  };

  // 日記を削除する
  const handleDelete = async (diaryId: string) => {
    if (!window.confirm('この日記を本当に削除しますか？')) {
      return;
    }
    try {
      await deleteDiary(diaryId);
    } catch (error) {
      console.error('Failed to delete Diary', error);
      alert('日記の削除に失敗しました');
    }
  };

  // 日記を保存する
  const handleSave = async (diary: Diary) => {
    try {
      await saveDiary(diary);
      modalRef.current?.close();
    } catch (error) {
      console.error('Failed to save diary', error);
    }
  };

  // 日付で日記をグループ化
  const diariesGroupedByDate = groupDiariesByDate(diaries);
  const dateEntries = Object.entries(diariesGroupedByDate);

  // 表示するコンテンツを決定する
  const renderContent = () => {
    if (isLoading) {
      return <div className={styles.infoState}>読み込み中...</div>;
    }
    if (error) {
      return <div className={styles.errorState}>{error}</div>;
    }
    if (dateEntries.length === 0) {
      return (
        <div className={styles.infoState}>
          <p>まだ日記がありません。</p>
          <p>最初の日記を書いてみましょう！</p>
        </div>
      );
    }
    return dateEntries.map(([dateString, diariesForDate]) => (
      <section className={styles.groupDiaries} key={dateString}>
        <time className={styles.groupDate} dateTime={dateString}>
          {formatDateForDisplay(dateString)}
        </time>
        {diariesForDate.map((diary) => (
          <DiaryCard
            key={diary.id}
            id={diary.id}
            title={diary.title}
            content={diary.content}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </section>
    ));
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        {user && (
          <div className={styles.headerContents}>
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewName(e.target.value)
                  }
                />
                <button
                  className={styles.headerButton}
                  type="button"
                  onClick={handleUpdateName}
                >
                  名前を更新
                </button>
                <button
                  className={styles.headerButton}
                  type="button"
                  onClick={handleCancelEditing}
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <p className={styles.headerMessage}>
                  こんにちは、
                  <span className={styles.userName}>
                    {user.displayName || 'ゲスト'}
                  </span>
                  さん
                </p>
                <button
                  className={styles.headerButton}
                  type="button"
                  onClick={handleStartEditing}
                >
                  名前を編集
                </button>
              </>
            )}

            <button
              className={styles.headerButton}
              type="button"
              onClick={logout}
            >
              ログアウト
            </button>
          </div>
        )}
      </header>
      <main className={styles.cardWrapper}>{renderContent()}</main>

      <button
        className={styles.fabButton}
        type="button"
        aria-label="日記を書く"
        onClick={handleOpenNewDiaryModal}
      >
        <SlNote size={32} color="white" />
      </button>

      <Modal
        ref={modalRef}
        onSave={handleSave}
        onClose={handleCloseModal}
        editTarget={diaryToEdit}
      />
    </div>
  );
}

export default DiaryApp;
