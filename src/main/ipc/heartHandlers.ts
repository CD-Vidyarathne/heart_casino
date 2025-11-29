import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/channels';
import { heartGameService } from '../services/heart/heartService';
import { userService } from '../services/user/userService';
import { gameHistoryService } from '../services/gamehistory/gameHistoryService';
import {
  ValidateSolutionRequest,
  ValidateSolutionResponse,
} from 'shared/heartGameTypes';

const heartGameSessions = new Map<string, number>();

export function registerHeartHandlers() {
  ipcMain.handle(IPC_CHANNELS.HEART.FETCH_PUZZLE, async (_event) => {
    try {
      const puzzle = await heartGameService.fetchPuzzle();

      const sessionId = `${Date.now()}-${Math.random()}`;
      heartGameSessions.set(sessionId, Date.now());

      const oneHourAgo = Date.now() - 3600000;
      for (const [id, time] of heartGameSessions.entries()) {
        if (time < oneHourAgo) {
          heartGameSessions.delete(id);
        }
      }

      return { success: true, data: { ...puzzle, sessionId } };
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
    async (
      _event,
      request: ValidateSolutionRequest & { sessionId?: string },
      userId: string
    ) => {
      try {
        const isCorrect = heartGameService.validateSolution(
          request.puzzle,
          request.userSolution
        );

        const reward = isCorrect
          ? heartGameService.calculateReward(request.puzzle)
          : 0;

        if (isCorrect && reward > 0) {
          await userService.updateBalance(userId, reward, 'add');
        }

        const sessionId = request.sessionId;
        const startTime = sessionId ? heartGameSessions.get(sessionId) : null;
        const duration = startTime
          ? Math.floor((Date.now() - startTime) / 1000)
          : 30;

        if (sessionId) {
          heartGameSessions.delete(sessionId);
        }

        const gameRecordData = {
          user_id: userId,
          game_type: 'heart-game' as const,
          result: (isCorrect ? 'win' : 'loss') as const,
          score: request.userSolution,
          opponent_score: request.puzzle.solution,
          duration: Math.max(duration, 1),
          chips_won: reward,
          chips_lost: 0,
        };

        console.log('🔍 DEBUG - Game record data:', gameRecordData);
        console.log('🔍 DEBUG - Types:', {
          user_id_type: typeof gameRecordData.user_id,
          score_type: typeof gameRecordData.score,
          opponent_score_type: typeof gameRecordData.opponent_score,
          score_value: gameRecordData.score,
          opponent_score_value: gameRecordData.opponent_score,
        });

        await gameHistoryService.createGameRecord(gameRecordData);

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
