export interface Translation {
    text: string;
    to: string;
}
interface AzureTranslateOpts {
    endpoint?: string;
    location?: string;
    traceIdGenerator?: () => string;
}
export declare class AzureTranslate {
    private readonly key;
    private readonly endpoint;
    private readonly location;
    private readonly traceIdGenerator;
    constructor(key: string, opts?: AzureTranslateOpts);
    translate(text: string, opts?: {
        to?: string[];
        from?: string;
        traceId?: string;
    }): Promise<Translation[]>;
}
export {};
