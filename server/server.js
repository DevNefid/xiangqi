import express from 'express'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVER_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少 Supabase 环境变量！')
}

async function generate_session_enterid() {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('status', 'waiting')

        if (error) {
            console.log('Error#7: failed to read supabase table: ', error.message)
            return null
        }
    
        while (true) {
            const enterid = Math.floor(Math.random() * 900000 + 100000)
    
            let collidedEnterid = false
            for (const session of data) {
                if (enterid === session.data.enterid) {
                    collidedEnterid = true
                }
            }
    
            if (collidedEnterid === false) {
                return enterid
            }
        }
    } catch (error) {
        console.log('Error#4: generate_session_enterid() failed: ', error)
        return null
    }
}

const app = express()
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(express.json())

app.post('/api/create-session', async (req, res) => {
    try {
        const host_id = crypto.randomUUID()
        const session_id = crypto.randomUUID()
        const session_enterid = await generate_session_enterid()

        if (session_enterid === null) {
            console.error('Error#2: generate_session_enterid() returned null')
            return res.sendStatus(500)
        }

        const { data, error } = await supabase
            .from('sessions')
            .insert({
                session_id: session_id,
                players: {
                    [host_id]: {
                        is_host: true,
                        color: 'r'
                    }
                },
                status: 'waiting',
                data: {
                    enterid: session_enterid
                }
            })
            .select()

        if (error) {
            console.error('Error#3: failed to update supabase table: ', error.message)
            return res.sendStatus(500)
        }

        res.status(201).json({
            host_id: host_id,
            session_id: session_id,
            session_enterid: session_enterid
        })
    } catch (error) {
        console.error('Error#1: ', error)
        res.sendStatus(500)
    }
})

app.get('/api/session-exists', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('session_id')
            .eq('id', req.query.session_id)
            .single

        if (error) {
            console.error('Error#7: failed to read supabase table: ', error.message)
            return res.sendStatus(500)
        }

        if (data) {
            res.status(200).json({ exists: true })
        } else {
            res.status(200).json({ exists: false })
        }
    } catch (error) {
        console.error('Error#6: ', error)
        res.sendStatus(500)
    }
})

export default app