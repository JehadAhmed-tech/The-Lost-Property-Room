import { useState } from 'react'
import { X, UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'

const initial = { itemName: '', category: 'Bag', color: '', description: '', route: '', busTime: '', reportDate: new Date().toISOString().slice(0,10), reporterName: '', phone: '' }
export default function ReportForm({ type, onClose, onSubmit }) {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const update = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try { await onSubmit(form); toast.success(`${type === 'lost' ? 'Lost' : 'Found'} report added`); onClose() }
    catch { toast.error('Could not save report. Please try again.') }
    finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="modal">
      <div className="modal-head"><div><span className="eyebrow">{type === 'lost' ? 'PASSENGER SUBMISSION' : 'DRIVER / STAFF SUBMISSION'}</span><h2>{type === 'lost' ? 'Report a lost item' : 'Register a found item'}</h2><p>Share as much detail as possible to help identify the item.</p></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label className="field"><span>Item name *</span><input name="itemName" value={form.itemName} onChange={update} placeholder="e.g. Black backpack" required/></label>
          <label className="field"><span>Category *</span><select name="category" value={form.category} onChange={update}><option>Bag</option><option>Electronics</option><option>Clothing</option><option>Documents</option><option>Bottle</option><option>Jewellery</option><option>Other</option></select></label>
          <label className="field"><span>Colour *</span><input name="color" value={form.color} onChange={update} placeholder="e.g. Black" required/></label>
          <label className="field"><span>{type === 'lost' ? 'Lost date' : 'Found date'} *</span><input type="date" name="reportDate" value={form.reportDate} onChange={update} required/></label>
          <label className="field"><span>Bus route *</span><input name="route" value={form.route} onChange={update} placeholder="e.g. Rangpur" required/></label>
          <label className="field"><span>Bus time</span><input name="busTime" value={form.busTime} onChange={update} placeholder="e.g. 6:00 PM"/></label>
          <label className="field full"><span>Description *</span><textarea name="description" value={form.description} onChange={update} rows="3" placeholder="Distinctive marks, contents, brand or other clues..." required/></label>
          <div className="form-divider full">CONTACT DETAILS</div>
          <label className="field"><span>{type === 'lost' ? 'Passenger name' : 'Driver / staff name'} *</span><input name="reporterName" value={form.reporterName} onChange={update} placeholder="Full name" required/></label>
          <label className="field"><span>Phone number *</span><input name="phone" value={form.phone} onChange={update} placeholder="01XXXXXXXXX" required/></label>
        </div>
        <div className="form-note"><UploadCloud size={16}/> Do not publish sensitive identity documents or passwords.</div>
        <div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Submit report'}</button></div>
      </form>
    </section>
  </div>
}