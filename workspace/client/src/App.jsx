import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import Lessons from './pages/Lessons'
import Courses from './pages/Courses'
import Settings from './pages/Settings'

function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="text-lg font-semibold text-slate-900">Student Budget</NavLink>
          <nav className="hidden sm:flex gap-4 text-sm">
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-sky-600 font-medium' : 'text-slate-600'}>Dashboard</NavLink>
            <NavLink to="/goals" className={({isActive}) => isActive ? 'text-sky-600 font-medium' : 'text-slate-600'}>Goals</NavLink>
            <NavLink to="/lessons" className={({isActive}) => isActive ? 'text-sky-600 font-medium' : 'text-slate-600'}>Finance Lessons</NavLink>
            <NavLink to="/courses" className={({isActive}) => isActive ? 'text-sky-600 font-medium' : 'text-slate-600'}>Courses</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <nav className="sm:hidden sticky bottom-0 z-20 border-t border-slate-200 bg-white">
        <div className="grid grid-cols-4 text-xs">
          <NavLink to="/dashboard" className={({isActive}) => `p-3 text-center ${isActive ? 'text-sky-600' : 'text-slate-600'}`}>Dashboard</NavLink>
          <NavLink to="/goals" className={({isActive}) => `p-3 text-center ${isActive ? 'text-sky-600' : 'text-slate-600'}`}>Goals</NavLink>
          <NavLink to="/lessons" className={({isActive}) => `p-3 text-center ${isActive ? 'text-sky-600' : 'text-slate-600'}`}>Lessons</NavLink>
          <NavLink to="/courses" className={({isActive}) => `p-3 text-center ${isActive ? 'text-sky-600' : 'text-slate-600'}`}>Courses</NavLink>
        </div>
      </nav>
    </div>
  )
}

export default App
