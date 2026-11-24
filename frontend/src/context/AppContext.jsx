import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedFound, seedLost, seedMatches, seedNotifications } from '../data/demoData'

const AppContext = createContext(null)
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback }
  catch { return fallback }
}

export function AppProvider({ children }) {
  const [lostReports, setLostReports] = useState(() => read('lpr_lost', seedLost))
  const [foundReports, setFoundReports] = useState(() => read('lpr_found', seedFound))
  const [matches, setMatches] = useState(() => read('lpr_matches', seedMatches))
  const [notifications, setNotifications] = useState(() => read('lpr_notifications', seedNotifications))

  useEffect(() => localStorage.setItem('lpr_lost', JSON.stringify(lostReports)), [lostReports])
  useEffect(() => localStorage.setItem('lpr_found', JSON.stringify(foundReports)), [foundReports])
  useEffect(() => localStorage.setItem('lpr_matches', JSON.stringify(matches)), [matches])
  useEffect(() => localStorage.setItem('lpr_notifications', JSON.stringify(notifications)), [notifications])

  const addReport = (type, data) => {
    const id = `${type === 'lost' ? 'L' : 'F'}-${Date.now().toString().slice(-6)}`
    const report = { ...data, id, type, status: type === 'lost' ? 'Searching' : 'Stored' }
    if (type === 'lost') setLostReports(prev => [report, ...prev])
    else setFoundReports(prev => [report, ...prev])
    return report
  }

  const reviewMatch = (id, decision) => {
    const match = matches.find(item => item.id === id)
    if (!match || match.status !== 'Pending review') return
    const status = decision === 'confirmed' ? 'Confirmed' : 'Rejected'
    setMatches(prev => prev.map(item => item.id === id ? { ...item, status } : item))
    if (decision === 'confirmed') {
      setLostReports(prev => prev.map(item => item.id === match.lostId ? { ...item, status: 'Confirmed match' } : item))
      setFoundReports(prev => prev.map(item => item.id === match.foundId ? { ...item, status: 'Confirmed match' } : item))
    }
    setNotifications(prev => [{
      id: `N-${Date.now()}`, title: `Match ${status.toLowerCase()}`,
      message: `${match.lostItem} and ${match.foundItem}: ${status.toLowerCase()} by Mr. Alam.`,
      date: new Date().toISOString(), read: false
    }, ...prev])
  }

  const markReturned = (foundId) => {
    const relatedMatch = matches.find(item => item.foundId === foundId && item.status === 'Confirmed')
    setFoundReports(prev => prev.map(item => item.id === foundId ? { ...item, status: 'Returned', returnedAt: new Date().toISOString() } : item))
    if (relatedMatch) {
      setLostReports(prev => prev.map(item => item.id === relatedMatch.lostId ? { ...item, status: 'Returned' } : item))
      setMatches(prev => prev.map(item => item.id === relatedMatch.id ? { ...item, status: 'Returned' } : item))
    }
  }

  const markRead = (id) => setNotifications(prev => prev.map(item => item.id === id ? { ...item, read: true } : item))
  const value = useMemo(() => ({ lostReports, foundReports, matches, notifications, addReport, reviewMatch, markReturned, markRead }), [lostReports, foundReports, matches, notifications])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export const useApp = () => useContext(AppContext)