import { useMemo, useState, useEffect } from 'react'
import {
  Plus,
  Search,
  SlidersHorizontal,
  Download,
  PackageCheck
} from 'lucide-react'
import ReportForm from '../components/ReportForm'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'

export default function Reports({ type }) {
  const { lostReports, foundReports, addReport } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const rows = type === 'lost' ? lostReports : foundReports
  const filtered = useMemo(() => rows.filter(r => `${r.itemName} ${r.category} ${r.color} ${r.route} ${r.reporterName}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || r.status === status)), [rows, query, status])
  useEffect(() => {
    const handler = e => setQuery(e.detail || '')
    window.addEventListener('global-search', handler)
    return () => window.removeEventListener('global-search', handler)
  }, [])
  const exportCsv = () => {
    const headers = ['ID','Item','Category','Colour','Route','Date','Reporter','Phone','Status']
    const lines = [headers, ...filtered.map(r => [r.id,r.itemName,r.category,r.color,r.route,r.reportDate,r.reporterName,r.phone,r.status])]
    const csv = lines.map(row => row.map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url; a.download = `${type}-reports.csv`; a.click(); URL.revokeObjectURL(url)
  }
  return <div className="page-content">
    <div className="page-toolbar"><div><span className="eyebrow">{type === 'lost' ? 'PASSENGER REPORTS' : 'DRIVER & STAFF RECORDS'}</span><h2>{type === 'lost' ? 'Lost item reports' : 'Found item register'}</h2><p>{type === 'lost' ? 'Keep track of what passengers are looking for.' : 'A clear record of everything handed in to the property room.'}</p></div><button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={17}/>{type === 'lost' ? 'New lost report' : 'Log found item'}</button></div>
    <section className="panel list-panel"><div className="list-controls"><label className="search-field"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search item, route, reporter..."/></label><label className="select-filter"><SlidersHorizontal size={16}/><select value={status} onChange={e => setStatus(e.target.value)}><option>All statuses</option>{[...new Set(rows.map(r => r.status))].map(s => <option key={s}>{s}</option>)}</select></label><button className="btn btn-light export-btn" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
      {filtered.length ? <div className="table-wrap"><table><thead><tr><th>ITEM DETAILS</th><th>ROUTE / TIME</th><th>REPORTED BY</th><th>DATE</th><th>STATUS</th></tr></thead><tbody>{filtered.map(r => <tr key={r.id}><td><div className="item-cell"><div className={`item-thumb ${type}`}>{type === 'lost' ? <Search size={16}/> : <PackageCheck size={16}/>}</div><div><strong>{r.itemName}</strong><small>{r.id} · {r.category} · {r.color}</small></div></div></td><td><strong className="normal-strong">{r.route}</strong><small className="subline">{r.busTime || 'Time not provided'}</small></td><td><strong className="normal-strong">{r.reporterName}</strong><small className="subline">{r.phone}</small></td><td>{r.reportDate}</td><td><StatusBadge status={r.status}/></td></tr>)}</tbody></table></div> : <EmptyState title="No reports found" text="Try changing your search or add a new report."/>}
      <div className="table-footer">Showing <strong>{filtered.length}</strong> of <strong>{rows.length}</strong> reports</div>
    </section>
    {showForm && <ReportForm type={type} onClose={() => setShowForm(false)} onSubmit={data => addReport(type, data)}/>}
  </div>
}