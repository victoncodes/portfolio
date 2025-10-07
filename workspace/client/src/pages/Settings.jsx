export default function Settings() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span>Dark mode</span>
          <button className="px-3 py-1 border rounded">Toggle</button>
        </div>
        <div className="flex items-center justify-between">
          <span>Data saver</span>
          <button className="px-3 py-1 border rounded">Enable</button>
        </div>
      </div>
    </div>
  )
}
