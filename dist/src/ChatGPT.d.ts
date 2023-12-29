import OpenAI from 'openai';
type MessageType = 'user' | 'system';
export declare namespace ChatGPT {
    export class Message {
        type: MessageType;
        text: string;
        private constructor();
        static user(text: string): Message;
        static system(text: string): Message;
    }
    interface ConstructorProps {
        apiKey?: string;
        systemPrompt?: string;
        openai?: (openai: OpenAI) => OpenAI;
    }
    export class Client {
        readonly MODEL_NAME = "gpt-3.5-turbo-16k";
        readonly messages: Array<any>;
        private openai;
        private readonly systemPrompt;
        constructor(props: ConstructorProps);
        say(message: string): Promise<string | null | undefined>;
        invoke(messages: Message[]): Promise<string | null | undefined>;
    }
    export {};
}
export {};
//# sourceMappingURL=ChatGPT.d.ts.map