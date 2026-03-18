import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAdminAuth } from '../App'
import { dbLoadSettings } from '../db'

export default function AdminLogin() {
  const [pw, setPw]       = useState('')
  const [err, setErr]     = useState('')
  const [adminPw, setAdminPw] = useState('admin123')
  const nav = useNavigate()

  useEffect(() => {
    dbLoadSettings().then(s => setAdminPw(s.password || 'admin123'))
  }, [])

  const go = () => {
    if (pw === adminPw) { setAdminAuth(true); nav('/admin') }
    else setErr('Wrong password')
  }

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={() => nav('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
        </div>
        <div className="nav-r">
          <button className="btn btn-g btn-sm" onClick={() => nav('/')}>← Home</button>
        </div>
      </nav>
      <div className="center">
        <div className="card card-xl au" style={{ width: '100%', maxWidth: 380, padding: 40 }}>
          <div style={{ width:46,height:46,borderRadius:13,background:'var(--accent-dim)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:22 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div style={{ fontWeight:800,fontSize:22,letterSpacing:'-.4px',marginBottom:4 }}>Admin Portal</div>
          <div style={{ color:'var(--ink3)',fontSize:13,marginBottom:28,lineHeight:1.6 }}>Sign in to manage assessments</div>
          <div className="fg" style={{ marginBottom:16 }}>
            <label className="fl">Password</label>
            <input className="fi" type="password" placeholder="Enter password" value={pw}
              onChange={e => { setPw(e.target.value); setErr('') }}
              onKeyDown={e => e.key === 'Enter' && go()} />
            {err && <span className="ferr">{err}</span>}
          </div>
          <button className="btn btn-p" style={{ width:'100%',justifyContent:'center' }} onClick={go}>Sign In</button>
          <div style={{ textAlign:'center',fontSize:11,color:'var(--ink3)',marginTop:16 }}>
            Default password: <code style={{ fontFamily:'JetBrains Mono',background:'var(--paper2)',padding:'2px 6px',borderRadius:4 }}>admin123</code>
          </div>
        </div>
      </div>
    </div>
  )
}
