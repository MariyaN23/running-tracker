import {runningRouter} from "../routes/running-route";
import express, {Express} from "express";
import {runningService} from "../services/running-service";
import request from 'supertest';
import {RecordType, ReportType} from "../db/types";

jest.mock('../services/running-service')

const app: Express = express()
app.use(express.json())
app.use('/running', runningRouter)

describe('POST /running', () => {
    it('should create new running record', async () => {
        const mockAddRecord = runningService.addRecord as jest.Mock
        mockAddRecord.mockResolvedValueOnce(undefined)

        const response = await request(app)
            .post('/running')
            .send({
                userId: 1,
                distance: 5,
                runningTime: 30,
                date: '2024-10-11',
            })

        expect(response.status).toBe(200)
        expect(response.text).toBe('New running record created')
        expect(mockAddRecord).toHaveBeenCalledWith(1, 5, 30, '2024-10-11')
    })

    it('should return an error if error', async () => {
        const mockAddRecord = runningService.addRecord as jest.Mock
        mockAddRecord.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app)
            .post('/running')
            .send({
                userId: 1,
                distance: 5,
                runningTime: 30,
                date: '2024-10-11',
            })

        expect(response.status).toBe(400)
        expect(response.text).toContain('Error while creating new record: Error: Service error')
    })
})

describe('GET /running/:userId', () => {
    it('should return records by userId', async () => {
        const mockGetRecordsByUserId  = runningService.getRecordsByUserId as jest.Mock
        mockGetRecordsByUserId.mockResolvedValueOnce([
            { userId: 1, recordId: 1, running: {distance: 5, runningTime: 30, date: '2024-10-11'} }
        ] as RecordType[])

        const response = await request(app).get('/running/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            { userId: 1, recordId: 1, running: {distance: 5, runningTime: 30, date: '2024-10-11'} }
        ])
        expect(mockGetRecordsByUserId).toHaveBeenCalledWith(1)
    })

    it('should return an error if fetching records fails', async () => {
        const mockGetRecordsByUserId = runningService.getRecordsByUserId as jest.Mock
        mockGetRecordsByUserId.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app).get('/running/1')

        expect(response.status).toBe(400)
        expect(response.text).toContain('Error while fetching users records: Error: Service error')
    })
})

describe('DELETE /running/:recordId', () => {
    it('should delete record', async () => {
        const mockDeleteRecord = runningService.deleteRecord as jest.Mock
        mockDeleteRecord.mockResolvedValueOnce(true)

        const response = await request(app).delete('/running/2')

        expect(response.text).toBe(`Record with ID 2 is deleted`)
        expect(mockDeleteRecord).toHaveBeenCalledWith(2)
    })

    it('should return 404 if the record is not found', async () => {
        const mockDeleteRecord = runningService.deleteRecord as jest.Mock
        mockDeleteRecord.mockResolvedValueOnce(false)

        const response = await request(app).delete('/running/2')

        expect(response.text).toBe(`Record with ID 2 not found`)
    })

    it('should return an error if error while deleting record', async () => {
        const mockDeleteRecord = runningService.deleteRecord as jest.Mock
        mockDeleteRecord.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app).delete('/running/2')

        expect(response.status).toBe(400)
        expect(response.text).toContain('Error while deleting record: Error: Service error')
    })
})

describe('PUT /running/:recordId', () => {
    it('should update a running record', async () => {
        const mockUpdateRecord = runningService.updateRecord as jest.Mock
        const updatedRecord = {
            _id: '1',
            userId: 1,
            recordId: 1,
            running: {
                distance: 10,
                runningTime: 40,
                date: '2024-11-01'
            }
        }

        mockUpdateRecord.mockResolvedValueOnce(updatedRecord)

        const response = await request(app)
            .put('/running/1')
            .send({
                distance: 10,
                runningTime: 40,
                date: '2024-11-01'
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(updatedRecord)
        expect(mockUpdateRecord).toHaveBeenCalledWith(1, {
            distance: 10,
            runningTime: 40,
            date: '2024-11-01'
        })
    })

    it('should return text if record is not found', async () => {
        const mockUpdateRecord = runningService.updateRecord as jest.Mock
        mockUpdateRecord.mockResolvedValueOnce(null)

        const response = await request(app)
            .put('/running/123')
            .send({
                distance: 10,
                runningTime: 40,
                date: '2024-11-01'
            })

        expect(response.text).toContain(`Record with ID 123 not found`)
    })

    it('should return an error if updating a record fails', async () => {
        const mockUpdateRecord = runningService.updateRecord as jest.Mock;
        mockUpdateRecord.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app)
            .put('/running/1')
            .send({
                distance: 10,
                runningTime: 40,
                date: '2024-11-01'
            })

        expect(response.status).toBe(400)
        expect(response.text).toContain('Error while updating record: Error: Service error')
    })
})

describe('GET /running/report/:userId', () => {
    it('should return report by userId', async () => {
        const mockGetReportByUserId  = runningService.getReport as jest.Mock
        mockGetReportByUserId.mockResolvedValueOnce([
            { week: "2024-11-11 / 2024-11-17", averageSpeed: 2.67, averageTime: 450, totalDistance: 1200 }
        ] as ReportType[])

        const response = await request(app).get('/running/report/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            { week: "2024-11-11 / 2024-11-17", averageSpeed: 2.67, averageTime: 450, totalDistance: 1200 }
        ])
        expect(mockGetReportByUserId).toHaveBeenCalledWith(1)
    })

    it('should return an error if fetching report fails', async () => {
        const mockGetReportByUserId = runningService.getReport as jest.Mock

        mockGetReportByUserId.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app).get('/running/report/1')

        expect(response.status).toBe(400)
        expect(response.text).toContain('Error while creating report: Error: Service error')
    })
})