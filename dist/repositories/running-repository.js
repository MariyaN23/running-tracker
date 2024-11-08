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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runningRepository = void 0;
const db_1 = require("../db/db");
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
    }
};
