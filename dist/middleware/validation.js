"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ codeResult: 1, messages: errors.array() });
    }
    else {
        next();
    }
};
exports.validationMiddleware = validationMiddleware;
