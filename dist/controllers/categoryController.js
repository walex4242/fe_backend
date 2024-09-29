"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesByCommunityAndLevel = exports.deleteCategory = exports.updateCategory = exports.addCategory = void 0;
const category_1 = require("../models/category");
const level_1 = require("../models/level"); // Ensure Level model is imported if needed
// Utility function to validate request data
const validateCategoryData = (data) => {
    if (!data.name || !data.community || !data.level) {
        throw new Error('Name, community, and level fields are required');
    }
};
// Add a new category
const addCategory = async (req, res) => {
    try {
        validateCategoryData(req.body);
        const { name, community, level } = req.body;
        // Verify that the provided level exists
        const existingLevel = await level_1.Level.findById(level);
        if (!existingLevel) {
            return res.status(404).json({ message: 'Level not found' });
        }
        const newCategory = new category_1.Category({
            name,
            community,
            level, // Use level from request body
            questions: [], // Initialize with an empty array of questions
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addCategory = addCategory;
// Update a category
const updateCategory = async (req, res) => {
    try {
        validateCategoryData(req.body);
        const { name, community, level } = req.body;
        // Verify that the new level exists (if level is being updated)
        if (level) {
            const existingLevel = await level_1.Level.findById(level);
            if (!existingLevel) {
                return res.status(404).json({ message: 'Level not found' });
            }
        }
        const updatedCategory = await category_1.Category.findByIdAndUpdate(req.params.categoryId, { name, community, level }, { new: true })
            .populate('questions')
            .populate('level'); // Populate related fields
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateCategory = updateCategory;
// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await category_1.Category.findByIdAndDelete(req.params.categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
// Get categories by community and level
const getCategoriesByCommunityAndLevel = async (req, res) => {
    const { community, level } = req.params; // Fetch community and level from params
    try {
        const categories = await category_1.Category.find({ community, level })
            .populate('questions') // Populate questions with related documents
            .populate('level'); // Populate level with related document
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCategoriesByCommunityAndLevel = getCategoriesByCommunityAndLevel;
//# sourceMappingURL=categoryController.js.map