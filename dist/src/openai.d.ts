export declare function withLocalCache<T>(filename: string, fn: () => Promise<any>): Promise<T>;

export declare function getOrCreateCompletion(version: number, prompt: string): Promise<unknown>;
