export const IPC_CHANNELS = {
  HEART: {
    FETCH_PUZZLE: 'heart:fetch-puzzle',
    VALIDATE_SOLUTION: 'heart:validate-solution',
  },
} as const;

type ChannelValues<T> = T extends object
  ? { [K in keyof T]: ChannelValues<T[K]> }[keyof T]
  : T;

export type Channel = ChannelValues<typeof IPC_CHANNELS>;
