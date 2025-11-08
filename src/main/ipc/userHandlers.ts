import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/channels';
import { userService } from '../services/user/userService';

export function registerUserHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.USER.SIGN_UP,
    async (_event, email: string, password: string) => {
      try {
        const data = await userService.signUp(email, password);
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
    IPC_CHANNELS.USER.SIGN_IN,
    async (_event, email: string, password: string) => {
      try {
        const data = await userService.signIn(email, password);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign in failed',
        };
      }
    }
  );

  ipcMain.handle(IPC_CHANNELS.USER.SIGN_OUT, async () => {
    try {
      await userService.signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.USER.GET_SESSION, async () => {
    try {
      const session = await userService.getSession();
      return { success: true, data: session };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get session',
      };
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.USER.GET_USER_PROFILE,
    async (
      _event,
      userId: string,
      session?: { access_token: string; refresh_token?: string }
    ) => {
      try {
        const data = await userService.getUserProfile(userId, session);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to get user profile',
        };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.USER.UPDATE_PROFILE,
    async (
      _event,
      userId: string,
      profileData: any,
      session?: { access_token: string; refresh_token?: string }
    ) => {
      try {
        console.log(
          'Updating profile for user:',
          userId,
          'with data:',
          profileData
        );
        const data = await userService.updateProfile(
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
