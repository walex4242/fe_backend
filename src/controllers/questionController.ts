import { Request, Response } from 'express';
import { Question } from '../models/question';
import { Community } from '../models/community';
import { Category } from '../models/category';
import { Level } from '../models/level';
import mongoose from 'mongoose';

// Helper function to check if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Add a new question
export const addQuestion = async (req: Request, res: Response) => {
  try {
    const { communityId, categoryId, levelId } = req.params;

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if level exists
    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    // Create new question
    const newQuestion = new Question({
      ...req.body,
      community: communityId,
      category: categoryId,
      level: levelId,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a question
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId, communityId, categoryId, levelId } = req.params;

    // Ensure question, community, category, and level exist
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (
      !isValidObjectId(communityId) ||
      !(await Community.findById(communityId))
    ) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (
      !isValidObjectId(categoryId) ||
      !(await Category.findById(categoryId))
    ) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (!isValidObjectId(levelId) || !(await Level.findById(levelId))) {
      return res.status(404).json({ error: 'Level not found' });
    }

    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        ...req.body,
        community: communityId,
        category: categoryId,
        level: levelId,
      },
      { new: true },
    );

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a question
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;

    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get questions by community, level, and category
export const getQuestions = async (req: Request, res: Response) => {
  const { communityId, levelId, categoryId } = req.params;

  try {
    // Ensure all related entities exist
    if (
      !isValidObjectId(communityId) ||
      !(await Community.findById(communityId))
    ) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!isValidObjectId(levelId) || !(await Level.findById(levelId))) {
      return res.status(404).json({ error: 'Level not found' });
    }

    if (
      !isValidObjectId(categoryId) ||
      !(await Category.findById(categoryId))
    ) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Fetch questions based on community, level, and category
    const questions = await Question.find({
      community: communityId,
      level: levelId,
      category: categoryId,
    });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
