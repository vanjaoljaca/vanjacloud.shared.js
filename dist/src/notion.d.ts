import { Client } from "@notionhq/client";
export declare class ThoughtDB {
    static proddbid: string;
    static testdbid: string;
    dbid: string;
    notion: Client;
    constructor(key: string, dbid: string);
    test(): Promise<any>;
    saveIt(text: string): Promise<string>;
}
