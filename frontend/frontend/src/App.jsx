import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Riders from './pages/Riders'
import Horses from './pages/Horses'
import Classes from './pages/Classes'
import Entries from './pages/Entries'

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Nav />
      <main className="flex-1 max-w-5xl mx-auto p-4 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/horses" element={<Horses />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/entries" element={<Entries />} />
        </Routes>
      </main>
    </div>
  )
}
