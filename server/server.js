import express from 'express'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

function generate_session_enterid() {
    return Math.floor(Math.random() * 900000 + 100000)
}

const app = express()

app.use(express.json())

app.post('/api/create-session', async (req, res) => {
    try {
        const host_id = crypto.randomUUID()
        const session_id = crypto.randomUUID()
        const session_enterid = generate_session_enterid()
        const { data, error } = await supabase
            .from('sessions')
            .insert({
                session_id: session_id,
                players: {
                    [host_id]: {
                        is_host: true,
                        color: "r"
                    }
                },
                status: 'waiting'
            })
            .select()

        if (error) {
            return res.status(500).json({ success: false })
        }

        res.status(201).json({
            success: true,
            host_id: host_id,
            session_id: session_id,
            session_enterid: session_enterid
        })
    } catch (error) {
        res.status(500).json({ success: false })
    }
})

export default app