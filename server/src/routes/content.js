import { Router } from 'express'

const router = Router()

const courses = [
  { id: 'js-basics', title: 'JavaScript Basics', description: 'Intro to JS', category: 'Web', video_url: 'https://www.youtube.com/embed/dummy' },
  { id: 'python-intro', title: 'Intro to Python', description: 'Start Python', category: 'Programming', video_url: 'https://www.youtube.com/embed/dummy' },
]

const lessons = [
  { id: 'budget-1', title: 'Budgeting Basics', content: '...', level: 'Beginner' },
  { id: 'save-1', title: 'Saving & Emergency Funds', content: '...', level: 'Beginner' },
]

router.get('/courses', (_req, res) => res.json(courses))
router.get('/lessons', (_req, res) => res.json(lessons))

export default router
