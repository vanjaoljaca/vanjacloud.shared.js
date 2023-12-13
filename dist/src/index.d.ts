export * as Thought from './ThoughtDB';
export { AzureTranslate } from "./AzureTranslate";
export { ChatGPT } from "./ChatGPT";
export { LanguageTeacher } from "./LanguageTeacher";
declare const _default: {
    Keys: {
        openai: any;
        notion: any;
        spotify: {
            clientId: any;
            clientSecret: any;
        };
        azure: {
            translate: any;
        };
        huggingface: any;
        mem: any;
    };
};
export default _default;
