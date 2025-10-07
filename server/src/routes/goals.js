import { Router } from 'express'
import { body, validationResult } from 'express-validator'

const router = Router()
const goals = []

router.get('/', (_req, res) => {
  res.json(goals)
})

router.post('/',
  body('target_amount').isFloat({ gt: 0 }),
  body('saved_amount').isFloat({ min: 0 }),
  body('deadline').isISO8601(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const goal = { id: crypto.randomUUID(), ...req.body }
    goals.push(goal)
    res.status(201).json(goal)
  }
)

router.put('/:id', (req, res) => {
  const idx = goals.findIndex(g => g.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Not found' })
  goals[idx] = { ...goals[idx], ...req.body }
  res.json(goals[idx])
})

export default router
