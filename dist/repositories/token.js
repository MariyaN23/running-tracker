"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.config = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.config = {
    secret: "SECRET_KEY_RANDOM"
};
const generateAccessToken = (id) => {
    const payload = {
        id
    };
    return jsonwebtoken_1.default.sign(payload, exports.config.secret, { expiresIn: "24h" });
};
exports.generateAccessToken = generateAccessToken;
