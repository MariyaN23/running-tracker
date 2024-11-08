import {runningRepository} from "../repositories/running-repository";
import {RecordType, ReportType, RunningDataType} from "../db/types";

export const runningService = {
    async addRecord(userId: number, distance: number, runningTime: number, date: string): Promise<RecordType> {
        const recordId = +new Date()
        const newRecord = {
            userId,
            recordId,
            running: {
                distance,
                runningTime,
                date
            }
        }
        return await runningRepository.addRecord(newRecord)
    },
    async getRecordsByUserId(userId: number): Promise<RecordType[]> {
        return await runningRepository.getRecordsByUserId(userId)
    },
    async updateRecord(recordId: number, running: RunningDataType): Promise<RecordType> {
        return await runningRepository.updateRecord(recordId, running)
    },
    async deleteRecord(recordId: number): Promise<boolean> {
        return await runningRepository.deleteRecord(recordId)
    },
    async getReport(userId: number): Promise<ReportType[]> {
        return await runningRepository.getReport(userId)
    }
}