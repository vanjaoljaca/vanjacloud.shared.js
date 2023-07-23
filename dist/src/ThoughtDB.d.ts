import { Client } from "@notionhq/client";
import { AsyncIterableX as AsyncIx } from 'ix/asynciterable';
import moment from "moment";
export declare class TranslationDB {
}
export declare enum ThoughtType {
    note = "\uD83D\uDC3F\uFE0F",
    translation = "\uD83D\uDC7B"
}
export declare class NotionDB {
}
export declare class ThoughtDB {
    static proddbid: string;
    static testdbid: string;
    dbid: string;
    notion: Client;
    constructor(key: string, dbid: string);
    saveIt(text: string): Promise<string>;
    saveIt2(text: string, categoryEmoji?: string, tags?: any[]): Promise<string>;
    get(z?: {
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
    getLatest(duration?: moment.Duration, max?: number, type?: ThoughtType): AsyncGenerator<any, void, unknown>;
}
