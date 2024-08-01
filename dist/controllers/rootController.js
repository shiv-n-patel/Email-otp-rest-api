"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const home = (req, res) => {
    try {
        const indexFilePath = path_1.default.join(__dirname, '..', 'views', 'index.html');
        res.sendFile(indexFilePath);
    }
    catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};
const data = (req, res) => {
    try {
        const dataFilePath = path_1.default.join(__dirname, '..', 'assets', 'data', 'data.json');
        res.sendFile(dataFilePath);
    }
    catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};
const error404 = (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        const dataFilePath = path_1.default.join(__dirname, '..', 'views', '404.html');
        res.sendFile(dataFilePath);
    }
    else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    }
    else {
        res.type('txt').send("404 Not Found");
    }
};
exports.default = {
    home,
    data,
    error404,
};
