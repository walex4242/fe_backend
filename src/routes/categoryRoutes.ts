// routes/categoryRoutes.ts (Router)
import { Router } from 'express';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByCommunityAndLevel,
} from '../controllers/categoryController';

// Async handler utility for catching errors
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

// Category Routes
router.post('/:levelId', asyncHandler(addCategory)); // Create
router.put('/:categoryId', asyncHandler(updateCategory)); // Update
router.delete('/:categoryId', asyncHandler(deleteCategory)); // Delete
router.get(
  '/:community/:level',
  asyncHandler(getCategoriesByCommunityAndLevel),
); // Get categories

export default router;
