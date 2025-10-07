export default function Goals() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Goals</h2>
      <div className="rounded-xl border p-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Emergency Fund</span>
          <span>60% • $600 / $1000</span>
        </div>
        <div className="mt-2 h-2 bg-slate-200 rounded-full">
          <div className="h-2 bg-sky-500 rounded-full" style={{width:'60%'}}></div>
        </div>
      </div>
    </div>
  )
}
