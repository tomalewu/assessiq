import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCurrentUser } from '../App'
import { dbGetSettings, dbSaveSettings, dbLoadSettings } from '../db'

// ── API Test ──────────────────────────────────────────────────────────
async function testGemini(apiKey) {
  const prompt = 'Reply with only this exact JSON and nothing else: {"status":"ok","model":"gemini"}'
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 50 } })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'HTTP ' + res.status)
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Empty response from Gemini')
  return 'Gemini 1.5 Flash responded successfully. AI question generation is active.'
}

async function testAnthropic(apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Reply with only this JSON: {"status":"ok"}' }]
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'HTTP ' + res.status)
  }
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  if (!text) throw new Error('Empty response from Anthropic')
  return 'Claude Haiku responded successfully. AI question generation is active.'
}

function APITestButton({ label, onTest }) {
  const [status, setStatus]   = useState(null) // null | 'testing' | 'ok' | 'fail'
  const [message, setMessage] = useState('')

  const run = async () => {
    setStatus('testing')
    setMessage('')
    try {
      const msg = await onTest()
      setStatus('ok')
      setMessage(msg)
    } catch(e) {
      setStatus('fail')
      setMessage(e.message || 'Unknown error')
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button className={'btn btn-sm ' + (status === 'ok' ? 'btn-s' : 'btn-g')}
        onClick={run} disabled={status === 'testing'}
        style={{ fontSize: 12 }}>
        {status === 'testing'
          ? <><span className="sp sp-sm"/> Testing...</>
          : status === 'ok'
          ? '✓ Test Again'
          : '🔌 Test ' + label + ' Connection'}
      </button>

      {status === 'ok' && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px',
          background: 'var(--ok-dim)', border: '1.5px solid var(--ok)', borderRadius: 9 }}>
          <span style={{ color: 'var(--ok)', fontSize: 16, flexShrink: 0 }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ok)', marginBottom: 2 }}>API Working</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6 }}>{message}</div>
          </div>
        </div>
      )}
      {status === 'fail' && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px',
          background: 'var(--bad-dim)', border: '1.5px solid var(--bad)', borderRadius: 9 }}>
          <span style={{ color: 'var(--bad)', fontSize: 16, flexShrink: 0 }}>❌</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--bad)', marginBottom: 2 }}>API Failed</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6 }}>{message}</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 4 }}>
              Check that your API key is correct and has not expired.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
          <button className="btn btn-g btn-sm" onClick={() => nav('/admin/users')}>👥 Users</button>
          <button className="btn btn-g btn-sm" onClick={() => { setCurrentUser(null); nav('/') }}>Sign out</button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.5px' }}>Settings</h1>
          <p style={{ color: 'var(--ink3)', marginTop: 4, fontSize: 13 }}>Configure your assessment platform — Super Admin only</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Admin Password */}
          <div className="card card-xl" style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Admin Password</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 18, lineHeight: 1.6 }}>
              Change the password used by the Super Admin to access this portal.
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
              Connect an AI API to generate unique questions for every candidate.
              Without a key, the app uses the built-in 100-question bank.
            </div>

            {/* Google Gemini Key */}
            <div className="fg" style={{ marginBottom: 6 }}>
              <label className="fl">Google Gemini API Key (recommended)</label>
              <input className="fi" type="password" placeholder="AIzaSy..."
                value={settings.geminiKey || ''}
                onChange={e => setSettings(p => ({ ...p, geminiKey: e.target.value }))} />
              <span style={{ fontSize: 11, color: 'var(--ink3)' }}>
                Get free key at{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--accent)' }}>aistudio.google.com</a>
                {' '}— free tier: 1,500 requests/day
              </span>
            </div>
            {settings.geminiKey && (
              <APITestButton
                label="Gemini"
                onTest={() => testGemini(settings.geminiKey)}
              />
            )}

            <div style={{ margin: '20px 0', borderTop: '1px solid var(--line)' }} />

            {/* Anthropic Key */}
            <div className="fg" style={{ marginBottom: 6 }}>
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
            {settings.anthropicKey && (
              <APITestButton
                label="Anthropic"
                onTest={() => testAnthropic(settings.anthropicKey)}
              />
            )}

            {(settings.geminiKey || settings.anthropicKey) && (
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge bg"><span className="dot"/>AI questions active</span>
                <span style={{ fontSize: 12, color: 'var(--ink3)' }}>
                  Using {settings.geminiKey ? 'Gemini 1.5 Flash' : 'Claude Haiku'}
                </span>
              </div>
            )}
            {!settings.geminiKey && !settings.anthropicKey && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge ba"><span className="dot"/>Using built-in question bank</span>
                <span style={{ fontSize: 12, color: 'var(--ink3)' }}>100 questions, unique per candidate</span>
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
              <div style={{ marginTop: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                Email sending requires EmailJS or Resend integration. Contact your developer to activate.
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
