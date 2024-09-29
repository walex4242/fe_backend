"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/categoryRoutes.ts (Router)
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
// Async handler utility for catching errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const router = (0, express_1.Router)();
// Category Routes
router.post('/:levelId', asyncHandler(categoryController_1.addCategory)); // Create
router.put('/:categoryId', asyncHandler(categoryController_1.updateCategory)); // Update
router.delete('/:categoryId', asyncHandler(categoryController_1.deleteCategory)); // Delete
router.get('/:community/:level', asyncHandler(categoryController_1.getCategoriesByCommunityAndLevel)); // Get categories
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map