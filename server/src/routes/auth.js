import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'

const router = Router()

// In-memory store for phase 1; replace with Mongo models later
const users = new Map()

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body
    if (users.has(email)) return res.status(409).json({ message: 'User exists' })

    const hash = await bcrypt.hash(password, 10)
    users.set(email, { name, email, password: hash, role: 'student' })
    return res.status(201).json({ message: 'Registered' })
  }
)

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    const user = users.get(email)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ sub: email, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } })
  }
)

export default router
