import { Router } from 'express'
import { body, validationResult } from 'express-validator'

const router = Router()
const transactions = []

router.get('/', (_req, res) => {
  res.json(transactions)
})

router.post('/',
  body('type').isIn(['income', 'expense']),
  body('amount').isFloat({ gt: 0 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const tx = { id: crypto.randomUUID(), ...req.body }
    transactions.push(tx)
    res.status(201).json(tx)
  }
)

router.delete('/:id', (req, res) => {
  const idx = transactions.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Not found' })
  const [removed] = transactions.splice(idx, 1)
  res.json(removed)
})

export default router
