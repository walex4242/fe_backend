"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionController_1 = require("../controllers/questionController");
const router = (0, express_1.Router)();
// Add question: You need to pass all three parameters (communityId, levelId, categoryId)
router.post('/:communityId/:levelId/:categoryId', questionController_1.addQuestion); // Create
// Update question: Only the questionId is needed in params
router.put('/:communityId/:levelId/:categoryId/:questionId', questionController_1.updateQuestion); // Update
// Delete question: Only the questionId is needed in params
router.delete('/:questionId', questionController_1.deleteQuestion); // Delete
// Get questions by community, level, and category
router.get('/:communityId/:levelId/:categoryId', questionController_1.getQuestions);
exports.default = router;
//# sourceMappingURL=questionRoutes.js.map