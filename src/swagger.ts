import swaggerJsDoc from "swagger-jsdoc"

export const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Running tracker API",
            version: "1.0.0",
            description: "A CRUD Running project",
        },
    },
    apis: [
        `${__dirname}/routes/*.js`,
        `${__dirname}/routes/*.ts`,
        `${__dirname}/swagger.js`,
        `${__dirname}/swagger.ts`,
    ]
})