import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const nav = useNavigate()
  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
        <div className="nav-r">
          <button className="btn btn-p btn-sm" onClick={() => nav('/admin/login')}>Admin Login</button>
        </div>
      </nav>
      <div className="center" style={{ flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, animation: 'up .5s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', background: 'var(--accent-dim)', border: '1px solid var(--accent-mid)', borderRadius: 999, marginBottom: 24 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>AI-Powered Cognitive Assessment</span>
          </div>
          <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.08, marginBottom: 18 }}>
            Hire for<br />cognitive potential
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink2)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 40px' }}>
            Create roles, share unique assessment links with candidates, and get instant Alva-style cognitive profiles the moment they finish.
          </p>
          <button className="btn btn-p btn-xl" onClick={() => nav('/admin/login')}>
            Open Admin Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 60, flexWrap: 'wrap', justifyContent: 'center', animation: 'up .65s ease' }}>
          {[
            ['🔗', 'Link-based',   'Each role gets a real shareable URL'],
            ['🎲', 'Randomised',   'AI builds a unique set per candidate'],
            ['📊', 'Alva-style',   'Full cognitive profile with percentile'],
            ['⚡', 'Instant',      'Results appear the moment they finish'],
          ].map(([ic, t, d]) => (
            <div key={t} style={{ textAlign: 'center', maxWidth: 120 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{ic}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{t}</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 3, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
