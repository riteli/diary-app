import type { Diary } from './diary';

export interface ModalProps {
  saveDiary: (diaryObject: Diary) => void;
  resetTarget: () => void;
  editTarget: Diary | null;
}
