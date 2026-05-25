export type Clip = {
  id: string;
  emoji: string;
  label: string;
  audioUrl: string;
  durationMs: number;
  createdAt: number;
};

export type Board = {
  slug: string;
  name: string;
  emoji: string;
  clips: Clip[];
  editTokenHash: string;
  createdAt: number;
};

export type PublicBoard = Omit<Board, 'editTokenHash'>;
