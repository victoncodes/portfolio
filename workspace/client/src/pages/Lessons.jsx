export default function Lessons() {
  const lessons = [
    { title: 'Budgeting Basics', level: 'Beginner' },
    { title: 'Saving & Emergency Funds', level: 'Beginner' },
    { title: 'Investing 101', level: 'Intermediate' },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Finance Lessons</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {lessons.map((l) => (
          <li key={l.title} className="rounded-xl border p-4">
            <div className="font-medium">{l.title}</div>
            <div className="text-xs text-slate-500">{l.level}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
