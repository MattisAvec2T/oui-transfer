import express from 'express'

const server = express()
const port = 3000

server.get("/", (req, res, next) => {
    res.json({
        message: "Test"
    })
})

server.listen(port, () => console.log(`App running on port ${port}`))