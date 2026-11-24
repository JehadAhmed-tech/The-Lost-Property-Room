import { Inbox } from 'lucide-react'
export default function EmptyState({ title = 'Nothing here yet', text = 'New records will appear here when they are submitted.' }) {
  return <div className="empty-state"><div><Inbox size={25}/></div><strong>{title}</strong><p>{text}</p></div>
}