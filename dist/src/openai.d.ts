export declare function withLocalCache<T>(filename: string, fn: () => Promise<any>, isExpired?: (t: T) => Promise<boolean>): Promise<T>;
export declare function getOrCreateCompletion(version: number, prompt: string): Promise<unknown>;
