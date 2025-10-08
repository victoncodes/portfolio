import { TransactionForm } from '../components/TransactionForm';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-semibold">Student Budget Tracker</h1>
        <nav className="text-sm opacity-80 space-x-4">
          <Link href="/" className="hover:opacity-100">Home</Link>
          <a href="#goals" className="hover:opacity-100">Goals</a>
        </nav>
      </header>
      <div className="max-w-3xl mx-auto p-5 grid gap-6">
        <section>
          <h2 className="text-lg font-medium mb-2">Quick Add</h2>
          <TransactionForm />
        </section>
        <section>
          <h2 className="text-lg font-medium mb-2">Recent Transactions</h2>
          <div className="opacity-70 text-sm">Wire up list via React Query later.</div>
        </section>
      </div>
    </main>
  );
}

