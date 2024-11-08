import exp from "node:constants";

export type UserType = {
    id: number
    username: string
    password: string
}

export type RunningDataType = {
    distance: number
    runningTime: number
    date: string
}

export type RecordType = {
    userId: number
    recordId: number
    running: RunningDataType
}