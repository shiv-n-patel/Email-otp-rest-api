"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otpController_1 = __importDefault(require("../../controllers/otpController"));
const otpRouter = (0, express_1.Router)();
otpRouter.post('/api/generate', otpController_1.default.generate);
otpRouter.post('/api/verify', otpController_1.default.verify);
exports.default = otpRouter;
