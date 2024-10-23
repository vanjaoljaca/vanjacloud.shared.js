import moment from "moment";
export declare enum Environment {
    PROD = "https://remote.vanja.oljaca.me:3000",
    DEV = "http://localhost:3000"
}
export interface Translation {
    text: string;
    to: string;
}
export declare class VanjaCloudClient {
    private readonly endpoint;
    constructor(endpoint: Environment);
    main(api: string, body: any): Promise<unknown>;
    explain(language: string, text: string): Promise<unknown>;
    languageRetrospective(language: string, duration?: moment.Duration): Promise<unknown>;
    retrospective(prompt?: string, duration?: moment.Duration): Promise<unknown>;
    uploadAudio(uri: string): Promise<boolean>;
    translate(text: string, opts?: {
        to?: string[];
        from?: string;
        traceId?: string;
    }): Promise<Translation[]>;
    private post;
    private getDefaultHeaders;
}
//# sourceMappingURL=VanjaCloudClient.d.ts.map