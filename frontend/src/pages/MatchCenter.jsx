import { GitCompareArrows, MapPin, CalendarDays, Check, X, ShieldCheck, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import toast from 'react-hot-toast'

export default function MatchCenter() {
  const { matches, lostReports, foundReports, reviewMatch } = useApp()
  const pending = matches.filter(m => m.status === 'Pending review')
  const act = (id, decision) => { reviewMatch(id, decision); toast.success(decision === 'confirmed' ? 'Match confirmed. Contact the owner before handover.' : 'Possible match rejected.') }
  const get = (list,id) => list.find(x => x.id === id)
  return <div className="page-content">
    <div className="page-toolbar"><div><span className="eyebrow">INTELLIGENT SUGGESTIONS</span><h2>Possible match review</h2><p>Compare both reports. You make the final decision.</p></div><div className="match-total"><GitCompareArrows size={18}/><strong>{pending.length}</strong><span>awaiting review</span></div></div>
    <div className="review-rule"><ShieldCheck size={19}/><div><strong>Manager approval required</strong><p>A similarity suggestion is not proof of ownership. Never release an item until the claimant is verified and you approve the handover.</p></div></div>
    {matches.length ? <div className="match-list">{matches.map(m => {
      const lost = get(lostReports,m.lostId), found = get(foundReports,m.foundId)
      return <article className="panel match-card" key={m.id}><div className="match-card-head"><div><span className="eyebrow">MATCH ID · {m.id}</span><h3>{m.lostItem} <span className="versus">vs</span> {m.foundItem}</h3></div><StatusBadge status={m.status}/></div>
        <div className="match-comparison"><div className="compare-box lost-box"><span className="type-pill lost">LOST REPORT</span><h4>{m.lostItem}</h4><p>{lost?.description || 'Report details unavailable'}</p><div className="compare-meta"><span><MapPin size={13}/>{lost?.route || m.route}</span><span><CalendarDays size={13}/>{lost?.reportDate || '—'}</span></div><small>Reported by {lost?.reporterName || 'Passenger'}</small></div><div className="compare-middle"><div className="score-ring"><strong>{m.score}%</strong><span>SIMILARITY</span></div><GitCompareArrows size={18}/></div><div className="compare-box found-box"><span className="type-pill found">FOUND REPORT</span><h4>{m.foundItem}</h4><p>{found?.description || 'Report details unavailable'}</p><div className="compare-meta"><span><MapPin size={13}/>{found?.route || m.route}</span><span><CalendarDays size={13}/>{found?.reportDate || '—'}</span></div><small>Logged by {found?.reporterName || 'Staff'}</small></div></div>
        <div className="match-reason"><Info size={15}/><span>{m.reason}</span></div>
        {m.status === 'Pending review' ? <div className="match-actions"><span>Does this appear to be the same item?</span><div><button className="btn btn-danger-outline" onClick={() => act(m.id,'rejected')}><X size={16}/> Reject</button><button className="btn btn-primary" onClick={() => act(m.id,'confirmed')}><Check size={16}/> Confirm match</button></div></div> : <div className="reviewed-note"><ShieldCheck size={16}/> Reviewed by Mr. Alam — {m.status}. {m.status === 'Confirmed' ? 'Contact the owner and complete a verified handover.' : 'No handover is permitted for this match.'}</div>}
      </article>
    })}</div> : <EmptyState title="No possible matches yet" text="When the backend matching service finds a possible match, it will appear here for your review."/>}
  </div>
}