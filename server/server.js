import express from 'express'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少 Supabase 环境变量！')
}

async function generate_session_enterid() {
    while (true) {
        const enterid = Math.floor(Math.random() * 900000 + 100000)
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('status', 'waiting')

        if (error) {
            return null
        }

        let collidedEnterid = false
        for (const session of data) {
            if (enterid === session.data.enterid) {
                collidedEnterid
            }
        }

        if (collidedEnterid === false) {
            return enterid
        }
    }
}

const app = express()
const supabase = createClient(supabaseUrl, supabaseAnonKey)

app.use(express.json())

app.post('/api/create-session', async (req, res) => {
    try {
        const host_id = crypto.randomUUID()
        const session_id = crypto.randomUUID()
        const session_enterid = generate_session_enterid()

        if (session_enterid === null) {
            res.status(500).json({ success: false })
        }

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
                status: 'waiting',
                data: {
                    enterid: session_enterid
                }
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