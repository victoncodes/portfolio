export default function Login() {
  return (
    <div className="max-w-sm mx-auto py-10">
      <h2 className="text-2xl font-semibold">Login</h2>
      <form className="mt-6 space-y-4">
        <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Email" type="email" />
        <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Password" type="password" />
        <button className="w-full rounded bg-sky-600 text-white py-2">Sign in</button>
      </form>
    </div>
  )
}
