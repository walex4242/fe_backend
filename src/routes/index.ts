import { Router } from 'express';
import communityRoutes from './communityRoutes';
import levelRoutes from './levelRoutes';
import categoryRoutes from './categoryRoutes';
import questionRoutes from './questionRoutes';

const router = Router();

// Register individual routes
router.use('/community', communityRoutes);
router.use('/level', levelRoutes);
router.use('/category', categoryRoutes);
router.use('/question', questionRoutes);

export default router; // Remove the function call and just export the router
