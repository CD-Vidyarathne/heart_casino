import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card as UICard, TitleBar, Modal, Input } from '../components';
import { BlackjackAdapter } from '../adapters/blackjackAdapter';
import { useAuth } from '../contexts/UserContext';
import { getCardImage } from '../lib/utils';
import type { BlackjackGame, Card } from '../../shared/blackjackTypes';

type AlertType = 'success' | 'error' | 'warning' | 'info';

export const BlackjackGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [gameState, setGameState] = useState<'betting' | 'playing'>('betting');
  const [game, setGame] = useState<BlackjackGame | null>(null);
  const [betAmount, setBetAmount] = useState<string>('10');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info' as AlertType,
    title: '',
    message: '',
  });

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertModal({ isOpen: true, type, title, message });
  };

  const getAlertIcon = () => {
    switch (alertModal.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '!';
      default:
        return 'i';
    }
  };

  const getAlertColor = () => {
    switch (alertModal.type) {
      case 'success':
        return 'border-green-500/50 text-green-400';
      case 'error':
        return 'border-red-500/50 text-red-400';
      case 'warning':
        return 'border-yellow-500/50 text-yellow-400';
      default:
        return 'border-purple-500/50 text-purple-400';
    }
  };

  const handleStartGame = async () => {
    const bet = parseInt(betAmount);
    const balance = profile?.balance || 0;

    if (isNaN(bet) || bet <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    if (bet > balance) {
      setError('Insufficient balance');
      return;
    }

    if (bet < 10) {
      setError('Minimum bet is 10 coins');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newGame = await BlackjackAdapter.startGame(user!.id, bet);
      setGame(newGame);
      setGameState('playing');

      if (newGame.state === 'game-over') {
        handleGameOver(newGame);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHit = async () => {
    if (!game) return;

    setIsLoading(true);
    try {
      const updatedGame = await BlackjackAdapter.hit(game.gameId);
      setGame(updatedGame);

      if (updatedGame.state === 'game-over') {
        handleGameOver(updatedGame);
      }
    } catch (err) {
      showAlert(
        'error',
        'Error',
        err instanceof Error ? err.message : 'Failed to hit'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStand = async () => {
    if (!game) return;

    setIsLoading(true);
    try {
      const updatedGame = await BlackjackAdapter.stand(game.gameId);
      setGame(updatedGame);
      handleGameOver(updatedGame);
    } catch (err) {
      showAlert(
        'error',
        'Error',
        err instanceof Error ? err.message : 'Failed to stand'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoubleDown = async () => {
    if (!game) return;

    const balance = profile?.balance || 0;
    if (game.bet > balance) {
      showAlert(
        'error',
        'Insufficient Balance',
        "You don't have enough coins to double down"
      );
      return;
    }

    setIsLoading(true);
    try {
      const updatedGame = await BlackjackAdapter.doubleDown(game.gameId);
      setGame(updatedGame);
      handleGameOver(updatedGame);
    } catch (err) {
      showAlert(
        'error',
        'Error',
        err instanceof Error ? err.message : 'Failed to double down'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameOver = (finishedGame: BlackjackGame) => {
    if (!finishedGame.result) return;

    setTimeout(() => {
      const messages = {
        'player-win': {
          type: 'success' as AlertType,
          title: 'You Win',
          message: `You won ${finishedGame.payout} coins`,
        },
        'dealer-win': {
          type: 'error' as AlertType,
          title: 'Dealer Wins',
          message: `You lost ${finishedGame.bet} coins`,
        },
        push: {
          type: 'info' as AlertType,
          title: 'Push',
          message: `It's a tie. Your bet of ${finishedGame.bet} coins has been returned`,
        },
        'player-blackjack': {
          type: 'success' as AlertType,
          title: 'Blackjack',
          message: `Blackjack! You won ${finishedGame.payout} coins`,
        },
      };

      const result = messages[finishedGame.result];
      showAlert(result.type, result.title, result.message);
    }, 500);
  };

  const handleNewGame = () => {
    setGame(null);
    setGameState('betting');
    setBetAmount('10');
    setError(null);
  };

  const renderCard = (card: Card, hidden: boolean = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-lg border-2 border-red-400 flex items-center justify-center">
          <div className="text-3xl text-white poppins-bold">?</div>
        </div>
      );
    }

    return (
      <img
        src={getCardImage(card)}
        alt={`${card.rank} of ${card.suit}`}
        className="w-16 h-24 rounded-lg shadow-lg border-2 border-purple-500/30"
      />
    );
  };

  const renderBettingScreen = () => (
    <div className="space-y-6">
      <UICard className="p-6">
        <h3 className="text-2xl text-white luckiest-guy mb-4 text-center">
          Place Your Bet
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-white poppins-medium mb-2">
              Your Balance:{' '}
              <span className="text-green-400">{profile?.balance || 0}</span>{' '}
              coins
            </label>
          </div>

          <Input
            type="number"
            label="Bet Amount"
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={setBetAmount}
            error={error || undefined}
          />

          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((amount) => (
              <Button
                key={amount}
                variant="secondary"
                size="sm"
                onClick={() => setBetAmount(amount.toString())}
                disabled={(profile?.balance || 0) < amount}
              >
                {amount}
              </Button>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={handleStartGame}
            disabled={isLoading}
            className="w-full text-lg py-4"
          >
            {isLoading ? 'Starting...' : 'Deal Cards'}
          </Button>
        </div>
      </UICard>

      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => navigate('/game-selection')}
          size="md"
        >
          Back to Game Selection
        </Button>
      </div>
    </div>
  );

  const renderGameScreen = () => {
    if (!game) return null;

    const canDoubleDown =
      game.state === 'player-turn' &&
      game.playerHand.cards.length === 2 &&
      (profile?.balance || 0) >= game.bet;

    const showDealerSecondCard =
      game.state === 'dealer-turn' || game.state === 'game-over';

    return (
      <div className="space-y-6">
        <UICard className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-xl text-white luckiest-guy mb-2">Dealer</h3>
            <p className="text-gray-300 poppins">
              Score: {showDealerSecondCard ? game.dealerHand.score : '?'}
            </p>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {game.dealerHand.cards.map((card, index) => (
              <div
                key={index}
                className="transform transition-transform hover:scale-105"
              >
                {renderCard(card, index === 1 && !showDealerSecondCard)}
              </div>
            ))}
          </div>
        </UICard>

        <UICard className="p-4 border-2 border-purple-500/50">
          <div className="text-center mb-4">
            <h3 className="text-xl text-white luckiest-guy mb-2">Your Hand</h3>
            <p className="text-gray-300 poppins">
              Score:{' '}
              <span
                className={`font-bold ${game.playerHand.isBust ? 'text-red-400' : 'text-green-400'}`}
              >
                {game.playerHand.score}
              </span>
            </p>
            {game.playerHand.isBlackjack && (
              <p className="text-yellow-400 poppins-bold text-sm mt-1">
                BLACKJACK
              </p>
            )}
            {game.playerHand.isBust && (
              <p className="text-red-400 poppins-bold text-sm mt-1">BUST</p>
            )}
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-4">
            {game.playerHand.cards.map((card, index) => (
              <div
                key={index}
                className="transform transition-transform hover:scale-105"
              >
                {renderCard(card)}
              </div>
            ))}
          </div>

          {game.state === 'player-turn' && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                onClick={handleHit}
                disabled={isLoading}
              >
                Hit
              </Button>
              <Button
                variant="secondary"
                onClick={handleStand}
                disabled={isLoading}
              >
                Stand
              </Button>
              {canDoubleDown && (
                <Button
                  variant="danger"
                  onClick={handleDoubleDown}
                  disabled={isLoading}
                  className="col-span-2"
                >
                  Double Down
                </Button>
              )}
            </div>
          )}

          {game.state === 'game-over' && (
            <Button
              variant="primary"
              onClick={handleNewGame}
              className="w-full"
            >
              New Game
            </Button>
          )}
        </UICard>

        <UICard className="p-4 bg-purple-900/30">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 poppins">Bet:</span>
            <span className="text-white poppins-bold">{game.bet} coins</span>
          </div>
        </UICard>

        {game.state === 'game-over' && (
          <div className="text-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/game-selection')}
              size="md"
            >
              Back to Game Selection
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="screen-container">
      <div className="screen-content">
        <TitleBar
          title="Blackjack"
          subtitle={
            gameState === 'betting'
              ? 'Place your bet to start'
              : 'Beat the dealer'
          }
          className="mb-6"
        />

        {gameState === 'betting' ? renderBettingScreen() : renderGameScreen()}
      </div>

      <Modal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        showActions={false}
      >
        <div className={`border-2 ${getAlertColor()} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`text-6xl ${getAlertColor()} font-bold`}>
              {getAlertIcon()}
            </div>
            <p className="text-gray-200 poppins text-base leading-relaxed">
              {alertModal.message}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
          className="w-full"
        >
          OK
        </Button>
      </Modal>
    </div>
  );
};
