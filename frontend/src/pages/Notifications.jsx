import { Bell, CheckCheck, PackageCheck, GitCompareArrows } from 'lucide-react'
import { useApp } from '../context/AppContext'
import EmptyState from '../components/EmptyState'
import toast from 'react-hot-toast'

export default function Notifications() {
  const { notifications, markRead } = useApp()
  const unread = notifications.filter(n => !n.read).length
  const markAll = () => { notifications.filter(n => !n.read).forEach(n => markRead(n.id)); toast.success('Notifications marked as read') }
  return <div className="page-content"><div className="page-toolbar"><div><span className="eyebrow">UPDATES & ALERTS</span><h2>Notifications</h2><p>Stay informed about new reports and possible matches.</p></div>{unread > 0 && <button className="btn btn-light" onClick={markAll}><CheckCheck size={16}/> Mark all read</button>}</div>
    <section className="panel notification-list">{notifications.length ? notifications.map(n => <div className={`notification-row ${!n.read ? 'unread' : ''}`} key={n.id}><div className="notification-icon">{n.title.toLowerCase().includes('match') ? <GitCompareArrows size={18}/> : <PackageCheck size={18}/>}</div><div className="notification-copy"><strong>{n.title}</strong><p>{n.message}</p><small>{new Date(n.date).toLocaleString()}</small></div>{!n.read && <button className="btn btn-light btn-small" onClick={() => markRead(n.id)}>Mark read</button>}</div>) : <EmptyState title="You're all caught up" text="New updates will show here."/>}</section>
  </div>
}