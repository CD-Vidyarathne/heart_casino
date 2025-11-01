export interface HeartPuzzle {
  question: string;
  solution: number;
  carrots: number;
  isBase64: boolean;
}

export interface HeartGameResult {
  isCorrect: boolean;
  reward: number;
  correctSolution: number;
  userSolution: number;
  timeTaken?: number;
}

export interface HeartGameStats {
  totalAttempts: number;
  correctAttempts: number;
  totalRewards: number;
  averageTime: number;
  lastPlayed?: Date;
}

export interface ValidateSolutionRequest {
  puzzle: HeartPuzzle;
  userSolution: number;
}

export interface ValidateSolutionResponse {
  isCorrect: boolean;
  reward: number;
  correctSolution: number;
}

export interface HeartAPIResponse {
  question: string;
  solution: number;
  carrots: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
