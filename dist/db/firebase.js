"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("firebase/app");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "paralect-test-49e89.firebaseapp.com",
    projectId: "paralect-test-49e89",
    storageBucket: "paralect-test-49e89.appspot.com",
    messagingSenderId: "476584106618",
    appId: "1:476584106618:web:13989ae28cf9e733ea79c3"
};
exports.app = (0, app_1.initializeApp)(firebaseConfig);
