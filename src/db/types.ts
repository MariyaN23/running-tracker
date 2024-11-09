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

export type ReportType = {
    week: string
    averageSpeed: number
    averageTime: number
    totalDistance: number
}

export type ImageType = {
    imageId: number
    name: string
    url: string
}