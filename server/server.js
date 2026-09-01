import express from 'express'

const app = express()

app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({ status: 'ok' })
})

app.use("/api/*", (req, res) => {
    res.status(404).sendFile('../client/pages/invalid_api.html')
})

export default app