"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communityRoutes_1 = __importDefault(require("./communityRoutes"));
const levelRoutes_1 = __importDefault(require("./levelRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const questionRoutes_1 = __importDefault(require("./questionRoutes"));
const router = (0, express_1.Router)();
// Register individual routes
router.use('/community', communityRoutes_1.default);
router.use('/level', levelRoutes_1.default);
router.use('/category', categoryRoutes_1.default);
router.use('/question', questionRoutes_1.default);
exports.default = router; // Remove the function call and just export the router
//# sourceMappingURL=index.js.map