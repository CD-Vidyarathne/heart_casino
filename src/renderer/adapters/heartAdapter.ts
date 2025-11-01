import { IPC_CHANNELS } from 'shared/channels';
import type {
  HeartPuzzle,
  HeartGameResult,
  APIResponse,
} from '../../shared/heartGameTypes';

export class HeartGameAdapter {
  static async fetchPuzzle(): Promise<HeartPuzzle> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<HeartPuzzle>
    >(IPC_CHANNELS.HEART.FETCH_PUZZLE);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch puzzle');
    }

    return response.data;
  }

  static async validateSolution(
    puzzle: HeartPuzzle,
    userSolution: number
  ): Promise<HeartGameResult> {
    const response = await window.electron.ipcRenderer.invoke<
      APIResponse<HeartGameResult>
    >(IPC_CHANNELS.HEART.VALIDATE_SOLUTION, { puzzle, userSolution });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to validate solution');
    }

    return response.data;
  }
}
