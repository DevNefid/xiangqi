import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({ status: 'ok' })
})

app.use("/api/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'invalid_api.html'))
})

export default app