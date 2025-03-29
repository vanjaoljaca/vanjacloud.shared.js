"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MochiAPI = exports.Environment = exports.VanjaCloudClient = exports.LanguageTeacher = exports.ChatGPT = exports.AzureTranslate = exports.Content = exports.Thought = void 0;
const keys_1 = __importDefault(require("../keys"));
exports.Thought = __importStar(require("./ThoughtDB"));
exports.Content = __importStar(require("./ContentDB"));
var AzureTranslate_1 = require("./AzureTranslate");
Object.defineProperty(exports, "AzureTranslate", { enumerable: true, get: function () { return AzureTranslate_1.AzureTranslate; } });
var ChatGPT_1 = require("./ChatGPT");
Object.defineProperty(exports, "ChatGPT", { enumerable: true, get: function () { return ChatGPT_1.ChatGPT; } });
var LanguageTeacher_1 = require("./LanguageTeacher");
Object.defineProperty(exports, "LanguageTeacher", { enumerable: true, get: function () { return LanguageTeacher_1.LanguageTeacher; } });
var VanjaCloudClient_1 = require("./VanjaCloudClient");
Object.defineProperty(exports, "VanjaCloudClient", { enumerable: true, get: function () { return VanjaCloudClient_1.VanjaCloudClient; } });
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return VanjaCloudClient_1.Environment; } });
var mochi_1 = require("./mochi/mochi");
Object.defineProperty(exports, "MochiAPI", { enumerable: true, get: function () { return mochi_1.MochiAPI; } });
exports.default = {
    Keys: keys_1.default, // lol fix this dumbness
};
//# sourceMappingURL=index.js.map