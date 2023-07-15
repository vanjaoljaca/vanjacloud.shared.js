export declare class AzureTranslate {
    private readonly key;
    private readonly endpoint?;
    private readonly location?;
    private readonly traceIdGenerator;
    constructor(key: string, endpoint?: string | undefined, location?: string | undefined, traceIdGenerator?: () => string);
    translate(text: string, opts?: {
        to?: string[];
        from?: string;
        traceId?: string;
    }): Promise<{
        text: string;
        to: string;
    }[]>;
}
