export type Suit = 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES';
export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface Hand {
  cards: Card[];
  score: number;
  isBust: boolean;
  isBlackjack: boolean;
}

export type GameState =
  | 'betting'
  | 'dealing'
  | 'player-turn'
  | 'dealer-turn'
  | 'game-over';

export type GameResult =
  | 'player-win'
  | 'dealer-win'
  | 'push'
  | 'player-blackjack';

export interface BlackjackGame {
  gameId: string;
  playerHand: Hand;
  dealerHand: Hand;
  deck: Card[];
  bet: number;
  state: GameState;
  result?: GameResult;
  payout?: number;
}
