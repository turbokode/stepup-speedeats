interface IJob {
  key: string;
  handle: (options?: unknown) => Promise<void>;
}
