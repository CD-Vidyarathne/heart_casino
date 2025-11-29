import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, TitleBar } from '../components';
import { GameHistoryAdapter } from '../adapters/gameHistoryAdapter';
import { useAuth } from '../contexts/UserContext';
import type {
  GameHistoryRecord,
  GameHistoryStats,
} from '../../shared/gameHistoryTypes';

export const GamesHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const [filter, setFilter] = useState<'all' | 'blackjack' | 'heart-game'>(
    'all'
  );
  const [gameHistory, setGameHistory] = useState<GameHistoryRecord[]>([]);
  const [stats, setStats] = useState<GameHistoryStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    chipsWon: 0,
    chipsLost: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGameHistory();
    loadStats();
  }, [user, session]);

  const loadGameHistory = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const history = await GameHistoryAdapter.getUserHistory(
        user.id,
        undefined,
        50,
        session
      );
      setGameHistory(history);
    } catch (err) {
      console.error('Failed to load game history:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load game history'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user?.id) return;

    try {
      const userStats = await GameHistoryAdapter.getUserStats(user.id, session);
      setStats(userStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const filteredGames = gameHistory.filter(
    (game) => filter === 'all' || game.game_type === filter
  );

  const getGameIcon = (gameType: string) => {
    return gameType === 'blackjack' ? '🃏' : '❤️';
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'text-green-400';
      case 'loss':
        return 'text-red-400';
      case 'tie':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'win':
        return 'Won';
      case 'loss':
        return 'Lost';
      case 'tie':
        return 'Tied';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="screen-container">
        <div className="screen-content flex items-center justify-center">
          <div className="text-white text-xl poppins">
            Loading game history...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-content">
        <TitleBar
          title="Game History"
          subtitle="Your gaming statistics and past games"
          className="mb-6"
        />

        {error && (
          <Card className="p-4 mb-4 bg-red-900/30 border-red-500/50">
            <p className="text-red-300 poppins text-center">{error}</p>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-white luckiest-guy">
              {stats.totalGames}
            </div>
            <div className="text-gray-300 text-xs poppins">Total Games</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-green-400 luckiest-guy">
              {stats.wins}
            </div>
            <div className="text-gray-300 text-xs poppins">Wins</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-red-400 luckiest-guy">
              {stats.losses}
            </div>
            <div className="text-gray-300 text-xs poppins">Losses</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-yellow-400 luckiest-guy">
              {stats.ties}
            </div>
            <div className="text-gray-300 text-xs poppins">Ties</div>
          </Card>
        </div>

        <Card className="p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="text-xs text-gray-300 poppins mb-1">
                Total Earned
              </div>
              <div className="text-lg font-bold text-green-400 luckiest-guy">
                +{stats.chipsWon}
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs text-gray-300 poppins mb-1">
                Net Result
              </div>
              <div
                className={`text-lg font-bold luckiest-guy ${stats.chipsWon - stats.chipsLost >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                  }`}
              >
                {stats.chipsWon - stats.chipsLost >= 0 ? '+' : ''}
                {stats.chipsWon - stats.chipsLost}
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="text-xs text-gray-300 poppins mb-1">
                Total Lost
              </div>
              <div className="text-lg font-bold text-red-400 luckiest-guy">
                -{stats.chipsLost}
              </div>
            </div>
          </div>
        </Card>

        {/* Filter Buttons */}
        <div className="flex gap-1 mb-4 justify-center">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
            size="sm"
            className="text-xs px-2 py-1"
          >
            All
          </Button>
          <Button
            variant={filter === 'blackjack' ? 'primary' : 'secondary'}
            onClick={() => setFilter('blackjack')}
            size="sm"
            className="text-xs px-2 py-1"
          >
            🃏 BJ
          </Button>
          <Button
            variant={filter === 'heart-game' ? 'primary' : 'secondary'}
            onClick={() => setFilter('heart-game')}
            size="sm"
            className="text-xs px-2 py-1"
          >
            ❤️ Hearts
          </Button>
        </div>

        {/* Game History List */}
        <div className="space-y-3">
          {filteredGames.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-white mb-2 luckiest-guy">
                No Games Found
              </h3>
              <p className="text-gray-300 text-sm poppins">
                {filter === 'all'
                  ? 'Start playing to see your game history here!'
                  : `No ${filter.replace('-', ' ')} games found.`}
              </p>
            </Card>
          ) : (
            filteredGames.map((game) => (
              <Card key={game.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getGameIcon(game.game_type)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white capitalize luckiest-guy">
                        {game.game_type.replace('-', ' ')}
                      </h3>
                      <p className="text-gray-300 text-xs poppins">
                        {formatDate(game.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${getResultColor(game.result)} luckiest-guy`}
                    >
                      {getResultText(game.result)}
                    </div>
                    <div className="text-gray-300 text-xs poppins">
                      {formatDuration(game.duration)} • {game.score}
                      {game.opponent_score !== undefined &&
                        game.opponent_score !== null &&
                        ` / ${game.opponent_score}`}
                    </div>
                  </div>

                  <div className="text-right">
                    {game.chips_won > 0 && (
                      <div className="text-green-400 font-bold text-sm luckiest-guy">
                        +{game.chips_won}
                      </div>
                    )}
                    {game.chips_lost > 0 && (
                      <div className="text-red-400 font-bold text-sm luckiest-guy">
                        -{game.chips_lost}
                      </div>
                    )}
                    {game.chips_won === 0 && game.chips_lost === 0 && (
                      <div className="text-gray-400 text-xs poppins">
                        No coins
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() => navigate('/main-menu')}
            size="md"
          >
            ← Back to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
