import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { Archive, Clock3 } from 'lucide-react'

export default function History() {
  const { lostReports, foundReports, matches } = useApp()
  const rows = [...lostReports, ...foundReports].sort((a,b) => new Date(b.reportDate)-new Date(a.reportDate))
  const age = date => Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  const expired = rows.filter(r => age(r.reportDate) >= 30 && r.status !== 'Returned')
  return <div className="page-content"><div className="page-toolbar"><div><span className="eyebrow">RECORD ARCHIVE</span><h2>Report history</h2><p>A complete view of lost and found records.</p></div><div className="history-total"><Archive size={18}/>{rows.length} total records</div></div>
    <div className="history-cards"><div className="panel mini-stat"><span>Total reports</span><strong>{rows.length}</strong></div><div className="panel mini-stat"><span>Returned items</span><strong>{foundReports.filter(r => r.status === 'Returned').length}</strong></div><div className="panel mini-stat"><span>Rejected matches</span><strong>{matches.filter(m => m.status === 'Rejected').length}</strong></div><div className="panel mini-stat"><span>30+ day records</span><strong>{expired.length}</strong></div></div>
    <section className="panel list-panel"><div className="panel-head history-head"><div><h3>All reports</h3><p>Lost and found records in one timeline</p></div></div>{rows.length ? <div className="table-wrap"><table><thead><tr><th>REPORT</th><th>TYPE</th><th>DATE</th><th>REPORTED BY</th><th>AGE</th><th>STATUS</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td><div className="item-cell"><div className={`item-thumb ${r.type}`}>{r.type === 'lost' ? 'L' : 'F'}</div><div><strong>{r.itemName}</strong><small>{r.id}</small></div></div></td><td><span className={`type-pill ${r.type}`}>{r.type}</span></td><td>{r.reportDate}</td><td>{r.reporterName}</td><td>{age(r.reportDate)} days</td><td><StatusBadge status={r.status}/></td></tr>)}</tbody></table></div> : <EmptyState/>}</section>
    <div className="footnote"><Clock3 size={14}/> Policy reminder: items are kept for 30 days. Disposal should follow the terminal's approved process and be recorded by staff.</div>
  </div>
}