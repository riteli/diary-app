import type { Diary } from '../types/diary';

// 日記の配列を日付ごとにグループ化する
export const groupDiariesByDate = (
  diaries: Diary[]
): Record<string, Diary[]> => {
  return Object.groupBy(diaries, (diary) => diary.date) as Record<
    string,
    Diary[]
  >;
};

// 日付文字列を表示用の日本語形式に変換する
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// グループ化された日記のエントリを日付の降順にソートする
export const sortDateEntries = (
  entries: [string, Diary[]][]
): [string, Diary[]][] => {
  return entries.sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
};
