import { IPC_CHANNELS } from '../../shared/channels';
import type {
  GameHistoryRecord,
  GameHistoryStats,
  CreateGameHistoryRequest,
} from '../../shared/gameHistoryTypes';
import { APIResponse } from 'shared/types';

export class GameHistoryAdapter {
  static async createGameRecord(
    request: CreateGameHistoryRequest,
    session?: { access_token: string; refresh_token?: string }
  ): Promise<GameHistoryRecord> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<GameHistoryRecord>
    >(IPC_CHANNELS.GAME_HISTORY.CREATE_RECORD, request, session);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create game record');
    }

    return response.data;
  }

  static async getUserHistory(
    userId: string,
    gameType?: 'blackjack' | 'heart-game',
    limit: number = 50,
    session?: { access_token: string; refresh_token?: string }
  ): Promise<GameHistoryRecord[]> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<GameHistoryRecord[]>
    >(
      IPC_CHANNELS.GAME_HISTORY.GET_USER_HISTORY,
      userId,
      gameType,
      limit,
      session
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch game history');
    }

    return response.data;
  }

  static async getUserStats(
    userId: string,
    session?: { access_token: string; refresh_token?: string }
  ): Promise<GameHistoryStats> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<GameHistoryStats>
    >(IPC_CHANNELS.GAME_HISTORY.GET_USER_STATS, userId, session);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch game stats');
    }

    return response.data;
  }
}
