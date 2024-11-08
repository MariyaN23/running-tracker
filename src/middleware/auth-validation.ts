import {body} from "express-validator";

export const usernameValidation = body('username').trim().isLength({
    min: 3,
    max: 30
}).withMessage("Username should be from 3 to 30 symbols")

export const passwordValidation = body('password').trim().isLength({
    min: 8,
    max: 30
}).withMessage("Password should be from 8 to 30 symbols")