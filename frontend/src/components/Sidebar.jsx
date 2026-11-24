
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  PackageCheck,
  GitCompareArrows,
  Bell,
  Handshake,
  History,
  BusFront,
  PanelLeftClose,
  LogOut
} from 'lucide-react'

import { useApp } from '../context/AppContext'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/lost-reports', label: 'Lost reports', icon: Search },
  { to: '/found-reports', label: 'Found reports', icon: PackageCheck },
  { to: '/matches', label: 'Match center', icon: GitCompareArrows, badge: '2' },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/handover', label: 'Handover', icon: Handshake },
  { to: '/history', label: 'Report history', icon: History }
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useApp()

  const handleLogout = () => {
    logout()
    onClose?.()
  }

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <BusFront size={21} />
        </div>

        <div>
          <strong>Lost Property</strong>
          <span>ROOM MANAGEMENT</span>
        </div>

        <button
          className="icon-btn sidebar-close"
          onClick={onClose}
          type="button"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="nav-caption">WORKSPACE</div>

      <nav>
        {links.map(({ to, label, icon: Icon, badge, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {badge && <b className="nav-badge">{badge}</b>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">?</div>
          <strong>Need a hand?</strong>
          <p>
            Keep every found item safe until its owner is verified.
          </p>
        </div>

        <div className="profile">
          <div className="avatar">
            {(user?.name || 'User').charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.name || 'User'}</strong>
            <span>{user?.role || 'Member'}</span>
          </div>

          <span className="online-dot" />
        </div>

        <button
          type="button"
          className="nav-link logout-link"
          onClick={handleLogout}
          style={{ width: '100%', cursor: 'pointer', marginTop: '10px' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
