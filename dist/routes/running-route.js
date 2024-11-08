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
exports.runningRouter = void 0;
const express_1 = require("express");
const running_service_1 = require("../services/running-service");
exports.runningRouter = (0, express_1.Router)({});
exports.runningRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield running_service_1.runningService.addRecord(req.body.userId, req.body.distance, req.body.runningTime, req.body.date);
        res.status(200).send(`New running record created`);
    }
    catch (error) {
        res.status(400).send(`Error while creating new record: ${error}`);
    }
}));
exports.runningRouter.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRecords = yield running_service_1.runningService.getRecordsByUserId(+req.params.userId);
        res.status(200).send(usersRecords);
    }
    catch (error) {
        res.status(400).send(`Error while fetching users records: ${error}`);
    }
}));
exports.runningRouter.put('/:recordId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield running_service_1.runningService.updateRecord(+req.params.recordId, req.body);
        updatedRecord ? res.send(updatedRecord) : res.send(404);
    }
    catch (error) {
        res.status(400).send(`Error while updating record: ${error}`);
    }
}));
exports.runningRouter.delete('/:recordId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield running_service_1.runningService.deleteRecord(+req.params.recordId);
        isDeleted ? res.send(204) : res.send(404);
    }
    catch (error) {
        res.status(400).send(`Error while deleting record: ${error}`);
    }
}));
