import { Router } from 'express';
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
} from '../controllers/communityController';

const router = Router();

// Community Routes
router.post('/', createCommunity); // Create
router.get('/', getCommunities); // Read all
router.get('/:communityId', getCommunityById); // Read one
router.put('/:communityId', updateCommunity); // Update
router.delete('/:communityId', deleteCommunity); // Delete

export default router;
