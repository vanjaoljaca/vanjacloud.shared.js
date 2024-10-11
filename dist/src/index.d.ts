export * as Thought from "./ThoughtDB";
export * as Content from "./ContentDB";
export { AzureTranslate } from "./AzureTranslate";
export { ChatGPT } from "./ChatGPT";
export { LanguageTeacher } from "./LanguageTeacher";
export { VanjaCloudClient, Environment, Translation } from "./VanjaCloudClient";
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
        twitter: {
            consumer: {
                apiKey: any;
                apiKeySecret: any;
            };
            bearerToken: any;
            accessToken: any;
            accessTokenSecret: any;
            oauthToken: {
                oauth_token: any;
                oauth_token_secret: any;
            };
            oauth2: {
                clientId: any;
                clientSecret: any;
            };
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map