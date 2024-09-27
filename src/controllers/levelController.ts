import { Request, Response } from 'express';
import { Level } from '../models/level';
import mongoose from 'mongoose';
import { Community } from '../models/community'; // Import Community model for validation

// Helper function to check if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Create a new level
export const addLevel = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;

    // Validate community existence
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Create the new level
    const newLevel = new Level({
      ...req.body,
      community: communityId, // Associate the level with the community
    });

    // Save the new level
    await newLevel.save();

    // Optionally, you can push the level into the community's levels array
    community.levels.push(newLevel._id);
    await community.save();

    res.status(201).json(newLevel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a level
export const updateLevel = async (req: Request, res: Response) => {
  try {
    const { levelId } = req.params;

    // Check if the level exists
    const updatedLevel = await Level.findByIdAndUpdate(levelId, req.body, {
      new: true,
    });
    if (!updatedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.status(200).json(updatedLevel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a level
export const deleteLevel = async (req: Request, res: Response) => {
  try {
    const { levelId } = req.params;

    // Find the level by ID
    const deletedLevel = await Level.findByIdAndDelete(levelId);
    if (!deletedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Optionally, remove the level from its associated community
    await Community.updateMany(
      { levels: levelId },
      { $pull: { levels: levelId } },
    );

    res.status(200).json({ message: 'Level deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Level by ID
export const getLevelById = async (req: Request, res: Response) => {
  try {
    const { levelId } = req.params;
    console.log('Received levelId:', levelId);

    if (!mongoose.isValidObjectId(levelId)) {
      return res.status(400).json({ message: 'Invalid level ID format' });
    }

    const level = await Level.findById(levelId).populate('categories community questions');

    if (!level) {
      console.log('Level not found for ID:', levelId);
      return res.status(404).json({ message: 'Level not found' });
    }

    res.status(200).json(level);
  } catch (error) {
    console.error('Error fetching level by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Level by Name
export const getLevelByName = async (req: Request, res: Response) => {
  try {
    const { levelName } = req.params;
    console.log('Received levelName:', levelName);

    const level = await Level.findOne({
      name: { $regex: new RegExp(`^${levelName}$`, 'i') },
    }).populate('categories community questions');

    if (!level) {
      console.log('Level not found for name:', levelName);
      return res.status(404).json({ message: 'Level not found' });
    }

    res.status(200).json(level);
  } catch (error) {
    console.error('Error fetching level by name:', error);
    res.status(500).json({ error: error.message });
  }
};
