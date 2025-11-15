import { type ClassValue, clsx } from 'clsx';
import { ASSETS } from 'renderer/assetPaths';
import { twMerge } from 'tailwind-merge';
import { type Rank, type Suit } from 'shared/blackjackTypes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCardImage(suit: Suit, rank: Rank): string {
  return ASSETS.CARDS[suit][rank];
}

export function getSuitCards(suit: Suit) {
  return ASSETS.CARDS[suit];
}

