export interface Card {
  id: string;
  stackId: string;
  title: string;
  description?: string;
  cover?: string; // URL or color code
  createdAt: number;
}

export interface Stack {
  id: string;
  title: string;
  cover?: string; // URL or color code
  cardIds: string[]; // Ordered list of card IDs for this stack
  createdAt: number;
}

export type Theme = 'light' | 'dark' | 'system';
