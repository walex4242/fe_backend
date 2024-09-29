"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const levelController_1 = require("../controllers/levelController");
const router = (0, express_1.Router)();
// Level Routes
router.post('/:communityId', levelController_1.addLevel); // Create
router.put('/:levelId', levelController_1.updateLevel); // Update
router.delete('/:levelId', levelController_1.deleteLevel); // Delete
router.get('/:levelId', levelController_1.getLevelById);
router.get('/:levelName', levelController_1.getLevelByName);
exports.default = router;
//# sourceMappingURL=levelRoutes.js.map