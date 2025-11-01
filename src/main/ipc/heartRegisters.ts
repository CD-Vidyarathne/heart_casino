import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/channels';
import { heartGameService } from '../services/heart/heartService';
import {
  ValidateSolutionRequest,
  ValidateSolutionResponse,
} from 'shared/heartGameTypes';

export function registerHeartHandlers() {
  ipcMain.handle(IPC_CHANNELS.HEART.FETCH_PUZZLE, async (_event) => {
    try {
      const puzzle = await heartGameService.fetchPuzzle();
      return { success: true, data: puzzle };
    } catch (error) {
      console.error('Error fetching Heart puzzle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.HEART.VALIDATE_SOLUTION,
    async (_event, request: ValidateSolutionRequest) => {
      try {
        const isCorrect = heartGameService.validateSolution(
          request.puzzle,
          request.userSolution
        );

        const reward = isCorrect
          ? heartGameService.calculateReward(request.puzzle)
          : 0;

        const response: ValidateSolutionResponse = {
          isCorrect,
          reward,
          correctSolution: request.puzzle.solution,
        };

        return { success: true, data: response };
      } catch (error) {
        console.error('Error validating Heart solution:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
  );
}
