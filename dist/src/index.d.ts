import {ThoughtDB} from './notion';
import {getOrCreateCompletion} from "./openai";
declare const _default: {
  Keys: {
    openai: any;
    notion: any;
    spotify: {
      clientId: any;
      clientSecret: any;
    };
  };
  myThing: number;
  ThoughtDB: typeof ThoughtDB;
  getOrCreateCompletion: typeof getOrCreateCompletion;
};
export default _default;
