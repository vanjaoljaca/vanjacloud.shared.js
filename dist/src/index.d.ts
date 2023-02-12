import {ThoughtDB} from './notion';
import {AzureTranslate} from "./AzureTranslate";

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
  };
  ThoughtDB: typeof ThoughtDB;
  AzureTranslate: typeof AzureTranslate;
};
export default _default;
