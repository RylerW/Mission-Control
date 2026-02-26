import { NavLink } from 'react-router-dom';
import { navItems } from '../config/navigation';

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-surface p-4 lg:flex">
      <h2 className="mb-8 text-lg font-semibold">Mission Control</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm transition ${
                isActive ? 'bg-sky-600/20 text-sky-300' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
