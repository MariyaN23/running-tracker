import {Request, Response, Router} from "express";
import {runningService} from "../services/running-service";

export const runningRouter = Router({})

runningRouter.post('/',
    async (req: Request, res: Response) => {
        try {
            await runningService.addRecord(req.body.userId, req.body.distance, req.body.runningTime, req.body.date)
            res.status(200).send(`New running record created`)
        } catch (error) {
            res.status(400).send(`Error while creating new record: ${error}`)
        }
    })

runningRouter.get('/:userId',
    async (req: Request, res: Response) => {
        try {
            const usersRecords = await runningService.getRecordsByUserId(+req.params.userId)
            res.status(200).send(usersRecords)
        } catch (error) {
            res.status(400).send(`Error while fetching users records: ${error}`)
        }
    })

runningRouter.put('/:recordId',
    async (req: Request, res: Response) => {
        try {
            const updatedRecord = await runningService.updateRecord(+req.params.recordId, req.body)
            updatedRecord ? res.send(updatedRecord) : res.send(404)
        } catch (error) {
            res.status(400).send(`Error while updating record: ${error}`)
        }
    })

runningRouter.delete('/:recordId',
    async (req: Request, res: Response) => {
        try {
            const isDeleted = await runningService.deleteRecord(+req.params.recordId)
            isDeleted ? res.send(204) : res.send(404)
        } catch (error) {
            res.status(400).send(`Error while deleting record: ${error}`)
        }
    })

runningRouter.get('/report/:userId',
    async (req: Request, res: Response) => {
        try {
            const report = await runningService.getReport(+req.params.userId)
            res.status(200).send(report)
        } catch (error) {
            res.status(400).send(`Error while creating report: ${error}`)
        }
    })