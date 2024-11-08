"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidation = exports.usernameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.usernameValidation = (0, express_validator_1.body)('username').trim().isLength({
    min: 3,
    max: 30
}).withMessage("Username should be from 3 to 30 symbols");
exports.passwordValidation = (0, express_validator_1.body)('password').trim().isLength({
    min: 8,
    max: 30
}).withMessage("Password should be from 8 to 30 symbols");
