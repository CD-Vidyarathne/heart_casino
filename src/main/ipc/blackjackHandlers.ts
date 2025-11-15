import { ipcMain } from 'electron';
import { blackjackService } from '../services/blackjack/blackjackService';
import { IPC_CHANNELS } from '../../shared/channels';

export function registerBlackjackHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.BLACKJACK.START_GAME,
    async (_event, userId: string, bet: number) => {
      try {
        const game = blackjackService.startGame(userId, bet);
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
    async (_event, gameId: string) => {
      try {
        const game = blackjackService.stand(gameId);
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
    async (_event, gameId: string) => {
      try {
        const game = blackjackService.doubleDown(gameId);
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
