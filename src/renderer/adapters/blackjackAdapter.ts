import type { BlackjackGame } from '../../shared/blackjackTypes';
import type { APIResponse } from '../../shared/types';
import { IPC_CHANNELS } from '../../shared/channels';

export class BlackjackAdapter {
  static async startGame(userId: string, bet: number): Promise<BlackjackGame> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<BlackjackGame>
    >(IPC_CHANNELS.BLACKJACK.START_GAME, userId, bet);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to start game');
    }

    return response.data;
  }

  static async hit(gameId: string): Promise<BlackjackGame> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<BlackjackGame>
    >(IPC_CHANNELS.BLACKJACK.HIT, gameId);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to hit');
    }

    return response.data;
  }

  static async stand(gameId: string, userId: string): Promise<BlackjackGame> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<BlackjackGame>
    >(IPC_CHANNELS.BLACKJACK.STAND, gameId, userId);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to stand');
    }

    return response.data;
  }

  static async doubleDown(
    gameId: string,
    userId: string
  ): Promise<BlackjackGame> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<BlackjackGame>
    >(IPC_CHANNELS.BLACKJACK.DOUBLE_DOWN, gameId, userId);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to double down');
    }

    return response.data;
  }
}
