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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Community = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const level_1 = require("./level");
const category_1 = require("./category");
const question_1 = require("./question");
const CommunitySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    levels: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Level' }], // Referencing Level model
    categories: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category' }], // Referencing Category model
    questions: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Question' }], // Referencing Question model
});
// Pre-deleteOne hook to delete related levels, categories, and questions
CommunitySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const community = this; // Explicitly cast 'this' to ICommunity
        // Delete related levels
        await level_1.Level.deleteMany({ _id: { $in: community.levels } });
        // Delete related categories
        await category_1.Category.deleteMany({ _id: { $in: community.categories } });
        // Delete related questions
        await question_1.Question.deleteMany({ _id: { $in: community.questions } });
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.Community = mongoose_1.default.model('Community', CommunitySchema);
//# sourceMappingURL=community.js.map