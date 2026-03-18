import React from 'react'
import { useNavigate } from 'react-router-dom'

// Results are shown inline in Assessment.jsx after completion.
// This page is a fallback redirect.
export default function ResultsPage() {
  const nav = useNavigate()
  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
      </nav>
      <div className="center">
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--ink3)' }}>No results to show.</p>
          <button className="btn btn-p" style={{ marginTop: 16 }} onClick={() => nav('/')}>Go Home</button>
        </div>
      </div>
    </div>
  )
}
