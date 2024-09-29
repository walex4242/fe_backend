"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communityController_1 = require("../controllers/communityController");
const router = (0, express_1.Router)();
// Community Routes
router.post('/', communityController_1.createCommunity); // Create
router.get('/', communityController_1.getCommunities); // Read all
router.get('/:communityId', communityController_1.getCommunityById); // Read one
router.put('/:communityId', communityController_1.updateCommunity); // Update
router.delete('/:communityId', communityController_1.deleteCommunity); // Delete
exports.default = router;
//# sourceMappingURL=communityRoutes.js.map