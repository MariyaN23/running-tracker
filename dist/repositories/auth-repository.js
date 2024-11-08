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
exports.authRepository = void 0;
const db_1 = require("../db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("./token");
exports.authRepository = {
    registerUser(id, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield db_1.usersCollection.findOne({ username });
            if (foundUser) {
                throw new Error(`User with username ${username} already exist`);
            }
            else {
                const newUser = { id, username, password };
                yield db_1.usersCollection.insertOne(newUser);
                return newUser;
            }
        });
    },
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield db_1.usersCollection.findOne({ username });
            if (foundUser) {
                const validPassword = bcrypt_1.default.compareSync(password, foundUser.password);
                if (validPassword) {
                    const token = (0, token_1.generateAccessToken)(foundUser._id);
                    const userId = foundUser.id;
                    return { token, userId };
                }
            }
            return 'Incorrect username or password';
        });
    }
};
