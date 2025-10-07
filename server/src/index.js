import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRouter from './routes/auth.js'
import transactionsRouter from './routes/transactions.js'
import goalsRouter from './routes/goals.js'
import contentRouter from './routes/content.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'student-budget-server' }))

app.use('/auth', authRouter)
app.use('/transactions', transactionsRouter)
app.use('/goals', goalsRouter)
app.use('/content', contentRouter)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
