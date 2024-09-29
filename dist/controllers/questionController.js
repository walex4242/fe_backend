"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestions = exports.deleteQuestion = exports.updateQuestion = exports.addQuestion = void 0;
const question_1 = require("../models/question");
const community_1 = require("../models/community");
const category_1 = require("../models/category");
const level_1 = require("../models/level");
const mongoose_1 = __importDefault(require("mongoose"));
// Helper function to check if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
// Add a new question
const addQuestion = async (req, res) => {
    try {
        const { communityId, categoryId, levelId } = req.params;
        // Check if community exists
        const community = await community_1.Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }
        // Check if category exists
        const category = await category_1.Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        // Check if level exists
        const level = await level_1.Level.findById(levelId);
        if (!level) {
            return res.status(404).json({ error: 'Level not found' });
        }
        // Create new question
        const newQuestion = new question_1.Question({
            ...req.body,
            community: communityId,
            category: categoryId,
            level: levelId,
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addQuestion = addQuestion;
// Update a question
const updateQuestion = async (req, res) => {
    try {
        const { questionId, communityId, categoryId, levelId } = req.params;
        // Ensure question, community, category, and level exist
        const question = await question_1.Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        if (!isValidObjectId(communityId) ||
            !(await community_1.Community.findById(communityId))) {
            return res.status(404).json({ error: 'Community not found' });
        }
        if (!isValidObjectId(categoryId) ||
            !(await category_1.Category.findById(categoryId))) {
            return res.status(404).json({ error: 'Category not found' });
        }
        if (!isValidObjectId(levelId) || !(await level_1.Level.findById(levelId))) {
            return res.status(404).json({ error: 'Level not found' });
        }
        // Update the question
        const updatedQuestion = await question_1.Question.findByIdAndUpdate(questionId, {
            ...req.body,
            community: communityId,
            category: categoryId,
            level: levelId,
        }, { new: true });
        res.status(200).json(updatedQuestion);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateQuestion = updateQuestion;
// Delete a question
const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const deletedQuestion = await question_1.Question.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ message: 'Question deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteQuestion = deleteQuestion;
// Get questions by community, level, and category
const getQuestions = async (req, res) => {
    const { communityId, levelId, categoryId } = req.params;
    try {
        // Ensure all related entities exist
        if (!isValidObjectId(communityId) ||
            !(await community_1.Community.findById(communityId))) {
            return res.status(404).json({ error: 'Community not found' });
        }
        if (!isValidObjectId(levelId) || !(await level_1.Level.findById(levelId))) {
            return res.status(404).json({ error: 'Level not found' });
        }
        if (!isValidObjectId(categoryId) ||
            !(await category_1.Category.findById(categoryId))) {
            return res.status(404).json({ error: 'Category not found' });
        }
        // Fetch questions based on community, level, and category
        const questions = await question_1.Question.find({
            community: communityId,
            level: levelId,
            category: categoryId,
        });
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getQuestions = getQuestions;
//# sourceMappingURL=questionController.js.map