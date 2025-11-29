import { registerBlackjackHandlers } from './blackjackHandlers';
import { registerGameHistoryHandlers } from './gameHistoryHandlers';
import { registerHeartHandlers } from './heartHandlers';
import { registerUserHandlers } from './userHandlers';

export function registerAllIPCHandlers() {
  registerHeartHandlers();
  registerUserHandlers();
  registerBlackjackHandlers();
  registerGameHistoryHandlers();
}
