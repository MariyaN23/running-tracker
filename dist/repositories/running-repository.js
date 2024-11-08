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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runningRepository = void 0;
const db_1 = require("../db/db");
const moment_1 = __importDefault(require("moment"));
exports.runningRepository = {
    addRecord(newRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.runningCollection.insertOne(newRecord);
            return newRecord;
        });
    },
    getRecordsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.runningCollection.find({ userId }).toArray();
        });
    },
    updateRecord(recordId, running) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateFields = {};
            if (running.distance !== undefined)
                updateFields.distance = running.distance;
            if (running.runningTime !== undefined)
                updateFields.runningTime = running.runningTime;
            if (running.date !== undefined)
                updateFields.date = running.date;
            const result = yield db_1.runningCollection.findOneAndUpdate({ recordId }, { $set: updateFields }, { returnDocument: 'after' });
            if (result) {
                return result;
            }
            else {
                throw new Error(`Record with id ${recordId} not found`);
            }
        });
    },
    deleteRecord(recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.runningCollection.deleteOne({ recordId });
            return result.deletedCount === 1;
        });
    },
    getReport(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const runs = yield db_1.runningCollection.find({ userId }).toArray();
            const report = runs.reduce((acc, run) => {
                const week = (0, moment_1.default)(run.running.date).startOf('isoWeek').format('YYYY-MM-DD') + ' / ' + (0, moment_1.default)(run.running.date).endOf('isoWeek').format('YYYY-MM-DD');
                if (!acc[week]) {
                    acc[week] = { totalDistance: 0, totalTime: 0, count: 0 };
                }
                acc[week].totalDistance += run.running.distance;
                acc[week].totalTime += run.running.runningTime;
                acc[week].count += 1;
                return acc;
            }, {});
            const reportArray = Object.keys(report).map(week => {
                const totalDistance = report[week].totalDistance;
                const totalTime = report[week].totalTime;
                const count = report[week].count;
                const averageSpeed = totalDistance / totalTime;
                const averageTime = totalTime / count;
                return {
                    week,
                    averageSpeed: (totalDistance === 0 || totalTime === 0) ? 0 : parseFloat(averageSpeed.toFixed(2)),
                    averageTime: (totalDistance === 0 || totalTime === 0) ? 0 : parseFloat(averageTime.toFixed(2)),
                    totalDistance: parseFloat(totalDistance.toFixed(2)),
                };
            });
            return reportArray;
        });
    }
};
