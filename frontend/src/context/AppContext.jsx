import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { isMockMode } from '../services/api'
import { seedFound, seedLost, seedMatches, seedNotifications } from '../data/demoData'

const AppContext = createContext(null)
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}

const titleStatus = s => ({ searching: 'Searching', stored: 'Stored', found: 'Stored', confirmed_match: 'Confirmed match', confirmed: 'Confirmed', rejected: 'Rejected', returned: 'Returned', pending: 'Pending review' }[s] || s)
const mapLost = x => ({ ...x, id: `L-${x.id}`, type: 'lost', itemName: x.item_name, category: x.category, route: x.route, reportDate: x.lost_date, reporterName: x.reporter_name, status: titleStatus(x.status) })
const mapFound = x => ({ ...x, id: `F-${x.id}`, type: 'found', itemName: x.item_name, category: x.category, route: x.route, reportDate: x.found_date, reporterName: x.reporter_name, status: titleStatus(x.status) })
const numericId = id => Number(String(id).split('-').pop())

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => read('lpr_user', null))
  const [lostReports, setLostReports] = useState(() => isMockMode ? read('lpr_lost', seedLost) : [])
  const [foundReports, setFoundReports] = useState(() => isMockMode ? read('lpr_found', seedFound) : [])
  const [matches, setMatches] = useState(() => isMockMode ? read('lpr_matches', seedMatches) : [])
  const [notifications, setNotifications] = useState(() => read('lpr_notifications', seedNotifications))
  const [loading, setLoading] = useState(!isMockMode && !!localStorage.getItem('lpr_token'))

  useEffect(() => localStorage.setItem('lpr_user', JSON.stringify(user)), [user])
  useEffect(() => { if (isMockMode) localStorage.setItem('lpr_lost', JSON.stringify(lostReports)) }, [lostReports])
  useEffect(() => { if (isMockMode) localStorage.setItem('lpr_found', JSON.stringify(foundReports)) }, [foundReports])
  useEffect(() => { if (isMockMode) localStorage.setItem('lpr_matches', JSON.stringify(matches)) }, [matches])
  useEffect(() => localStorage.setItem('lpr_notifications', JSON.stringify(notifications)), [notifications])

  const refresh = async () => {
    if (isMockMode || !localStorage.getItem('lpr_token')) return
    setLoading(true)
    try {
      const requests = [api.get('/lost'), api.get('/found')]
      if (user?.role === 'manager') requests.push(api.get('/matches'))
      const [lostRes, foundRes, matchRes] = await Promise.all(requests)
      setLostReports(lostRes.data.map(mapLost))
      setFoundReports(foundRes.data.map(mapFound))
      if (matchRes) {
        const lost = lostRes.data, found = foundRes.data
        setMatches(matchRes.data.map(m => {
          const l = lost.find(x => x.id === m.lost_item_id), f = found.find(x => x.id === m.found_item_id)
          return { ...m, id: `M-${m.id}`, lostId: `L-${m.lost_item_id}`, foundId: `F-${m.found_item_id}`, lostItem: l?.item_name || `Lost #${m.lost_item_id}`, foundItem: f?.item_name || `Found #${m.found_item_id}`, route: l?.route || f?.route || '', score: Math.round(m.score), status: titleStatus(m.status), reason: `Similarity score ${Math.round(m.score)}% based on item details, category, colour, route, date and description.` }
        }))
      }
    } finally { setLoading(false) }
  }

  useEffect(() => { refresh().catch(() => setLoading(false)) }, [user?.id])

  const login = async credentials => {
    if (isMockMode) {
      const demo = { id: 1, name: 'Mr. Alam', email: credentials.email, role: credentials.role || 'manager' }
      localStorage.setItem('lpr_token', 'mock-token'); setUser(demo); return demo
    }
    const res = await api.post('/auth/login', credentials)
    localStorage.setItem('lpr_token', res.data.access_token)
    setUser(res.data.user)
    return res.data.user
  }

  const register = async data => {
    if (isMockMode) return login(data)
    await api.post('/auth/register', data)
    return login({ email: data.email, password: data.password })
  }

  const logout = () => { localStorage.removeItem('lpr_token'); localStorage.removeItem('lpr_user'); setUser(null); setLostReports([]); setFoundReports([]); setMatches([]) }

  const addReport = async (type, data) => {
    if (isMockMode) {
      const id = `${type === 'lost' ? 'L' : 'F'}-${Date.now().toString().slice(-6)}`
      const report = { ...data, id, type, status: type === 'lost' ? 'Searching' : 'Stored' }
      if (type === 'lost') setLostReports(prev => [report, ...prev]); else setFoundReports(prev => [report, ...prev])
      return report
    }
    const payload = type === 'lost' ? {
      item_name: data.itemName, category: data.category, color: data.color, route: data.route, bus_time: data.busTime || null, lost_date: data.reportDate, description: data.description, reporter_name: data.reporterName, phone: data.phone
    } : {
      item_name: data.itemName, category: data.category, color: data.color, route: data.route, bus_time: data.busTime || null, found_date: data.reportDate, description: data.description, reporter_name: data.reporterName, phone: data.phone
    }
    const res = await api.post(type === 'lost' ? '/lost' : '/found', payload)
    await refresh()
    return type === 'lost' ? mapLost(res.data) : mapFound(res.data)
  }

  const reviewMatch = async (id, decision) => {
    if (isMockMode) {
      const match = matches.find(item => item.id === id); if (!match) return
      const status = decision === 'confirmed' ? 'Confirmed' : 'Rejected'
      setMatches(prev => prev.map(item => item.id === id ? { ...item, status } : item))
      if (decision === 'confirmed') {
        setLostReports(prev => prev.map(item => item.id === match.lostId ? { ...item, status: 'Confirmed match' } : item))
        setFoundReports(prev => prev.map(item => item.id === match.foundId ? { ...item, status: 'Confirmed match' } : item))
      }
      setNotifications(prev => [{ id: `N-${Date.now()}`, title: `Match ${status.toLowerCase()}`, message: `${match.lostItem} and ${match.foundItem}: ${status.toLowerCase()} by Mr. Alam.`, date: new Date().toISOString(), read: false }, ...prev])
      return
    }
    await api.patch(`/matches/${numericId(id)}/status`, { status: decision })
    await refresh()
  }

  const markReturned = async foundId => {
    if (isMockMode) {
      const relatedMatch = matches.find(item => item.foundId === foundId && item.status === 'Confirmed')
      setFoundReports(prev => prev.map(item => item.id === foundId ? { ...item, status: 'Returned' } : item))
      if (relatedMatch) { setLostReports(prev => prev.map(item => item.id === relatedMatch.lostId ? { ...item, status: 'Returned' } : item)); setMatches(prev => prev.map(item => item.id === relatedMatch.id ? { ...item, status: 'Returned' } : item)) }
      return
    }
    const match = matches.find(item => item.foundId === foundId && item.status === 'Confirmed')
    if (!match) throw new Error('No confirmed match found for this item')
    await api.post(`/matches/${numericId(match.id)}/return`)
    await refresh()
  }

  const markRead = id => setNotifications(prev => prev.map(item => item.id === id ? { ...item, read: true } : item))
  const value = useMemo(() => ({ user, loading, isAuthenticated: !!user, login, register, logout, refresh, lostReports, foundReports, matches, notifications, addReport, reviewMatch, markReturned, markRead }), [user, loading, lostReports, foundReports, matches, notifications])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export const useApp = () => useContext(AppContext)
