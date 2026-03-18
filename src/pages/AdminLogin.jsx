import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCurrentUser } from '../App'
import { dbAuthUser } from '../db'

export default function AdminLogin() {
  const [email, setEmail]   = useState('')
  const [pw, setPw]         = useState('')
  const [err, setErr]       = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const go = async () => {
    if (!email.trim() || !pw.trim()) { setErr('Please enter email and password'); return }
    setLoading(true)
    setErr('')
    try {
      const user = await dbAuthUser(email.trim(), pw)
      if (user) {
        setCurrentUser(user)
        nav('/admin')
      } else {
        setErr('Incorrect email or password')
      }
    } catch(e) {
      setErr('Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={() => nav('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
        </div>
        <div className="nav-r">
          <button className="btn btn-g btn-sm" onClick={() => nav('/')}>Home</button>
        </div>
      </nav>
      <div className="center">
        <div className="card card-xl au" style={{ width: '100%', maxWidth: 400, padding: 40 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.4px', marginBottom: 4 }}>Sign In</div>
          <div style={{ color: 'var(--ink3)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
            Admin &amp; Recruiter portal
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
            <div className="fg">
              <label className="fl">Email</label>
              <input className="fi" type="email" placeholder="your@email.com" value={email}
                onChange={e => { setEmail(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && go()} />
            </div>
            <div className="fg">
              <label className="fl">Password</label>
              <input className="fi" type="password" placeholder="Enter password" value={pw}
                onChange={e => { setPw(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && go()} />
            </div>
            {err && <span className="ferr">{err}</span>}
          </div>

          <button className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }}
            onClick={go} disabled={loading}>
            {loading ? <><span className="sp sp-sm" style={{ borderTopColor: '#fff' }} /> Signing in...</> : 'Sign In'}
          </button>

          <div style={{ marginTop: 20, padding: 14, background: 'var(--paper2)', borderRadius: 9, fontSize: 12, color: 'var(--ink3)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--ink2)' }}>Super Admin:</strong> use email <code style={{ fontFamily: 'JetBrains Mono', background: 'var(--paper3)', padding: '1px 5px', borderRadius: 3 }}>admin</code> and your admin password
          </div>
        </div>
      </div>
    </div>
  )
}
