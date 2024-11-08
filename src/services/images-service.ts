import {imagesRepository} from "../repositories/images-repository";
import {ImageType} from "../db/types";

export const imagesService = {
    async addImage(downloadUrl: string, name: string): Promise<ImageType> {
        const imageId = +new Date()
        const newImage = {
            imageId,
            name,
            url: downloadUrl
        }
        return await imagesRepository.addImage(newImage)
    },
    async getImages(): Promise<ImageType[]> {
        return await imagesRepository.getImages()
    },
}