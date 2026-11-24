import { ArrowUpRight } from 'lucide-react'
export default function StatCard({ label, value, note, icon: Icon, tone }) {
  return <article className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon size={20}/></div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-note"><span><ArrowUpRight size={13}/>{note}</span> <small>vs. last 30 days</small></div>
  </article>
}