export type Logger = {
  log: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
};
