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
exports.deleteCommunity = exports.updateCommunity = exports.getCommunityById = exports.getCommunities = exports.createCommunity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const community_1 = require("../models/community");
const level_1 = require("../models/level");
const category_1 = require("../models/category");
const question_1 = require("../models/question");
// Create a new community
const createCommunity = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, levels, categories, questions } = req.body;
        // Validate community name
        if (!name) {
            throw new Error('Community name is required');
        }
        // Initialize arrays for holding object ids
        const levelIds = [];
        const categoryIds = [];
        const questionIds = [];
        // Handle levels array
        if (Array.isArray(levels)) {
            for (const level of levels) {
                if (!level.name) {
                    throw new Error('Each level must have a name');
                }
                const newLevel = new level_1.Level({
                    name: level.name,
                    categories: level.categories || [], // Optional categories
                });
                // Save level and add its ID to the array
                const savedLevel = await newLevel.save({ session });
                levelIds.push(savedLevel._id);
            }
        }
        // Handle categories array
        if (Array.isArray(categories)) {
            for (const category of categories) {
                if (!category.name) {
                    throw new Error('Each category must have a name');
                }
                const newCategory = new category_1.Category({
                    name: category.name,
                    community: req.body.community || '', // Optionally set community if provided
                    questions: category.questions || [], // Optional questions
                    level: category.level || null, // Optional level reference
                });
                // Save category and add its ID to the array
                const savedCategory = await newCategory.save({ session });
                categoryIds.push(savedCategory._id);
            }
        }
        // Handle questions array
        if (Array.isArray(questions)) {
            for (const question of questions) {
                if (!question.text) {
                    throw new Error('Each question must have text');
                }
                const newQuestion = new question_1.Question({
                    text: question.text,
                    category: question.category || null, // Optional category reference
                });
                // Save question and add its ID to the array
                const savedQuestion = await newQuestion.save({ session });
                questionIds.push(savedQuestion._id);
            }
        }
        // Create the community with associated levels, categories, and questions
        const newCommunity = new community_1.Community({
            name,
            levels: levelIds, // Associate created level IDs with the community
            categories: categoryIds, // Associate created category IDs with the community
            questions: questionIds, // Associate created question IDs with the community
        });
        // Save the community
        await newCommunity.save({ session });
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        res.status(201).json(newCommunity);
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: error.message });
    }
};
exports.createCommunity = createCommunity;
// Get all communities
const getCommunities = async (req, res) => {
    try {
        const communities = await community_1.Community.find()
            .populate('levels') // Populate associated levels
            .populate('categories') // Populate associated categories
            .populate('questions'); // Populate associated questions
        res.status(200).json(communities);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCommunities = getCommunities;
// Get a single community by ID
const getCommunityById = async (req, res) => {
    try {
        const { communityId } = req.params;
        // Validate the ID
        if (!(0, mongoose_1.isValidObjectId)(communityId)) {
            return res.status(400).json({ error: 'Invalid community ID' });
        }
        const community = await community_1.Community.findById(communityId)
            .populate('levels') // Populate associated levels
            .populate('categories') // Populate associated categories
            .populate('questions'); // Populate associated questions
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }
        res.status(200).json(community);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCommunityById = getCommunityById;
// Update a community by ID
const updateCommunity = async (req, res) => {
    try {
        const { name, levels, categories, questions } = req.body;
        // Validate levels, categories, and questions if being updated
        const updateData = { name };
        if (Array.isArray(levels)) {
            updateData.levels = levels;
        }
        if (Array.isArray(categories)) {
            updateData.categories = categories;
        }
        if (Array.isArray(questions)) {
            updateData.questions = questions;
        }
        const updatedCommunity = await community_1.Community.findByIdAndUpdate(req.params.communityId, updateData, { new: true })
            .populate('levels') // Populate associated levels
            .populate('categories') // Populate associated categories
            .populate('questions'); // Populate associated questions
        if (!updatedCommunity) {
            return res.status(404).json({ message: 'Community not found' });
        }
        res.status(200).json(updatedCommunity);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateCommunity = updateCommunity;
// Delete a community by ID
const deleteCommunity = async (req, res) => {
    try {
        const community = await community_1.Community.findById(req.params.communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Trigger pre-remove hook to delete related data
        await community.deleteOne();
        res.status(200).json({ message: 'Community and related data deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteCommunity = deleteCommunity;
//# sourceMappingURL=communityController.js.map