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
exports.imagesRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const storage_1 = require("firebase/storage");
const firebase_1 = require("../db/firebase");
const images_service_1 = require("../services/images-service");
exports.imagesRouter = (0, express_1.Router)({});
const upload = (0, multer_1.default)();
exports.imagesRouter.post('/', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).send({ message: 'No file uploaded' });
            return;
        }
        const storage = (0, storage_1.getStorage)(firebase_1.app);
        const storageRef = (0, storage_1.ref)(storage, "images/" + +new Date());
        const metatype = { contentType: req.file.mimetype, name: req.file.originalname };
        yield (0, storage_1.uploadBytes)(storageRef, req.file.buffer, metatype);
        const downloadUrl = yield (0, storage_1.getDownloadURL)(storageRef);
        const response = yield images_service_1.imagesService.addImage(downloadUrl, req.file.originalname);
        res.status(200).send(`Image uploaded, url: ${response.url}`);
    }
    catch (error) {
        res.status(400).send({ message: `Error while uploading image: ${error}` });
    }
}));
exports.imagesRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allImages = yield images_service_1.imagesService.getImages();
        res.status(200).send(allImages.map((img) => ({
            name: img.name,
            url: img.url
        })));
    }
    catch (error) {
        res.status(400).send(`Error while fetching images: ${error}`);
    }
}));
