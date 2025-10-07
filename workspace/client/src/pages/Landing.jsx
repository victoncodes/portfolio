export default function Landing() {
  return (
    <section className="mx-auto max-w-3xl text-center py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
        Student Budget Tracker & Learning Platform
      </h1>
      <p className="mt-3 text-slate-600">
        Track income, expenses, and goals. Learn finance basics and tech skills with
        bite-sized lessons and embedded courses. Offline-ready PWA with low data use.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <a href="/signup" className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium">Get Started</a>
        <a href="/login" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700">Sign in</a>
      </div>
    </section>
  )
}
