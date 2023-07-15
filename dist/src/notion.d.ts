import { Client } from "@notionhq/client";
import moment from "moment";
export declare class TranslationDB {
}
export declare enum ThoughtType {
    note = "\uD83D\uDC3F\uFE0F",
    translation = "\uD83D\uDC7B"
}
export declare class ThoughtDB {
    static proddbid: string;
    static testdbid: string;
    dbid: string;
    notion: Client;
    constructor(key: string, dbid: string);
    saveIt(text: string): Promise<string>;
    getLatest(duration?: moment.Duration, max?: number, type?: ThoughtType): AsyncGenerator<any, void, unknown>;
}
