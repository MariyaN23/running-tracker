import {Collection, MongoClient} from "mongodb";
import dotenv from "dotenv";
import {RecordType, UserType} from "./types";

dotenv.config()

const mongodbURI = process.env.MONGODB_URI!

export const client = new MongoClient(mongodbURI)
const db = client.db("yellow")

export const usersCollection: Collection<UserType> = db.collection<UserType>("users")
export const runningCollection: Collection<RecordType> = db.collection<RecordType>("running")

export const runDb = async () => {
    try {
        await client.connect()
        await client.db("yellow").command({ping: 1})
        console.log("Connected successfully to mongo server")
    } catch (error) {
        await client.close()
        console.log("Can't connect to DB", error)
    }
}