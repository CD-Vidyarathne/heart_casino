import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/channels';
import { gameHistoryService } from '../services/gamehistory/gameHistoryService';
import type { CreateGameHistoryRequest } from '../../shared/gameHistoryTypes';

export function registerGameHistoryHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.GAME_HISTORY.CREATE_RECORD,
    async (
      _event,
      request: CreateGameHistoryRequest,
      session?: { access_token: string; refresh_token?: string }
    ) => {
      try {
        const data = await gameHistoryService.createGameRecord(
          request,
          session
        );
        return { success: true, data };
      } catch (error) {
        console.error('Error creating game record:', error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create game record',
        };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.GAME_HISTORY.GET_USER_HISTORY,
    async (
      _event,
      userId: string,
      gameType?: 'blackjack' | 'heart-game',
      limit?: number,
      session?: { access_token: string; refresh_token?: string }
    ) => {
      try {
        const data = await gameHistoryService.getUserHistory(
          userId,
          gameType,
          limit,
          session
        );
        return { success: true, data };
      } catch (error) {
        console.error('Error fetching game history:', error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch game history',
        };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.GAME_HISTORY.GET_USER_STATS,
    async (
      _event,
      userId: string,
      session?: { access_token: string; refresh_token?: string }
    ) => {
      try {
        const data = await gameHistoryService.getUserStats(userId, session);
        return { success: true, data };
      } catch (error) {
        console.error('Error fetching game stats:', error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch game stats',
        };
      }
    }
  );
}
