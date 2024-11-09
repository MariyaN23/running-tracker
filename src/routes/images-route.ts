import {Request, Response, Router} from "express";
import multer from 'multer';
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {app} from "../db/firebase";
import {imagesService} from "../services/images-service";

export const imagesRouter = Router({})

const upload = multer()

/**
 * @swagger
 * /images:
 *   post:
 *     summary: Upload an image
 *     tags: [📷 Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 name: file
 *                 in: formData
 *                 description: The uploaded file data
 *                 required: true
 *                 type: file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Image uploaded, url: [image url]"
 *       400:
 *         description: Error while uploading image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded"
 */
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

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Return all images
 *     tags: [📷 Images]
 *     responses:
 *       200:
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *       400:
 *         description: Error while fetching images
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error while fetching images: [error details]"
 */
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