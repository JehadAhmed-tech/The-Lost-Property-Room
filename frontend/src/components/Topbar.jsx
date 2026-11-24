import { Bell, Menu, Search, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const titles = {
  '/': ['Overview', 'Here is what is happening in your property room.'],
  '/lost-reports': ['Lost reports', 'Passenger reports for items that have gone missing.'],
  '/found-reports': ['Found reports', 'Items handed in by drivers and terminal staff.'],
  '/matches': ['Match center', 'Review possible matches before any handover.'],
  '/notifications': ['Notifications', 'Updates that need your attention.'],
  '/handover': ['Handover management', 'Track confirmed items through safe return.'],
  '/history': ['Report history', 'A record of reports and their current status.']
}
export default function Topbar({ onMenu }) {
  const location = useLocation()
  const { notifications } = useApp()
  const [title, subtitle] = titles[location.pathname] || titles['/']
  const unread = notifications.filter(n => !n.read).length
  return <header className="topbar">
    <button className="icon-btn mobile-menu" onClick={onMenu}><Menu size={20}/></button>
    <div className="page-heading"><h1>{title}</h1><p>{subtitle}</p></div>
    <div className="top-actions">
      <label className="top-search"><Search size={16}/><input placeholder="Search reports..." onKeyDown={e => { if(e.key === 'Enter') window.dispatchEvent(new CustomEvent('global-search', { detail: e.target.value })) }}/><kbd>↵</kbd></label>
      <Link to="/notifications" className="icon-btn notification-button" aria-label="Notifications"><Bell size={19}/>{unread > 0 && <i/>}</Link>
      <div className="top-user"><div className="avatar small">MA</div><ChevronDown size={15}/></div>
    </div>
  </header>
}