import { ipcMain } from 'electron';
import { blackjackService } from '../services/blackjack/blackjackService';
import { userService } from '../services/user/userService';
import { IPC_CHANNELS } from '../../shared/channels';

export function registerBlackjackHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.BLACKJACK.START_GAME,
    async (_event, userId: string, bet: number) => {
      try {
        await userService.updateBalance(userId, bet, 'subtract');

        const game = blackjackService.startGame(userId, bet);

        if (game.state === 'game-over' && game.payout !== undefined) {
          await userService.updateBalance(userId, game.payout, 'add');
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
        const game = blackjackService.stand(gameId);

        if (game.payout !== undefined && game.payout > 0) {
          await userService.updateBalance(userId, game.payout, 'add');
        }

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

        await userService.updateBalance(userId, originalBet, 'subtract');

        const game = blackjackService.doubleDown(gameId);

        if (game.payout !== undefined && game.payout > 0) {
          await userService.updateBalance(userId, game.payout, 'add');
        }

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
