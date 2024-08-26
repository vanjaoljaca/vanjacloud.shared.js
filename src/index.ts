import keys from '../keys';
export * as Thought from './ThoughtDB';
export * as Content from './ContentDB';
export { AzureTranslate } from "./AzureTranslate";
export { ChatGPT } from "./ChatGPT";
export { LanguageTeacher } from "./LanguageTeacher";
export { VanjaCloudClient, Environment } from "./VanjaCloudClient";

export default {
    Keys: keys // lol fix this dumbness
}