import { registerBlackjackHandlers } from './blackjackHandlers';
import { registerHeartHandlers } from './heartHandlers';
import { registerUserHandlers } from './userHandlers';

export function registerAllIPCHandlers() {
  registerHeartHandlers();
  registerUserHandlers();
  registerBlackjackHandlers();
}
