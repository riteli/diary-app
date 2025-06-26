import type { Diary } from './diary';

export interface ModalProps {
  saveDiary: (diary: Diary) => Promise<void>;
  editTarget: Diary | null;
  resetTarget: () => void;
}
