import type {
  BlackjackGame,
  Card,
  Hand,
  GameState,
  GameResult,
  Suit,
  Rank,
} from 'shared/blackjackTypes';

import { deck } from 'shared/blackjackConstants';

class BlackjackService {
  private games: Map<string, BlackjackGame> = new Map();

  createDeck(): Card[] {
    return this.shuffleDeck(deck);
  }

  shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  calculateHandValue(cards: Card[]): {
    score: number;
    isBust: boolean;
    isBlackjack: boolean;
  } {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
      score += card.value;
      if (card.rank === 'A') aces++;
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    const isBlackjack = cards.length === 2 && score === 21;
    const isBust = score > 21;

    return { score, isBust, isBlackjack };
  }

  createHand(cards: Card[]): Hand {
    const { score, isBust, isBlackjack } = this.calculateHandValue(cards);
    return { cards, score, isBust, isBlackjack };
  }

  startGame(userId: string, bet: number): BlackjackGame {
    const gameId = `${userId}-${Date.now()}`;
    const deck = this.createDeck();

    const playerCards = [deck.pop()!, deck.pop()!];
    const dealerCards = [deck.pop()!, deck.pop()!];

    const game: BlackjackGame = {
      gameId,
      playerHand: this.createHand(playerCards),
      dealerHand: this.createHand(dealerCards),
      deck,
      bet,
      state: 'dealing',
    };

    if (game.playerHand.isBlackjack && game.dealerHand.isBlackjack) {
      game.state = 'game-over';
      game.result = 'push';
      game.payout = bet;
    } else if (game.playerHand.isBlackjack) {
      game.state = 'game-over';
      game.result = 'player-blackjack';
      game.payout = Math.floor(bet * 2.5);
    } else {
      game.state = 'player-turn';
    }

    this.games.set(gameId, game);
    return game;
  }

  hit(gameId: string): BlackjackGame {
    const game = this.games.get(gameId);
    if (!game || game.state !== 'player-turn') {
      throw new Error('Invalid game state for hit');
    }

    const card = game.deck.pop()!;
    game.playerHand.cards.push(card);
    game.playerHand = this.createHand(game.playerHand.cards);

    if (game.playerHand.isBust) {
      game.state = 'game-over';
      game.result = 'dealer-win';
      game.payout = 0;
    }

    return game;
  }

  stand(gameId: string): BlackjackGame {
    const game = this.games.get(gameId);
    if (!game || game.state !== 'player-turn') {
      throw new Error('Invalid game state for stand');
    }

    game.state = 'dealer-turn';

    while (game.dealerHand.score < 17) {
      const card = game.deck.pop()!;
      game.dealerHand.cards.push(card);
      game.dealerHand = this.createHand(game.dealerHand.cards);
    }

    game.state = 'game-over';

    if (game.dealerHand.isBust) {
      game.result = 'player-win';
      game.payout = game.bet * 2;
    } else if (game.playerHand.score > game.dealerHand.score) {
      game.result = 'player-win';
      game.payout = game.bet * 2;
    } else if (game.playerHand.score < game.dealerHand.score) {
      game.result = 'dealer-win';
      game.payout = 0;
    } else {
      game.result = 'push';
      game.payout = game.bet;
    }

    return game;
  }

  doubleDown(gameId: string): BlackjackGame {
    const game = this.games.get(gameId);
    if (
      !game ||
      game.state !== 'player-turn' ||
      game.playerHand.cards.length !== 2
    ) {
      throw new Error('Invalid game state for double down');
    }

    game.bet *= 2;

    const card = game.deck.pop()!;
    game.playerHand.cards.push(card);
    game.playerHand = this.createHand(game.playerHand.cards);

    if (!game.playerHand.isBust) {
      return this.stand(gameId);
    } else {
      game.state = 'game-over';
      game.result = 'dealer-win';
      game.payout = 0;
      return game;
    }
  }

  getGame(gameId: string): BlackjackGame | undefined {
    return this.games.get(gameId);
  }

  deleteGame(gameId: string): void {
    this.games.delete(gameId);
  }
}

export const blackjackService = new BlackjackService();
