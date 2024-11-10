import express, {Express} from "express";
import {imagesRouter} from "../routes/images-route";
import {imagesService} from "../services/images-service";
import request from "supertest";
import {ImageType} from "../db/types";

jest.mock('../services/images-service')

const app: Express = express()
app.use(express.json())
app.use('/images', imagesRouter)

describe('POST /images', () => {
    it('should upload an image and return URL of this image', async () => {
        const mockAddImage = imagesService.addImage as jest.Mock
        mockAddImage.mockResolvedValueOnce({ url: 'https://example.com/image.jpg' })

        const response = await request(app)
            .post('/images')
            .attach('file', Buffer.from('test'), 'test.jpg')

        expect(response.status).toBe(200)
        expect(response.text).toContain('Image uploaded')
        expect(mockAddImage).toHaveBeenCalledWith(
            expect.stringContaining('https://firebasestorage.googleapis.com/'), 'test.jpg')
    })

    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app).post('/images')

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('No file uploaded')
    })

    it('should return an error if upload fails', async () => {
        const mockAddImage = imagesService.addImage as jest.Mock
        mockAddImage.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app)
            .post('/images')
            .attach('file', Buffer.from('test'), 'test.jpg')

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Error while uploading image: Error: Service error')
    })
})

describe('GET /images', () => {
    it('should return list of images', async () => {
        const mockGetImages = imagesService.getImages as jest.Mock
        const mockImages = [
            { name: 'image1.jpg', url: 'https://example.com/image1.jpg' },
            { name: 'image2.jpg', url: 'https://example.com/image2.jpg' },
        ] as unknown as Omit<ImageType, 'imageId'>

        mockGetImages.mockResolvedValueOnce(mockImages)

        const response = await request(app).get('/images')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            { name: 'image1.jpg', url: 'https://example.com/image1.jpg' },
            { name: 'image2.jpg', url: 'https://example.com/image2.jpg' },
        ])
        expect(mockGetImages).toHaveBeenCalled()
    })

    it('should return an error if fetching images fails', async () => {
        const mockGetImages = imagesService.getImages as jest.Mock
        mockGetImages.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app).get('/images')

        expect(response.status).toBe(400)
        expect(response.text).toContain('Error while fetching images: Error: Service error')
    })
})