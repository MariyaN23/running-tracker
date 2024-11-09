import {Request, Response, Router} from "express";
import {authService} from "../services/auth-service";
import {validationMiddleware} from "../middleware/validation-middleware";
import {passwordValidation, usernameValidation} from "../middleware/auth-validation";

export const authRouter = Router({})

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [🐣 Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: New user registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Registration error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration error: [error details]"
 */
authRouter.post('/register',
    usernameValidation,
    passwordValidation,
    validationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const newUser = await authService.register(req.body.username, req.body.password)
            res.status(200).send(`New user ${newUser.username} registered`)
        } catch (error) {
            res.status(400).send({message: `Registration error: ${error}`})
        }
    })

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [🐣 Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Login error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login error: [error details]"
 */
authRouter.post('/login',
    passwordValidation,
    usernameValidation,
    validationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const result = await authService.login(req.body.username, req.body.password);
            if (typeof result === 'object' && 'userId' in result) {
                res.status(200).json({userId: result.userId, token: result.token})
            } else {
                res.status(400).send({message: `Login error ${result}`});
            }
        } catch (error) {
            res.status(400).send({message: `Login error: ${error}`})
        }
    })