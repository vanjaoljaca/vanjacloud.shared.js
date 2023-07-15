import OpenAI from 'openai';
import Chat = OpenAI.Chat;


type MessageType = 'user' | 'system';

export namespace ChatGPT {

    export class Message {
        private constructor(public type: MessageType, public text: string) { }

        static user(text: string): Message {
            return new Message('user', text);
        }

        static system(text: string): Message {
            return new Message('system', text);
        }
    }

    export class Client {
        readonly MODEL_NAME = 'gpt-3.5-turbo-16k';
        // OpenAI.CompletionCreateParams.CreateCompletionRequestNonStreaming.messages
        readonly messages: Array<any> = []

        constructor(private openai: OpenAI, private systemPrompt: string) {
            this.messages = []
            this.messages.push({
                role: 'system',
                content: systemPrompt
            });
        }

        public async say(message: string): Promise<string | null | undefined> {
            this.messages.push({
                role: 'user',
                content: message
            });

            let response = await this.openai.chat.completions.create({
                model: this.MODEL_NAME,
                messages: this.messages
            });
            this.messages.push(response.choices[0].message);
            return response.choices[0]?.message?.content;
        }

        public async invoke(messages: Message[]): Promise<string | null | undefined> {
            const chat: Chat = this.openai.chat;

            const m = [
                Message.system(this.systemPrompt),
                ...messages
            ] //?
            try {
                // return 'disabled';
                let response = await chat.completions.create({
                    model: this.MODEL_NAME,

                    messages: m.map(m => {
                        return {
                            role: m.type,
                            content: m.text
                        }
                    })
                });

                this.messages.push(response.choices[0].message);
                return response.choices[0]?.message?.content;
            } catch (error) {
                console.log(error) //?
            }
        }
    }
}