import { useMemo } from 'react'
import { Search, PackageCheck, GitCompareArrows, CheckCircle2, ArrowRight, Plus, Clock3, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

export default function Dashboard({ openForm }) {
  const { lostReports, foundReports, matches } = useApp()
  const returned = foundReports.filter(x => x.status === 'Returned').length
  const recent = useMemo(() => [...lostReports, ...foundReports].sort((a,b) => new Date(b.reportDate) - new Date(a.reportDate)).slice(0,5), [lostReports, foundReports])
  return <div className="page-content">
    <section className="welcome-banner"><div className="welcome-copy"><span className="eyebrow light">PROPERTY ROOM OVERVIEW</span><h2>Good day, Mr. Alam <span>✦</span></h2><p>Every item has a story. Let’s help it find its way home.</p><div className="welcome-actions"><button className="btn btn-white" onClick={() => openForm('found')}><Plus size={16}/> Add found item</button><Link className="banner-link" to="/matches">Review matches <ArrowRight size={15}/></Link></div></div><div className="banner-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="box-illustration">⌑</div><Sparkles className="sparkle s1"/><Sparkles className="sparkle s2"/></div></section>
    <div className="section-title"><div><h2>Room at a glance</h2><p>Current records across the terminal</p></div><span className="updated"><span/> Live overview</span></div>
    <div className="stats-grid">
      <StatCard label="Lost reports" value={lostReports.length} note="Active records" icon={Search} tone="blue"/>
      <StatCard label="Found reports" value={foundReports.length} note="Items logged" icon={PackageCheck} tone="teal"/>
      <StatCard label="Possible matches" value={matches.filter(x => x.status === 'Pending review').length} note="Awaiting your review" icon={GitCompareArrows} tone="amber"/>
      <StatCard label="Items returned" value={returned} note="Successfully handed over" icon={CheckCircle2} tone="violet"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel recent-panel"><div className="panel-head"><div><h3>Recent activity</h3><p>The latest lost and found reports</p></div><Link to="/history" className="text-link">View all <ArrowRight size={14}/></Link></div>
        {recent.length ? <div className="table-wrap"><table><thead><tr><th>ITEM</th><th>REPORT TYPE</th><th>DATE</th><th>STATUS</th></tr></thead><tbody>{recent.map(item => <tr key={item.id}><td><div className="item-cell"><div className={`item-thumb ${item.type}`}>{item.type === 'lost' ? <Search size={16}/> : <PackageCheck size={16}/>}</div><div><strong>{item.itemName}</strong><small>{item.id}</small></div></div></td><td><span className={`type-pill ${item.type}`}>{item.type}</span></td><td>{item.reportDate}</td><td><StatusBadge status={item.status}/></td></tr>)}</tbody></table></div> : <EmptyState/>}
      </section>
      <section className="panel match-panel"><div className="panel-head"><div><h3>Needs your attention</h3><p>Possible matches to review</p></div><div className="attention-count">{matches.filter(x => x.status === 'Pending review').length}</div></div>
        {matches.filter(x => x.status === 'Pending review').slice(0,3).map(m => <div className="attention-item" key={m.id}><div className="attention-icon"><GitCompareArrows size={17}/></div><div className="attention-info"><strong>{m.lostItem} <span>↔</span> {m.foundItem}</strong><small><MapPin size={12}/>{m.route} route · {m.score}% similarity</small></div><StatusBadge status={m.status}/></div>)}
        {matches.filter(x => x.status === 'Pending review').length === 0 && <EmptyState title="All caught up" text="No possible matches are waiting for review."/>}
        <Link to="/matches" className="btn btn-outline full-btn">Open match center <ArrowRight size={15}/></Link>
      </section>
    </div>
    <div className="footnote"><Clock3 size={14}/> Unclaimed items are kept for 30 days, then marked for disposal according to terminal policy.</div>
  </div>
}