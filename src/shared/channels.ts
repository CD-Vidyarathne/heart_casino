export const IPC_CHANNELS = {
  HEART: {
    FETCH_PUZZLE: 'heart:fetch-puzzle',
    VALIDATE_SOLUTION: 'heart:validate-solution',
  },
  AUTH: {
    SIGN_UP: 'auth:sign-up',
    SIGN_IN: 'auth:sign-in',
    SIGN_OUT: 'auth:sign-out',
    GET_SESSION: 'auth:get-session',
    UPDATE_PROFILE: 'auth:update-profile',
  },
} as const;

type ChannelValues<T> = T extends object
  ? { [K in keyof T]: ChannelValues<T[K]> }[keyof T]
  : T;

export type Channel = ChannelValues<typeof IPC_CHANNELS>;
