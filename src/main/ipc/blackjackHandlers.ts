import { ipcMain } from 'electron';
import { blackjackService } from '../services/blackjack/blackjackService';
import { userService } from '../services/user/userService';
import { gameHistoryService } from '../services/gamehistory/gameHistoryService';
import { IPC_CHANNELS } from '../../shared/channels';

export function registerBlackjackHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.BLACKJACK.START_GAME,
    async (_event, userId: string, bet: number) => {
      try {
        await userService.updateBalance(userId, bet, 'subtract');

        const game = blackjackService.startGame(userId, bet);
        const startTime = Date.now();

        (game as any)._startTime = startTime;

        if (game.state === 'game-over' && game.payout !== undefined) {
          await userService.updateBalance(userId, game.payout, 'add');

          const duration = Math.floor((Date.now() - startTime) / 1000);
          await gameHistoryService.createGameRecord({
            user_id: userId,
            game_type: 'blackjack',
            result:
              game.result === 'player-blackjack' || game.result === 'player-win'
                ? 'win'
                : game.result === 'push'
                  ? 'tie'
                  : 'loss',
            score: game.playerHand.score,
            opponent_score: game.dealerHand.score,
            duration: Math.max(duration, 1),
            chips_won: game.payout > bet ? game.payout : 0,
            chips_lost: game.payout === 0 ? bet : 0,
          });
        }

        return { success: true, data: game };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to start game',
        };
      }
    }
  );

  ipcMain.handle(IPC_CHANNELS.BLACKJACK.HIT, async (_event, gameId: string) => {
    try {
      const game = blackjackService.hit(gameId);
      return { success: true, data: game };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to hit',
      };
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.BLACKJACK.STAND,
    async (_event, gameId: string, userId: string) => {
      try {
        const currentGame = blackjackService.getGame(gameId);
        const startTime = (currentGame as any)?._startTime || Date.now();
        const originalBet = currentGame?.bet || 0;

        const game = blackjackService.stand(gameId);

        if (game.payout !== undefined && game.payout > 0) {
          await userService.updateBalance(userId, game.payout, 'add');
        }

        const duration = Math.floor((Date.now() - startTime) / 1000);
        await gameHistoryService.createGameRecord({
          user_id: userId,
          game_type: 'blackjack',
          result:
            game.result === 'player-win'
              ? 'win'
              : game.result === 'push'
                ? 'tie'
                : 'loss',
          score: game.playerHand.score,
          opponent_score: game.dealerHand.score,
          duration: Math.max(duration, 1),
          chips_won: game.payout && game.payout > originalBet ? game.payout : 0,
          chips_lost: game.payout === 0 ? originalBet : 0,
        });

        return { success: true, data: game };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to stand',
        };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.BLACKJACK.DOUBLE_DOWN,
    async (_event, gameId: string, userId: string) => {
      try {
        const currentGame = blackjackService.getGame(gameId);
        if (!currentGame) {
          throw new Error('Game not found');
        }

        const originalBet = currentGame.bet;
        const startTime = (currentGame as any)?._startTime || Date.now();

        await userService.updateBalance(userId, originalBet, 'subtract');

        const game = blackjackService.doubleDown(gameId);

        if (game.payout !== undefined && game.payout > 0) {
          await userService.updateBalance(userId, game.payout, 'add');
        }

        const duration = Math.floor((Date.now() - startTime) / 1000);
        const totalBet = originalBet * 2;
        await gameHistoryService.createGameRecord({
          user_id: userId,
          game_type: 'blackjack',
          result:
            game.result === 'player-win'
              ? 'win'
              : game.result === 'push'
                ? 'tie'
                : 'loss',
          score: game.playerHand.score,
          opponent_score: game.dealerHand.score,
          duration: Math.max(duration, 1),
          chips_won: game.payout && game.payout > totalBet ? game.payout : 0,
          chips_lost: game.payout === 0 ? totalBet : 0,
        });

        return { success: true, data: game };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to double down',
        };
      }
    }
  );
}
