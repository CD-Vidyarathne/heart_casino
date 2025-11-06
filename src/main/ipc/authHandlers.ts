import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/channels';
import { authService } from '../services/auth/authService';

export function registerAuthHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.AUTH.SIGN_UP,
    async (_event, email: string, password: string) => {
      try {
        const data = await authService.signUp(email, password);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign up failed',
        };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.AUTH.SIGN_IN,
    async (_event, email: string, password: string) => {
      try {
        const data = await authService.signIn(email, password);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign in failed',
        };
      }
    }
  );

  ipcMain.handle(IPC_CHANNELS.AUTH.SIGN_OUT, async () => {
    try {
      await authService.signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.AUTH.GET_SESSION, async () => {
    try {
      const session = await authService.getSession();
      return { success: true, data: session };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get session',
      };
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.AUTH.UPDATE_PROFILE,
    async (
      _event,
      userId: string,
      profileData: any,
      session?: { access_token: string; refresh_token?: string }
    ) => {
      try {
        console.log('Updating profile for user:', userId, 'with data:', profileData);
        const data = await authService.updateProfile(
          userId,
          profileData,
          session
        );
        console.log('Profile update successful:', data);
        return { success: true, data };
      } catch (error) {
        console.error('Profile update error:', error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Profile update failed',
        };
      }
    }
  );
}

