import { NavLink } from 'react-router-dom'

const base = 'px-3 py-2 rounded-md text-sm font-medium transition-colors block'
const active = 'bg-slate-900 text-white hover:bg-slate-800'
const idle = 'text-slate-700 hover:bg-slate-200'

export default function Nav() {
    return (
        <aside className="bg-slate-100 w-48 min-h-screen p-3">
            <nav className="flex flex-col gap-2">
                {/* Home button (brand) */}
                <NavLink to="/" end className="font-semibold mb-4 text-lg hover:underline">
                    🐎 Horse Show
                </NavLink>

                {/* Other links */}
                <NavLink to="/riders" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
                    Riders
                </NavLink>
                <NavLink to="/horses" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
                    Horses
                </NavLink>
                <NavLink to="/classes" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
                    Classes
                </NavLink>
                <NavLink to="/entries" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
                    Entries
                </NavLink>
            </nav>
        </aside>
    )
}
