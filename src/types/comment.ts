export interface Comment {
  id: number;
  board_id: number;
  parent_id: number | null;
  content: string;
  author_id: string;
  author_name: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}
