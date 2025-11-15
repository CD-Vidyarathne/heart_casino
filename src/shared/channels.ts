export const IPC_CHANNELS = {
  HEART: {
    FETCH_PUZZLE: 'heart:fetch-puzzle',
    VALIDATE_SOLUTION: 'heart:validate-solution',
  },
  USER: {
    SIGN_UP: 'user:sign-up',
    SIGN_IN: 'user:sign-in',
    SIGN_OUT: 'user:sign-out',
    GET_SESSION: 'user:get-session',
    GET_USER_PROFILE: 'user:get-user-profile',
    UPDATE_PROFILE: 'user:update-profile',
    UPDATE_BALANCE: 'user:update-balance',
  },
  BLACKJACK: {
    START_GAME: 'blackjack:start-game',
    HIT: 'blackjack:hit',
    STAND: 'blackjack:stand',
    DOUBLE_DOWN: 'blackjack:double-down',
    GET_GAME_STATE: 'blackjack:get-game-state',
  },
} as const;

type ChannelValues<T> = T extends object
  ? { [K in keyof T]: ChannelValues<T[K]> }[keyof T]
  : T;

export type Channel = ChannelValues<typeof IPC_CHANNELS>;
