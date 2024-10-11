import { Client } from "@notionhq/client";
import { AsyncIterableX as AsyncIx } from 'ix/asynciterable';
import moment from "moment";
import { Translation } from "./AzureTranslate";
export declare class TranslationDB {
}
export declare enum ThoughtType {
    note = "\uD83D\uDC3F\uFE0F",
    translation = "\uD83D\uDC7B"
}
export declare class ThoughtDB {
    static ThoughtType: typeof ThoughtType;
    static proddbid: string;
    static testdbid: string;
    dbid: string;
    notion: Client;
    constructor(key: string, dbid: string);
    saveTranslation(translations: Translation[], preferredLanguage?: string): Promise<import("@notionhq/client/build/src/api-endpoints").CreatePageResponse>;
    saveIt2(text: string, categoryEmoji?: string, tags?: any[], opts?: {}): Promise<import("@notionhq/client/build/src/api-endpoints").CreatePageResponse>;
    getAll(z?: {
        filter?: {
            type?: ThoughtType;
            after?: moment.Moment;
            before?: moment.Moment;
        };
        opts?: {
            pageSize?: number;
        };
        limit?: number;
    }): AsyncIx<{
        id: any;
        tags: any;
        text: any;
        type: any;
        date: moment.Moment;
    }>;
    getAllRaw(filter?: {
        type?: ThoughtType;
        after?: moment.Moment;
        before?: moment.Moment;
    }, opts?: {
        pageSize?: number;
    }, limit?: number): AsyncGenerator<{
        id: any;
        tags: any;
        text: any;
        type: any;
        date: moment.Moment;
    }, void, unknown>;
    update(id: string, data: {
        text?: string;
        tags?: string[];
        date?: moment.Moment;
        type?: ThoughtType;
    }): Promise<import("@notionhq/client/build/src/api-endpoints").UpdatePageResponse>;
    getLatest(duration?: moment.Duration, max?: number, type?: ThoughtType): AsyncIx<{
        id: any;
        tags: any;
        text: any;
        type: any;
        date: moment.Moment;
    }>;
    getLatestRaw(duration?: moment.Duration, max?: number, type?: ThoughtType): AsyncGenerator<{
        id: any;
        tags: any;
        text: any;
        type: any;
        date: moment.Moment;
    }, void, unknown>;
    static toThought(notionItem: any): {
        id: any;
        tags: any;
        text: any;
        type: any;
        date: moment.Moment;
    };
}
//# sourceMappingURL=ThoughtDB.d.ts.map