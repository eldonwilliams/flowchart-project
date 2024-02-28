"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = require("fs");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const discoveryDirectory = (_a = process.env.DISCOVERY_DIRECTORY) !== null && _a !== void 0 ? _a : "./examples";
app.get("/discovery", (req, res) => {
    (0, fs_1.readdir)(discoveryDirectory, (err, files) => {
        if (err) {
            res.status(500).send("An error occurred while reading the directory.");
            return;
        }
        res.status(200).json(files.filter((file) => file.endsWith(".dat")));
    });
});
app.get("/discovery/:file", (req, res) => {
    const file = req.params.file;
    (0, fs_1.readFile)(`${discoveryDirectory}/${file}`, "utf8", (err, data) => {
        if (err) {
            res.status(500).send("An error occurred while reading the file.");
            return;
        }
        res.status(200).send(data);
    });
});
app.listen((_b = process.env.BACKEND_PORT) !== null && _b !== void 0 ? _b : 8797, () => {
    var _a;
    console.log(`Server is running on port ${(_a = process.env.BACKEND_PORT) !== null && _a !== void 0 ? _a : 8797}`);
});
