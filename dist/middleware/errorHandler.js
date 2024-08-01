"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_1 = __importDefault(require("./logEvents"));
const errorHandler = (err, req, res, next) => {
    logEvents_1.default.logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.log("errorHandler-", err.stack);
    res.status(500).send(err.message);
};
exports.default = errorHandler;
