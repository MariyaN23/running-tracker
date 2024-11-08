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
exports.runningService = void 0;
const running_repository_1 = require("../repositories/running-repository");
exports.runningService = {
    addRecord(userId, distance, runningTime, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const recordId = +new Date();
            const newRecord = {
                userId,
                recordId,
                running: {
                    distance,
                    runningTime,
                    date
                }
            };
            return yield running_repository_1.runningRepository.addRecord(newRecord);
        });
    },
    getRecordsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield running_repository_1.runningRepository.getRecordsByUserId(userId);
        });
    },
    updateRecord(recordId, running) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield running_repository_1.runningRepository.updateRecord(recordId, running);
        });
    },
    deleteRecord(recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield running_repository_1.runningRepository.deleteRecord(recordId);
        });
    }
};
