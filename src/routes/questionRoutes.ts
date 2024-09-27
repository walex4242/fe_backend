import { Router } from 'express';
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,
} from '../controllers/questionController';

const router = Router();

// Add question: You need to pass all three parameters (communityId, levelId, categoryId)
router.post('/:communityId/:levelId/:categoryId', addQuestion); // Create

// Update question: Only the questionId is needed in params
router.put('/:communityId/:levelId/:categoryId/:questionId', updateQuestion); // Update

// Delete question: Only the questionId is needed in params
router.delete('/:questionId', deleteQuestion); // Delete

// Get questions by community, level, and category
router.get('/:communityId/:levelId/:categoryId', getQuestions);

export default router;
