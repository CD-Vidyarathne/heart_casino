import { IPC_CHANNELS } from '../../shared/channels';

interface AuthResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class AuthAdapter {
  static async signUp(email: string, password: string) {
    const response = await window.electron.ipcRenderer.invoke<AuthResponse<any>>(
      IPC_CHANNELS.AUTH.SIGN_UP,
      email,
      password
    );

    if (!response.success) {
      throw new Error(response.error || 'Sign up failed');
    }

    return response.data;
  }

  static async signIn(email: string, password: string) {
    const response = await window.electron.ipcRenderer.invoke<AuthResponse<any>>(
      IPC_CHANNELS.AUTH.SIGN_IN,
      email,
      password
    );

    if (!response.success) {
      throw new Error(response.error || 'Sign in failed');
    }

    return response.data;
  }

  static async signOut() {
    const response = await window.electron.ipcRenderer.invoke<AuthResponse<void>>(
      IPC_CHANNELS.AUTH.SIGN_OUT
    );

    if (!response.success) {
      throw new Error(response.error || 'Sign out failed');
    }
  }

  static async getSession() {
    const response = await window.electron.ipcRenderer.invoke<AuthResponse<any>>(
      IPC_CHANNELS.AUTH.GET_SESSION
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to get session');
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
    const response = await window.electron.ipcRenderer.invoke<AuthResponse<any>>(
      IPC_CHANNELS.AUTH.UPDATE_PROFILE,
      userId,
      profileData,
      session
    );

    if (!response.success) {
      throw new Error(response.error || 'Profile update failed');
    }

    return response.data;
  }
}

