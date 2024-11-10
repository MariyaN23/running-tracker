import {body} from "express-validator";

export const addRunningValidation = [
    body('distance')
        .trim()
        .notEmpty().withMessage('Distance is required')
        .isNumeric().withMessage('Distance must be a number')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('Distance must be greater than zero');
            }
            return true;
        })
        .toFloat(),
    body('runningTime')
        .trim()
        .notEmpty().withMessage('RunningTime is required')
        .isNumeric().withMessage('RunningTime must be a number')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('RunningTime must be greater than zero');
            }
            return true;
        })
        .toFloat(),
    body('date')
        .trim()
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be in valid date format (ISO 8601)')
        .custom((value) => {
            const currentDate = new Date();
            const inputDate = new Date(value);
            if (inputDate > currentDate) {
                throw new Error('Date must not be greater than today');
            }
            return true;
        })
]

export const updateRunningValidation = [body('distance')
    .optional()
    .trim()
    .isNumeric().withMessage('Distance must be a number')
    .custom((value) => {
        if (value <= 0) {
            throw new Error('Distance must be greater than zero');
        }
        return true;
    })
    .toFloat(),
    body('runningTime')
        .optional()
        .trim()
        .isNumeric().withMessage('RunningTime must be a number')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('RunningTime must be greater than zero');
            }
            return true;
        })
        .toFloat(),
    body('date')
        .optional()
        .trim()
        .isISO8601().withMessage('Date must be in valid date format (ISO 8601)')
        .custom((value) => {
            const currentDate = new Date();
            const inputDate = new Date(value);
            if (inputDate > currentDate) {
                throw new Error('Date must not be greater than today');
            }
            return true;
        })]