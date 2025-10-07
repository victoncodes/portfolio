import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const sample = [
  { name: 'Jan', income: 300, expense: 220 },
  { name: 'Feb', income: 280, expense: 260 },
  { name: 'Mar', income: 320, expense: 200 },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border p-4"><div className="text-slate-500 text-sm">Income</div><div className="text-xl font-semibold">$900</div></div>
        <div className="rounded-xl border p-4"><div className="text-slate-500 text-sm">Expenses</div><div className="text-xl font-semibold">$680</div></div>
        <div className="rounded-xl border p-4"><div className="text-slate-500 text-sm">Savings</div><div className="text-xl font-semibold">$220</div></div>
        <div className="rounded-xl border p-4"><div className="text-slate-500 text-sm">Goals</div><div className="text-xl font-semibold">2</div></div>
      </div>
      <div className="rounded-xl border p-4">
        <h3 className="font-medium mb-3">Income vs Expenses</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sample}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
