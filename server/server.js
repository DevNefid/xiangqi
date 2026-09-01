import express from 'express'

const app = express()

app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({ status: 'ok' })
})

app.get("/api/*", (req, res) => {
    res.json({})
})

export default app