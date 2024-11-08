import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";

interface Config {
    secret: string
}

export const config: Config = {
    secret: "SECRET_KEY_RANDOM"
}

export const generateAccessToken = (id: ObjectId) => {
    const payload = {
        id
    }
    return jwt.sign(payload, config.secret, {expiresIn: "24h"})
}