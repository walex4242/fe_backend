// communityController.ts (Controller)
import { Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { Community } from '../models/community';
import { Level } from '../models/level';
import { Category } from '../models/category';
import { Question } from '../models/question';

// Create a new community
export const createCommunity = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
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

        const newLevel = new Level({
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

        const newCategory = new Category({
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

        const newQuestion = new Question({
          text: question.text,
          category: question.category || null, // Optional category reference
        });

        // Save question and add its ID to the array
        const savedQuestion = await newQuestion.save({ session });
        questionIds.push(savedQuestion._id);
      }
    }

    // Create the community with associated levels, categories, and questions
    const newCommunity = new Community({
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
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
};

// Get all communities
export const getCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await Community.find()
      .populate('levels') // Populate associated levels
      .populate('categories') // Populate associated categories
      .populate('questions'); // Populate associated questions

    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single community by ID
export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;

    // Validate the ID
    if (!isValidObjectId(communityId)) {
      return res.status(400).json({ error: 'Invalid community ID' });
    }

    const community = await Community.findById(communityId)
      .populate('levels') // Populate associated levels
      .populate('categories') // Populate associated categories
      .populate('questions'); // Populate associated questions

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a community by ID
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const { name, levels, categories, questions } = req.body;

    // Validate levels, categories, and questions if being updated
    const updateData: any = { name };

    if (Array.isArray(levels)) {
      updateData.levels = levels;
    }
    if (Array.isArray(categories)) {
      updateData.categories = categories;
    }
    if (Array.isArray(questions)) {
      updateData.questions = questions;
    }

    const updatedCommunity = await Community.findByIdAndUpdate(
      req.params.communityId,
      updateData,
      { new: true },
    )
      .populate('levels') // Populate associated levels
      .populate('categories') // Populate associated categories
      .populate('questions'); // Populate associated questions

    if (!updatedCommunity) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.status(200).json(updatedCommunity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a community by ID
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Trigger pre-remove hook to delete related data
    await community.deleteOne();

    res.status(200).json({ message: 'Community and related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

