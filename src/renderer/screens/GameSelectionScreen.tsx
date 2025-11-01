import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, TitleBar, Modal } from '../components';

interface GameInfo {
  id: string;
  available: boolean;
  name: string;
  description: string;
  icon: string;
  color: string;
  rules: string[];
}

const games: GameInfo[] = [
  {
    id: 'blackjack',
    available: false,
    name: 'Blackjack',
    description:
      'Beat the dealer by getting as close to 21 as possible without going over.',
    icon: '🃏',
    color: 'from-green-600 to-green-700',
    rules: [
      'Get as close to 21 as possible without going over',
      'Face cards (J, Q, K) are worth 10 points',
      'Aces can be worth 1 or 11 points',
      "Beat the dealer's hand to win",
      'Blackjack (21 with first two cards) pays 3:2',
    ],
  },
  {
    id: 'heart-game',
    available: true,
    name: 'Heart Game',
    description: 'A unique card game where you count hearts to win.',
    icon: '❤️',
    color: 'from-red-600 to-red-700',
    rules: [
      'Study the image carefully to find the pattern',
      'Submit the number of hearts as the answer.',
      'Correct answers earn you bonus coins!',
    ],
  },
];

export const GameSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);
  const [showRules, setShowRules] = useState(false);

  const handleGameSelect = (game: GameInfo) => {
    if (!game.available) {
      alert(`${game.name} is coming soon! Stay tuned.`);
      return;
    }

    switch (game.id) {
      case 'blackjack':
        navigate('/blackjack');
        break;
      case 'heart-game':
        navigate('/heart-game');
        break;
    }
  };

  const handleBack = () => {
    navigate('/main-menu');
  };

  return (
    <div className="screen-container">
      <div className="screen-content">
        <TitleBar
          title="Choose Your Game"
          subtitle="Select a game to start playing"
          className="mb-6"
        />

        <div className="space-y-4">
          {games.map((game) => (
            <Card
              key={game.id}
              hover
              className="p-4 text-center group relative"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {game.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 luckiest-guy">
                {game.name}
              </h3>

              <p className="text-gray-300 mb-4 text-sm poppins">
                {game.description}
              </p>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedGame(game);
                    setShowRules(true);
                  }}
                  className="flex items-center gap-1 text-xs"
                  size="sm"
                >
                  <span>ℹ️</span>
                  Rules
                </Button>

                <Button
                  variant="primary"
                  onClick={() => handleGameSelect(game)}
                  size="md"
                  className="flex-1"
                >
                  Play {game.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={handleBack} size="md">
            ← Back to Main Menu
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        title={selectedGame?.name + ' Rules'}
        showActions={false}
      >
        {selectedGame && (
          <div className="space-y-4">
            <p className="text-gray-300 mb-6">{selectedGame.description}</p>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                How to Play:
              </h4>
              <ul className="space-y-2">
                {selectedGame.rules.map((rule, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => {
                  setShowRules(false);
                  handleGameSelect(selectedGame);
                }}
                className="w-full"
              >
                Start Playing {selectedGame.name}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
