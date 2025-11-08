import { registerHeartHandlers } from './heartRegisters';
import { registerUserHandlers } from './userHandlers';

export function registerAllIPCHandlers() {
  registerHeartHandlers();
  registerUserHandlers();
}
