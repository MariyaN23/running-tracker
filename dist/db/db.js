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
exports.runDb = exports.imagesCollection = exports.runningCollection = exports.usersCollection = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongodbURI = process.env.MONGODB_URI;
exports.client = new mongodb_1.MongoClient(mongodbURI);
const db = exports.client.db("yellow");
exports.usersCollection = db.collection("users");
exports.runningCollection = db.collection("running");
exports.imagesCollection = db.collection("images");
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        yield exports.client.db("yellow").command({ ping: 1 });
        console.log("Connected successfully to mongo server");
    }
    catch (error) {
        yield exports.client.close();
        console.log("Can't connect to DB", error);
    }
});
exports.runDb = runDb;
