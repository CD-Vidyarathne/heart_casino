import { ipcMain } from 'electron';
import { heartGameService } from '../services/heart/heartService';

interface HeartPuzzle {
  question: string;
  solution: number;
  carrots: number;
  isBase64: boolean;
}

interface ValidateSolutionRequest {
  puzzle: HeartPuzzle;
  userSolution: number;
}

interface ValidateSolutionResponse {
  isCorrect: boolean;
  reward: number;
  correctSolution: number;
}

export function registerHeartHandlers() {
  ipcMain.handle('heart:fetch-puzzle', async (_event) => {
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
    'heart:validate-solution',
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
