import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import MatchCenter from './pages/MatchCenter'
import Notifications from './pages/Notifications'
import Handover from './pages/Handover'
import History from './pages/History'

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="app-shell">
    <div className={`sidebar-scrim ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}/>
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}/>
    <main className="main-area"><Topbar onMenu={() => setMenuOpen(true)}/><Routes>
      <Route path="/" element={<Dashboard openForm={() => window.location.href = '/found-reports'}/>}/>
      <Route path="/lost-reports" element={<Reports type="lost"/>}/>
      <Route path="/found-reports" element={<Reports type="found"/>}/>
      <Route path="/matches" element={<MatchCenter/>}/>
      <Route path="/notifications" element={<Notifications/>}/>
      <Route path="/handover" element={<Handover/>}/>
      <Route path="/history" element={<History/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes><footer className="app-footer">© 2026 The Lost Property Room <span>SE 331 · Live Coding Assessment</span></footer></main>
  </div>
}
export default function App() {
  return <AppProvider><Shell/></AppProvider>
}