import express from 'express';
import {runDb} from "./db/db";
import {authRouter} from "./routes/auth-route";
import {runningRouter} from "./routes/running-route";
import {imagesRouter} from "./routes/images-route";
import swaggerUi from "swagger-ui-express"
import {swaggerSpec} from "./swagger";

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use('/auth', authRouter)
app.use('/running', runningRouter)
app.use('/images', imagesRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const startApp = async ()=> {
    await runDb()
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startApp()