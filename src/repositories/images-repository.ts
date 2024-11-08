import {imagesCollection} from "../db/db";
import {ImageType} from "../db/types";

export const imagesRepository = {
    async addImage(newImage: ImageType): Promise<ImageType> {
        await imagesCollection.insertOne(newImage)
        return newImage
    },
    async getImages(): Promise<ImageType[]> {
        return await imagesCollection.find({}).toArray()
    },
}