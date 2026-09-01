import express from 'express'

let sessions = []

function generate_session_id() {
    return Math.floor(Math.random() * 900000 + 100000)
}

const app = express()

app.use(express.json())

app.post('/api/create-session', (req, res) => {
    try {
        let session_id = generate_session_id()
        let host_id = crypto.randomUUID()
        sessions.push({
            id: session_id,
            player1: { id: host_id, color: 'b' },
            player2: undefined
        })
        res.status(200).json({ success: true, host_id: host_id, session_id: session_id })
    } catch (error) {
        res.status(500).json({ success: false })
    }

})

export default app