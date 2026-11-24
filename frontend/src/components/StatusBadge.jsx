export default function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase()
  let cls = 'neutral'
  if (['returned', 'confirmed', 'confirmed match'].includes(key)) cls = 'success'
  else if (['pending review', 'possible match', 'stored'].includes(key)) cls = 'warning'
  else if (['rejected', 'expired', 'disposed'].includes(key)) cls = 'danger'
  else if (['searching'].includes(key)) cls = 'info'
  return <span className={`status-badge ${cls}`}><i/>{status || 'Unknown'}</span>
}