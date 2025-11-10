import { type ClassValue, clsx } from 'clsx';
import { ASSETS } from 'renderer/assetPaths';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Suit = 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export function getCardImage(suit: Suit, rank: Rank): string {
  return ASSETS.CARDS[suit][rank];
}

export function getSuitCards(suit: Suit) {
  return ASSETS.CARDS[suit];
}