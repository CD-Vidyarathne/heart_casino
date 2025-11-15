import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, TitleBar, Modal } from '../components';
import { HeartGameAdapter } from '../adapters/heartAdapter';
import type { HeartPuzzle, HeartGameResult } from '../../shared/heartGameTypes';
import { useAuth } from 'renderer/contexts/UserContext';

type GameState = 'loading' | 'playing' | 'submitting' | 'result';

export const HeartGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [gameState, setGameState] = useState<GameState>('loading');
  const [puzzle, setPuzzle] = useState<HeartPuzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [result, setResult] = useState<HeartGameResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    loadNewPuzzle();
  }, []);

  const loadNewPuzzle = async () => {
    try {
      setGameState('loading');
      setError(null);
      setUserAnswer('');
      setResult(null);

      const newPuzzle = await HeartGameAdapter.fetchPuzzle();
      setPuzzle(newPuzzle);
      setStartTime(Date.now());
      setGameState('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzle');
      setGameState('playing');
    }
  };

  const handleSubmit = async () => {
    if (!puzzle || !userAnswer.trim() || !user) {
      setError('Please enter an answer');
      return;
    }

    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) {
      setError('Please enter a valid number');
      return;
    }

    if (answer < 0) {
      setError('Please enter a positive number');
      return;
    }

    try {
      setGameState('submitting');
      setError(null);

      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const validation = await HeartGameAdapter.validateSolution(
        puzzle,
        answer,
        user.id
      );

      await refreshProfile();
      setResult({
        ...validation,
        userSolution: answer,
        timeTaken,
      });
      setGameState('result');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to validate answer'
      );
      setGameState('playing');
    }
  };
  const handlePlayAgain = () => {
    loadNewPuzzle();
  };

  const handleBack = () => {
    navigate('/game-selection');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameState === 'playing' && userAnswer.trim()) {
      handleSubmit();
    }
  };

  const renderPuzzleImage = () => {
    if (!puzzle) return null;

    return (
      <div className="relative w-[60%] aspect-square max-w-md mx-auto mb-6 rounded-lg overflow-hidden shadow-2xl border-4 border-purple-500/30">
        <img
          src={puzzle.question}
          alt="Heart Puzzle"
          className="w-full h-full object-contain bg-gradient-to-br from-purple-900/20 to-pink-900/20"
          onError={() => setError('Failed to load puzzle image')}
        />
      </div>
    );
  };
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin text-6xl">❤️</div>
      <p className="text-xl text-white poppins-medium">Loading puzzle...</p>
    </div>
  );

  const renderPlayingState = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl text-white poppins-semibold mb-2">
          How many hearts are here?
        </h3>
      </div>

      {renderPuzzleImage()}

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-3 text-center">
          <p className="text-red-200 poppins-medium text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-white poppins-medium text-sm">
            Your Answer:
          </label>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a number..."
            className="w-full px-4 py-3 bg-purple-900/30 border-2 border-purple-500/50 rounded-lg text-white text-center text-2xl poppins-bold focus:outline-none focus:border-purple-400 transition-colors"
            min={0}
            autoFocus
            disabled={gameState !== 'playing'}
          />
        </div>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!userAnswer.trim() || gameState !== 'playing'}
          className="w-full text-lg py-4"
        >
          {gameState === 'submitting' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Checking...
            </span>
          ) : (
            'Submit Answer'
          )}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => setShowInstructions(true)}
          size="sm"
          className="flex-1"
        >
          ℹ️ Instructions
        </Button>
        <Button
          variant="secondary"
          onClick={loadNewPuzzle}
          size="sm"
          className="flex-1"
        >
          🔄 New Puzzle
        </Button>
      </div>
    </div>
  );

  const renderResultState = () => {
    if (!result) return null;

    return (
      <div className="space-y-6">
        <Card
          className={`text-center p-6 ${result.isCorrect ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}`}
        >
          <div className="text-2xl mb-4">{result.isCorrect ? '🎉' : '😔'}</div>
          <h3 className="text-3xl text-white luckiest-guy mb-2">
            {result.isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          <p className="text-xl text-gray-200 poppins-medium mb-4">
            {result.isCorrect
              ? `You earned ${result.reward} coins!`
              : `The correct answer was ${result.correctSolution}`}
          </p>
          {result.timeTaken && (
            <p className="text-gray-300 poppins text-sm">
              Time taken: {result.timeTaken} seconds
            </p>
          )}
        </Card>

        {renderPuzzleImage()}

        <div className="bg-purple-900/30 border-2 border-purple-500/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 poppins">Your Answer:</span>
            <span className="text-white poppins-bold text-xl">
              {result.userSolution}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 poppins">Correct Answer:</span>
            <span className="text-white poppins-bold text-xl">
              {result.correctSolution}
            </span>
          </div>
          {result.isCorrect && (
            <div className="flex justify-between items-center pt-2 border-t border-purple-500/30">
              <span className="text-green-300 poppins-medium">Reward:</span>
              <span className="text-green-400 poppins-bold text-xl">
                +{result.reward} 💰
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handlePlayAgain}
            className="flex-1 text-lg py-4"
          >
            🎮 Play Again
          </Button>
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex-1 text-lg py-4"
          >
            🏠 Exit
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="screen-container">
      <div className="screen-content">
        <TitleBar
          title="Heart Puzzle Game"
          subtitle={
            gameState === 'result' ? '' : 'Solve the puzzle to earn rewards'
          }
          className="mb-6"
        />

        {gameState === 'loading' && renderLoadingState()}
        {(gameState === 'playing' || gameState === 'submitting') &&
          renderPlayingState()}
        {gameState === 'result' && renderResultState()}

        {gameState !== 'result' && (
          <div className="mt-6 text-center">
            <Button variant="secondary" onClick={handleBack} size="md">
              ← Back to Game Selection
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="How to Play Heart Puzzle"
        showActions={false}
      >
        <div className="space-y-4">
          <p className="text-gray-300 poppins">
            The Heart Puzzle is a mathematical pattern recognition game where
            you need to determine what number the ❤️ symbol represents.
          </p>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 poppins-semibold">
              Instructions:
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-300 flex items-start poppins">
                <span className="text-red-400 mr-2">•</span>
                Study the image carefully to find the hearts
              </li>
              <li className="text-gray-300 flex items-start poppins">
                <span className="text-red-400 mr-2">•</span>
                Submit the number of hearts as the answer.
              </li>
              <li className="text-gray-300 flex items-start poppins">
                <span className="text-red-400 mr-2">•</span>
                Correct answers earn you bonus coins!
              </li>
            </ul>
          </div>
          <div className="pt-4">
            <Button
              variant="primary"
              onClick={() => setShowInstructions(false)}
              className="w-full"
            >
              Got it! Let's Play
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
