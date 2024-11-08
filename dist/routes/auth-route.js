"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth-service");
const validation_middleware_1 = require("../middleware/validation-middleware");
const auth_validation_1 = require("../middleware/auth-validation");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/register', auth_validation_1.usernameValidation, auth_validation_1.passwordValidation, validation_middleware_1.validationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield auth_service_1.authService.register(req.body.username, req.body.password);
        res.status(200).send(`New user ${newUser.username} registered`);
    }
    catch (error) {
        res.status(400).send({ message: `Registration error ${error}` });
    }
}));
exports.authRouter.post('/login', auth_validation_1.passwordValidation, auth_validation_1.usernameValidation, validation_middleware_1.validationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield auth_service_1.authService.login(req.body.username, req.body.password);
        if (typeof result === 'object' && 'userId' in result) {
            res.status(200).json({ userId: result.userId, token: result.token });
        }
        else {
            res.status(400).send({ message: `Login error ${result}` });
        }
    }
    catch (error) {
        res.status(400).send({ message: `Login error: ${error}` });
    }
}));
