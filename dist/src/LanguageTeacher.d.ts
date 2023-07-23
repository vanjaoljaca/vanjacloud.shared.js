import { ThoughtDB } from "./ThoughtDB";
import { ChatGPT } from "./ChatGPT";
export declare class LanguageTeacher {
    private chat;
    private db?;
    constructor(chat: ChatGPT.Client, db?: ThoughtDB | undefined);
    retrospective(): Promise<string | null | undefined>;
    retrospective2(translations: string[]): Promise<string | null | undefined>;
}
