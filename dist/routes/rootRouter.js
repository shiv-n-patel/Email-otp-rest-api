"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rootController_1 = __importDefault(require("../controllers/rootController"));
const express_1 = require("express");
const rootRouter = (0, express_1.Router)();
rootRouter.get("^/$|/index(.html)?", rootController_1.default.home);
rootRouter.get("/index(.html)?/data", rootController_1.default.data);
exports.default = rootRouter;
