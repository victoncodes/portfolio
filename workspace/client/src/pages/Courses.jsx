export default function Courses() {
  const courses = [
    { id: 'js-basics', title: 'JavaScript Basics', category: 'Web Dev', video_url: 'https://www.youtube.com/embed/dummy' },
    { id: 'python-intro', title: 'Intro to Python', category: 'Programming', video_url: 'https://www.youtube.com/embed/dummy' },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Courses</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {courses.map((c) => (
          <li key={c.id} className="rounded-xl border p-4">
            <div className="font-medium">{c.title}</div>
            <div className="text-xs text-slate-500">{c.category}</div>
            <div className="mt-3 aspect-video bg-slate-100 rounded-lg overflow-hidden">
              <iframe className="w-full h-full" src={c.video_url} title={c.title} allowFullScreen></iframe>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
