import type { Card, Suit, Rank } from 'shared/blackjackTypes';

export const suits: Suit[] = ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES'];
export const ranks: Rank[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];
export const deck: Card[] = [];
for (const suit of suits) {
  for (const rank of ranks) {
    let value = parseInt(rank, 10);
    if (rank === 'J' || rank === 'Q' || rank === 'K') value = 10;
    if (rank === 'A') value = 11;

    deck.push({ suit, rank, value });
  }
}
