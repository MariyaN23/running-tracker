import {RecordType, RunningDataType} from "../db/types";
import {runningCollection} from "../db/db";

export const runningRepository = {
    async addRecord(newRecord: RecordType): Promise<RecordType> {
        await runningCollection.insertOne(newRecord)
        return newRecord
    },
    async getRecordsByUserId(userId: number): Promise<RecordType[]> {
        return await runningCollection.find({userId}).toArray()
    },
    async updateRecord(recordId: number, running: RunningDataType): Promise<RecordType> {
        const updateFields: Partial<RunningDataType> = {}
        if (running.distance !== undefined) updateFields.distance = running.distance
        if (running.runningTime !== undefined) updateFields.runningTime = running.runningTime
        if (running.date !== undefined) updateFields.date = running.date
        const result = await runningCollection.findOneAndUpdate({recordId}, {$set: updateFields}, {returnDocument: 'after'})
        if (result) {
            return result;
        } else {
            throw new Error(`Record with id ${recordId} not found`)
        }
    },
    async deleteRecord(recordId: number): Promise<boolean> {
        const result = await runningCollection.deleteOne({recordId})
        return result.deletedCount === 1
    }
}