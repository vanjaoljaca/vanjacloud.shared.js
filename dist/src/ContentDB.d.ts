import { Client } from "@notionhq/client";
import { Moment } from "moment";
export declare class TranslationDB {
}
export declare class ContentDB {
    static proddbid: string;
    static testdbid: string;
    dbid: string;
    notion: Client;
    constructor(key: string, dbid: string);
    save(title: string, tags?: string[], transcript?: string, opts?: {
        filePath?: string;
        date: Moment;
    }): Promise<import("@notionhq/client/build/src/api-endpoints").CreatePageResponse>;
    update(filePath: string, opts?: {
        title?: string;
        tags?: string[];
        transcript?: string;
        date?: Moment;
    }): Promise<import("@notionhq/client/build/src/api-endpoints").UpdatePageResponse>;
    get(filePath: string): Promise<import("@notionhq/client/build/src/api-endpoints").PartialPageObjectResponse | null>;
    private static createTranscriptBlock;
}
//# sourceMappingURL=ContentDB.d.ts.map