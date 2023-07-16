"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPT = void 0;
const openai_1 = __importDefault(require("openai"));
var ChatGPT;
(function (ChatGPT) {
    class Message {
        constructor(type, text) {
            this.type = type;
            this.text = text;
        }
        static user(text) {
            return new Message('user', text);
        }
        static system(text) {
            return new Message('system', text);
        }
    }
    ChatGPT.Message = Message;
    class Client {
        constructor(props) {
            this.MODEL_NAME = 'gpt-3.5-turbo-16k';
            // OpenAI.CompletionCreateParams.CreateCompletionRequestNonStreaming.messages
            this.messages = [];
            let openai = props.openai || (openai => openai);
            this.systemPrompt = props.systemPrompt || "Figure it out dummy";
            this.openai = openai(new openai_1.default({
                apiKey: props.apiKey
            }));
            this.messages = [];
            this.messages.push({
                role: 'system',
                content: this.systemPrompt
            });
        }
        async say(message) {
            var _a, _b;
            this.messages.push({
                role: 'user',
                content: message
            });
            let response = await this.openai.chat.completions.create({
                model: this.MODEL_NAME,
                messages: this.messages
            });
            this.messages.push(response.choices[0].message);
            return (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        }
        async invoke(messages) {
            var _a, _b;
            const chat = this.openai.chat;
            const m = [
                Message.system(this.systemPrompt),
                ...messages
            ]; //?
            try {
                // return 'disabled';
                let response = await chat.completions.create({
                    model: this.MODEL_NAME,
                    messages: m.map(m => {
                        return {
                            role: m.type,
                            content: m.text
                        };
                    })
                });
                this.messages.push(response.choices[0].message);
                return (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            }
            catch (error) {
                console.log(error); //?
            }
        }
    }
    ChatGPT.Client = Client;
})(ChatGPT = exports.ChatGPT || (exports.ChatGPT = {}));
//# sourceMappingURL=ChatGPT.js.map