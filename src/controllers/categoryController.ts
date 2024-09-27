// categoryController.ts (Controller)
import { Request, Response } from 'express';
import { Category } from '../models/category';
import { Level } from '../models/level'; // Ensure Level model is imported if needed

// Utility function to validate request data
const validateCategoryData = (data: any) => {
  if (!data.name || !data.community || !data.level) {
    throw new Error('Name, community, and level fields are required');
  }
};

// Add a new category
export const addCategory = async (req: Request, res: Response) => {
  try {
    validateCategoryData(req.body);

    const { name, community, level } = req.body;

    // Verify that the provided level exists
    const existingLevel = await Level.findById(level);
    if (!existingLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    const newCategory = new Category({
      name,
      community,
      level, // Use level from request body
      questions: [], // Initialize with an empty array of questions
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    validateCategoryData(req.body);

    const { name, community, level } = req.body;

    // Verify that the new level exists (if level is being updated)
    if (level) {
      const existingLevel = await Level.findById(level);
      if (!existingLevel) {
        return res.status(404).json({ message: 'Level not found' });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { name, community, level },
      { new: true },
    )
      .populate('questions')
      .populate('level'); // Populate related fields

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.categoryId,
    );

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories by community and level
export const getCategoriesByCommunityAndLevel = async (
  req: Request,
  res: Response,
) => {
  const { community, level } = req.params; // Fetch community and level from params

  try {
    const categories = await Category.find({ community, level })
      .populate('questions') // Populate questions with related documents
      .populate('level'); // Populate level with related document

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
