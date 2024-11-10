import {Request, Response, Router} from "express";
import {runningService} from "../services/running-service";
import {
    addRunningValidation, updateRunningValidation
} from "../middleware/running-validation";
import {validationMiddleware} from "../middleware/validation-middleware";

export const runningRouter = Router({})

/**
 * @swagger
 * /running/{userId}:
 *   post:
 *     summary: Add new running record
 *     tags: [🏃‍♀️ Running]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               distance:
 *                 type: number
 *               runningTime:
 *                 type: number
 *                 description: Total running time
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: New running record created
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "New running record created"
 *       400:
 *         description: Error while creating new record
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error while creating new record: [error details]"
 */
runningRouter.post('/:userId',
    addRunningValidation,
    validationMiddleware,
    async (req: Request, res: Response) => {
        try {
            await runningService.addRecord(+req.params.userId, req.body.distance, req.body.runningTime, req.body.date)
            res.status(200).send(`New running record created`)
        } catch (error) {
            res.status(400).send(`Error while creating new record: ${error}`)
        }
    })

/**
 * @swagger
 * /running/{userId}:
 *   get:
 *     summary: Receive running records for user
 *     tags: [🏃‍♀️ Running]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: A list of running records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: number
 *                   recordId:
 *                     type: number
 *                   running:
 *                     type: object
 *                     properties:
 *                       distance:
 *                         type: number
 *                       runningTime:
 *                         type: number
 *                       date:
 *                         type: string
 *                         format: date
 *       400:
 *         description: Error while fetching user's records
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error while fetching user's records: [error details]"
 */
runningRouter.get('/:userId',
    async (req: Request, res: Response) => {
        try {
            const response = await runningService.getRecordsByUserId(+req.params.userId)
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send(`Error while fetching users records: ${error}`)
        }
    })

/**
 * @swagger
 * /running/{recordId}:
 *   put:
 *     summary: Update running record
 *     tags: [🏃‍♀️ Running]
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               distance:
 *                 type: number
 *               runningTime:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Running record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: number
 *                 recordId:
 *                   type: number
 *                 running:
 *                   type: object
 *                   properties:
 *                     distance:
 *                       type: number
 *                     runningTime:
 *                       type: number
 *                     date:
 *                       type: string
 *                       format: date
 *       404:
 *         description: Record not found
 *       400:
 *         description: Error while updating record
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error while updating record: [error details]"
 */
runningRouter.put('/:recordId',
    updateRunningValidation,
    validationMiddleware,
    async (req: Request, res: Response) => {
    const recordId = +req.params.recordId
        try {
            const updatedRecord = await runningService.updateRecord(recordId, req.body)
            updatedRecord ? res.send(updatedRecord) : res.send(`Record with ID ${recordId} not found`)
        } catch (error) {
            res.status(400).send(`Error while updating record: ${error}`)
        }
    })

/**
 * @swagger
 * /running/{recordId}:
 *   delete:
 *     summary: Delete running record
 *     tags: [🏃‍♀️ Running]
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The record ID to delete
 *     responses:
 *       204:
 *         description: Record successfully deleted
 *       404:
 *         description: Record not found
 *       400:
 *         description: Error while deleting record
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error while deleting record: [error details]"
 */
runningRouter.delete('/:recordId',
    async (req: Request, res: Response) => {
        try {
            const recordId = +req.params.recordId
            const isDeleted = await runningService.deleteRecord(recordId)
            isDeleted ? res.send(`Record with ID ${recordId} is deleted`) : res.send(`Record with ID ${recordId} not found`)
        } catch (error) {
            res.status(400).send(`Error while deleting record: ${error}`)
        }
    })

/**
 * @swagger
 * /running/report/{userId}:
 *   get:
 *     summary: Get running report for user
 *     tags: [🏃‍♀️ Running]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID for which to retrieve the report
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 week:
 *                   type: string
 *                   description: The week for which the report is generated
 *                 averageSpeed:
 *                   type: number
 *                   description: Average speed during the week
 *                 averageTime:
 *                   type: number
 *                   description: Average running time
 *                 totalDistance:
 *                   type: number
 *                   description: Total distance covered during the week
 *       400:
 *         description: Error while creating report
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error while creating report: [error details]"
 */
runningRouter.get('/report/:userId',
    async (req: Request, res: Response) => {
        try {
            const response = await runningService.getReport(+req.params.userId)
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send(`Error while creating report: ${error}`)
        }
    })