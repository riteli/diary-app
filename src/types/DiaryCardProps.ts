export interface DiaryCardProps {
  id: string;
  date: string;
  title: string;
  content: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
