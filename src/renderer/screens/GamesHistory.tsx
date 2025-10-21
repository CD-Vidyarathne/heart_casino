import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, TitleBar } from '../components';

interface GameRecord {
  id: string;
  gameType: 'blackjack' | 'heart-game';
  date: string;
  result: 'win' | 'loss' | 'tie';
  score: number;
  opponentScore?: number;
  duration: string;
  chipsWon: number;
  chipsLost: number;
}

// Mock data - in a real app, this would come from an API
const mockGameHistory: GameRecord[] = [
  {
    id: '1',
    gameType: 'blackjack',
    date: '2024-01-15',
    result: 'win',
    score: 21,
    opponentScore: 18,
    duration: '3:45',
    chipsWon: 150,
    chipsLost: 0
  },
  {
    id: '2',
    gameType: 'blackjack',
    date: '2024-01-14',
    result: 'loss',
    score: 23,
    opponentScore: 20,
    duration: '2:30',
    chipsWon: 0,
    chipsLost: 100
  },
  {
    id: '3',
    gameType: 'heart-game',
    date: '2024-01-13',
    result: 'win',
    score: 15,
    opponentScore: 25,
    duration: '8:15',
    chipsWon: 200,
    chipsLost: 0
  },
  {
    id: '4',
    gameType: 'blackjack',
    date: '2024-01-12',
    result: 'tie',
    score: 19,
    opponentScore: 19,
    duration: '4:20',
    chipsWon: 0,
    chipsLost: 0
  },
  {
    id: '5',
    gameType: 'heart-game',
    date: '2024-01-11',
    result: 'loss',
    score: 35,
    opponentScore: 20,
    duration: '6:10',
    chipsWon: 0,
    chipsLost: 150
  }
];

export const GamesHistory: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'blackjack' | 'heart-game'>('all');

  const filteredGames = mockGameHistory.filter(game => 
    filter === 'all' || game.gameType === filter
  );

  const getGameIcon = (gameType: string) => {
    return gameType === 'blackjack' ? '🃏' : '❤️';
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-400';
      case 'loss': return 'text-red-400';
      case 'tie': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'win': return 'Won';
      case 'loss': return 'Lost';
      case 'tie': return 'Tied';
      default: return 'Unknown';
    }
  };

  const totalStats = mockGameHistory.reduce((acc, game) => {
    acc.totalGames++;
    if (game.result === 'win') acc.wins++;
    else if (game.result === 'loss') acc.losses++;
    else acc.ties++;
    acc.chipsWon += game.chipsWon;
    acc.chipsLost += game.chipsLost;
    return acc;
  }, { totalGames: 0, wins: 0, losses: 0, ties: 0, chipsWon: 0, chipsLost: 0 });

  return (
    <div className="screen-container">
      <div className="screen-content">
        <TitleBar 
          title="Game History" 
          subtitle="Your gaming statistics and past games"
          className="mb-6"
        />
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-white luckiest-guy">{totalStats.totalGames}</div>
            <div className="text-gray-300 text-xs poppins">Total Games</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-green-400 luckiest-guy">{totalStats.wins}</div>
            <div className="text-gray-300 text-xs poppins">Wins</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-red-400 luckiest-guy">{totalStats.losses}</div>
            <div className="text-gray-300 text-xs poppins">Losses</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-yellow-400 luckiest-guy">{totalStats.ties}</div>
            <div className="text-gray-300 text-xs poppins">Ties</div>
          </Card>
        </div>

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
              <h3 className="text-lg font-bold text-white mb-2 luckiest-guy">No Games Found</h3>
              <p className="text-gray-300 text-sm poppins">Start playing to see your game history here!</p>
            </Card>
          ) : (
            filteredGames.map((game) => (
              <Card key={game.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getGameIcon(game.gameType)}</div>
                    <div>
                      <h3 className="text-base font-bold text-white capitalize luckiest-guy">
                        {game.gameType.replace('-', ' ')}
                      </h3>
                      <p className="text-gray-300 text-xs poppins">{game.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getResultColor(game.result)} luckiest-guy`}>
                      {getResultText(game.result)}
                    </div>
                    <div className="text-gray-300 text-xs poppins">
                      {game.duration} • {game.score}
                      {game.opponentScore && ` vs ${game.opponentScore}`}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {game.chipsWon > 0 && (
                      <div className="text-green-400 font-bold text-sm luckiest-guy">+{game.chipsWon}</div>
                    )}
                    {game.chipsLost > 0 && (
                      <div className="text-red-400 font-bold text-sm luckiest-guy">-{game.chipsLost}</div>
                    )}
                    {game.chipsWon === 0 && game.chipsLost === 0 && (
                      <div className="text-gray-400 text-xs poppins">No chips</div>
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
