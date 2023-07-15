import OpenAI from 'openai';
type MessageType = 'user' | 'system';
export declare namespace ChatGPT {
    class Message {
        type: MessageType;
        text: string;
        private constructor();
        static user(text: string): Message;
        static system(text: string): Message;
    }
    class Client {
        private openai;
        private systemPrompt;
        readonly MODEL_NAME = "gpt-3.5-turbo-16k";
        readonly messages: Array<any>;
        constructor(openai: OpenAI, systemPrompt: string);
        say(message: string): Promise<string | null | undefined>;
        invoke(messages: Message[]): Promise<string | null | undefined>;
    }
}
export {};
