import { HeartPuzzle, HeartAPIResponse } from 'shared/heartGameTypes';

export class HeartGameService {
  private baseUrl = 'http://marcconrad.com/uob/heart/api.php';

  async fetchPuzzle(useBase64: boolean = true): Promise<HeartPuzzle> {
    try {
      const url = `${this.baseUrl}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Heart API request failed: ${response.status}`);
      }

      const data: HeartAPIResponse = await response.json();

      return {
        question: data.question,
        solution: data.solution,
        carrots: data.carrots,
        isBase64: useBase64,
      };
    } catch (error) {
      console.error('Failed to fetch Heart puzzle:', error);
      throw new Error('Unable to fetch puzzle from Heart API');
    }
  }

  validateSolution(puzzle: HeartPuzzle, userSolution: number): boolean {
    return puzzle.solution === userSolution;
  }

  calculateReward(puzzle: HeartPuzzle): number {
    return 100;
  }
}

export const heartGameService = new HeartGameService();
