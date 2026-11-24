import { useState } from 'react'
import { BusFront, LogIn } from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, register } = useApp()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'manager' })
  const [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      if (mode === 'register') await register(form); else await login({ email: form.email, password: form.password })
      toast.success(mode === 'register' ? 'Account created' : 'Login successful')
    } catch (err) { toast.error(err.response?.data?.detail || 'Authentication failed') }
    finally { setBusy(false) }
  }
  return <div className="login-page"><div className="login-card"><div className="login-brand"><div className="brand-mark"><BusFront size={22}/></div><div><strong>Lost Property</strong><span>ROOM MANAGEMENT</span></div></div><span className="eyebrow">SECURE ACCESS</span><h1>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1><p>Use your account to access the Lost & Found management system.</p><form onSubmit={submit}>{mode === 'register' && <label className="field"><span>Name</span><input required value={form.name} onChange={e => setForm({...form,name:e.target.value})}/></label>}<label className="field"><span>Email</span><input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label><label className="field"><span>Password</span><input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label>{mode === 'register' && <label className="field"><span>Role</span><select value={form.role} onChange={e => setForm({...form,role:e.target.value})}><option value="passenger">Passenger</option><option value="driver">Driver</option><option value="manager">Manager</option></select></label>}<button className="btn btn-primary full-btn" disabled={busy}><LogIn size={16}/>{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Register'}</button></form><button className="auth-switch" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}</button></div></div>
}
