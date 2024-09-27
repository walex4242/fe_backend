import { Router } from 'express';
import {
  addLevel,
  updateLevel,
  deleteLevel,
  getLevelById,
  getLevelByName,
} from '../controllers/levelController';

const router = Router();

// Level Routes
router.post('/:communityId', addLevel); // Create
router.put('/:levelId', updateLevel); // Update
router.delete('/:levelId', deleteLevel); // Delete
router.get('/:levelId', getLevelById);
router.get('/:levelName', getLevelByName);


export default router;
