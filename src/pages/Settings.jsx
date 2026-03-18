import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dbGetSettings, dbSaveSettings, dbLoadSettings } from '../db'

export default function Settings() {
  const nav = useNavigate()
  const [settings, setSettings] = useState(dbGetSettings())
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    dbLoadSettings().then(s => { setSettings(s); setLoading(false) })
  }, [])

  const save = () => {
    dbSaveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center"><span className="sp sp-lg"/></div>
    </div>
  )

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={() => nav('/admin')} style={{ cursor: 'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
          <span style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 400, marginLeft: 3 }}>Settings</span>
        </div>
        <div className="nav-r">
          <button className="btn btn-g btn-sm" onClick={() => nav('/admin')}>← Dashboard</button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.5px' }}>Settings</h1>
          <p style={{ color: 'var(--ink3)', marginTop: 4, fontSize: 13 }}>Configure your assessment platform</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Admin Password */}
          <div className="card card-xl" style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Admin Password</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 18, lineHeight: 1.6 }}>
              Change the password used to access this admin portal.
            </div>
            <div className="fg">
              <label className="fl">New Password</label>
              <input className="fi" type="password" placeholder="Enter new password"
                value={settings.password}
                onChange={e => setSettings(p => ({ ...p, password: e.target.value }))} />
            </div>
          </div>

          {/* AI Questions API Key */}
          <div className="card card-xl" style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>AI Question Generation</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 18, lineHeight: 1.6 }}>
              Add your Anthropic API key to generate fresh, unique questions using AI for every candidate.
              Without a key, the app uses a built-in question bank.
            </div>
            {/* Google Gemini Key */}
            <div className="fg" style={{ marginBottom: 16 }}>
              <label className="fl">Google Gemini API Key (recommended)</label>
              <input className="fi" type="password" placeholder="AIzaSy..."
                value={settings.geminiKey || ''}
                onChange={e => setSettings(p => ({ ...p, geminiKey: e.target.value }))} />
              <span style={{ fontSize: 11, color: 'var(--ink3)' }}>
                Get free key at{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--accent)' }}>aistudio.google.com</a>
                {' '}— uses Gemini 1.5 Flash (free tier: 1,500 requests/day)
              </span>
            </div>

            {/* Anthropic Key */}
            <div className="fg" style={{ marginBottom: 12 }}>
              <label className="fl">Anthropic API Key (alternative)</label>
              <input className="fi" type="password" placeholder="sk-ant-..."
                value={settings.anthropicKey || ''}
                onChange={e => setSettings(p => ({ ...p, anthropicKey: e.target.value }))} />
              <span style={{ fontSize: 11, color: 'var(--ink3)' }}>
                Get key at{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--accent)' }}>console.anthropic.com</a>
                {' '}— ~$0.003 per candidate
              </span>
            </div>

            {(settings.geminiKey || settings.anthropicKey) && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge bg"><span className="dot"/>AI questions active</span>
                <span style={{ fontSize: 12, color: 'var(--ink3)' }}>
                  Using {settings.geminiKey ? 'Gemini 1.5 Flash' : 'Claude Haiku'}
                </span>
              </div>
            )}
          </div>

          {/* Email Alerts */}
          <div className="card card-xl" style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Email Alerts</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 18, lineHeight: 1.6 }}>
              Get notified by email when a candidate completes an assessment.
            </div>
            <div className="fg" style={{ marginBottom: 12 }}>
              <label className="fl">Admin Email</label>
              <input className="fi" type="email" placeholder="you@company.com"
                value={settings.adminEmail || ''}
                onChange={e => setSettings(p => ({ ...p, adminEmail: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={!!settings.emailAlerts}
                  onChange={e => setSettings(p => ({ ...p, emailAlerts: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                Send email alert when candidate completes
              </label>
            </div>
            {settings.emailAlerts && (
              <div style={{ marginTop: 12, background: 'var(--amber-dim, #fffbeb)', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                ⚠️ Email sending requires an email service like <strong>EmailJS</strong> or <strong>Resend</strong>.
                Currently emails are logged to the browser console. Contact your developer to connect a real email service.
              </div>
            )}
          </div>

          {/* Save */}
          <button className="btn btn-p btn-lg" style={{ justifyContent: 'center' }} onClick={save}>
            {saved ? '✓ Settings Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
