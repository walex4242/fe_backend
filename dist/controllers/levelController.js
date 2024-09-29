"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevelByName = exports.getLevelById = exports.deleteLevel = exports.updateLevel = exports.addLevel = void 0;
const level_1 = require("../models/level");
const mongoose_1 = __importDefault(require("mongoose"));
const community_1 = require("../models/community"); // Import Community model for validation
// Helper function to check if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
// Create a new level
const addLevel = async (req, res) => {
    try {
        const { communityId } = req.params;
        // Validate community existence
        const community = await community_1.Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }
        // Create the new level
        const newLevel = new level_1.Level({
            ...req.body,
            community: communityId, // Associate the level with the community
        });
        // Save the new level
        await newLevel.save();
        // Optionally, you can push the level into the community's levels array
        community.levels.push(newLevel._id);
        await community.save();
        res.status(201).json(newLevel);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addLevel = addLevel;
// Update a level
const updateLevel = async (req, res) => {
    try {
        const { levelId } = req.params;
        // Check if the level exists
        const updatedLevel = await level_1.Level.findByIdAndUpdate(levelId, req.body, {
            new: true,
        });
        if (!updatedLevel) {
            return res.status(404).json({ message: 'Level not found' });
        }
        res.status(200).json(updatedLevel);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateLevel = updateLevel;
// Delete a level
const deleteLevel = async (req, res) => {
    try {
        const { levelId } = req.params;
        // Find the level by ID
        const deletedLevel = await level_1.Level.findByIdAndDelete(levelId);
        if (!deletedLevel) {
            return res.status(404).json({ message: 'Level not found' });
        }
        // Optionally, remove the level from its associated community
        await community_1.Community.updateMany({ levels: levelId }, { $pull: { levels: levelId } });
        res.status(200).json({ message: 'Level deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteLevel = deleteLevel;
// Get Level by ID
const getLevelById = async (req, res) => {
    try {
        const { levelId } = req.params;
        console.log('Received levelId:', levelId);
        if (!mongoose_1.default.isValidObjectId(levelId)) {
            return res.status(400).json({ message: 'Invalid level ID format' });
        }
        const level = await level_1.Level.findById(levelId).populate('categories community questions');
        if (!level) {
            console.log('Level not found for ID:', levelId);
            return res.status(404).json({ message: 'Level not found' });
        }
        res.status(200).json(level);
    }
    catch (error) {
        console.error('Error fetching level by ID:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getLevelById = getLevelById;
// Get Level by Name
const getLevelByName = async (req, res) => {
    try {
        const { levelName } = req.params;
        console.log('Received levelName:', levelName);
        const level = await level_1.Level.findOne({
            name: { $regex: new RegExp(`^${levelName}$`, 'i') },
        }).populate('categories community questions');
        if (!level) {
            console.log('Level not found for name:', levelName);
            return res.status(404).json({ message: 'Level not found' });
        }
        res.status(200).json(level);
    }
    catch (error) {
        console.error('Error fetching level by name:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getLevelByName = getLevelByName;
//# sourceMappingURL=levelController.js.map