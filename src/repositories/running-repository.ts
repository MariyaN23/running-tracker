import {RecordType, ReportType, RunningDataType} from "../db/types";
import {runningCollection} from "../db/db";
import moment from "moment";

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
    },
    async getReport(userId: number): Promise<ReportType[]> {
        const runs = await runningCollection.find({userId}).toArray()
        const report = runs.reduce((acc, run) => {
            const week = moment(run.running.date).startOf('isoWeek').format('YYYY-MM-DD') + ' / ' + moment(run.running.date).endOf('isoWeek').format('YYYY-MM-DD')
            if (!acc[week]) {
                acc[week] = {totalDistance: 0, totalTime: 0, count: 0}
            }
            acc[week].totalDistance += run.running.distance
            acc[week].totalTime += run.running.runningTime
            acc[week].count += 1
            return acc
        }, {} as Record<string, { totalDistance: number; totalTime: number; count: number }>)
        const reportArray: ReportType[] = Object.keys(report).map(week => {
            const totalDistance = report[week].totalDistance
            const totalTime = report[week].totalTime
            const count = report[week].count
            const averageSpeed = totalDistance / totalTime
            const averageTime = totalTime / count
            return {
                week,
                averageSpeed: (totalDistance === 0 || totalTime === 0) ? 0 : parseFloat(averageSpeed.toFixed(2)),
                averageTime: (totalDistance === 0 || totalTime === 0) ? 0 : parseFloat(averageTime.toFixed(2)),
                totalDistance: parseFloat(totalDistance.toFixed(2)),
            }
        })
        return reportArray
    }
}