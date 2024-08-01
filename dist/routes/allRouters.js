"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rootRouter_1 = __importDefault(require("./rootRouter"));
const otpRouter_1 = __importDefault(require("./api/otpRouter"));
const mainRouter = (0, express_1.Router)();
mainRouter.use(rootRouter_1.default);
mainRouter.use(otpRouter_1.default);
exports.default = mainRouter;
