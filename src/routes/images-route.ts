import {Request, Response, Router} from "express";
import multer from 'multer';
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {app} from "../db/firebase";
import {imagesService} from "../services/images-service";
import {runningService} from "../services/running-service";
import {runningRouter} from "./running-route";
import {ImageType} from "../db/types";

export const imagesRouter = Router({})

const upload = multer()

imagesRouter.post('/',
    upload.single('file'),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).send({message: 'No file uploaded'})
                return
            }
            const storage = getStorage(app)
            const storageRef = ref(storage, "images/" + +new Date())
            const metatype = {contentType: req.file.mimetype, name: req.file.originalname}
            await uploadBytes(storageRef, req.file.buffer, metatype)
            const downloadUrl = await getDownloadURL(storageRef)
            const response = await imagesService.addImage(downloadUrl, req.file.originalname)
            res.status(200).send(`Image uploaded, url: ${response.url}`)
        } catch (error) {
            res.status(400).send({message: `Error while uploading image: ${error}`})
        }
    })

imagesRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const allImages = await imagesService.getImages()
            res.status(200).send(allImages.map((img) => ({
                name: img.name,
                url: img.url
            })))
        } catch (error) {
            res.status(400).send(`Error while fetching images: ${error}`)
        }
    })