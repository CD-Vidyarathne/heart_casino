import { IPC_CHANNELS } from '../../shared/channels';

interface UserResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class UserAdapter {
  static async signUp(email: string, password: string) {
    const response = await window.electron.ipcRenderer.invoke<
      UserResponse<any>
    >(IPC_CHANNELS.USER.SIGN_UP, email, password);

    if (!response.success) {
      throw new Error(response.error || 'Sign up failed');
    }

    return response.data;
  }

  static async signIn(email: string, password: string) {
    const response = await window.electron.ipcRenderer.invoke<
      UserResponse<any>
    >(IPC_CHANNELS.USER.SIGN_IN, email, password);

    if (!response.success) {
      throw new Error(response.error || 'Sign in failed');
    }

    return response.data;
  }

  static async signOut() {
    const response = await window.electron.ipcRenderer.invoke<
      UserResponse<void>
    >(IPC_CHANNELS.USER.SIGN_OUT);

    if (!response.success) {
      throw new Error(response.error || 'Sign out failed');
    }
  }

  static async getSession() {
    const response = await window.electron.ipcRenderer.invoke<
      UserResponse<any>
    >(IPC_CHANNELS.USER.GET_SESSION);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get session');
    }

    return response.data;
  }

  static async getUserProfile(
    userId: string,
    session?: { access_token: string; refresh_token?: string }
  ) {
    const response = await window.electron.ipcRenderer.invoke<
      UserResponse<any>
    >(IPC_CHANNELS.USER.GET_USER_PROFILE, userId, session);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get user profile');
    }

    return response.data;
  }

  static async updateProfile(
    userId: string,
    profileData: {
      display_name: string;
      gender: string;
      avatar: string;
    },
    session?: { access_token: string; refresh_token?: string }
  ) {
    const response = await window.electron.ipcRenderer.invoke<
      UserResponse<any>
    >(IPC_CHANNELS.USER.UPDATE_PROFILE, userId, profileData, session);

    if (!response.success) {
      throw new Error(response.error || 'Profile update failed');
    }

    return response.data;
  }
}
