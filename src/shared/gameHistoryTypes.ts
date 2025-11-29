export interface GameHistoryRecord {
  id: string;
  user_id: string;
  game_type: 'blackjack' | 'heart-game';
  result: 'win' | 'loss' | 'tie';
  score: number;
  opponent_score?: number;
  duration: number;
  chips_won: number;
  chips_lost: number;
  created_at: string;
  updated_at: string;
}

export interface GameHistoryStats {
  totalGames: number;
  wins: number;
  losses: number;
  ties: number;
  chipsWon: number;
  chipsLost: number;
}

export interface CreateGameHistoryRequest {
  user_id: string;
  game_type: 'blackjack' | 'heart-game';
  result: 'win' | 'loss' | 'tie';
  score: number;
  opponent_score?: number;
  duration: number;
  chips_won: number;
  chips_lost: number;
}
