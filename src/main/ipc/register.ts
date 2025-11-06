import { registerHeartHandlers } from './heartRegisters';
import { registerAuthHandlers } from './authHandlers';

export function registerAllIPCHandlers() {
  registerHeartHandlers();
  registerAuthHandlers();
}
