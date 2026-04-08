import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SJT_QUESTIONS, DIMENSIONS, scoreLeadership, getDimQualitative, getOverallNarrative, selectQuestions } from '../leadership'
import { dbAddCandidate, dbSaveCandidate, dbAllCandidates, dbLoadSettings } from '../db'
import { OPQ_STATEMENTS, OPQ_DIMENSIONS, scoreOPQ } from '../opq'

function genId(p) { return p + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7) }

function makeSeed(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) { h = ((h << 5) - h) + id.charCodeAt(i); h |= 0 }
  return Math.abs(h)
}

// ── Welcome Screen ────────────────────────────────────────────────────
function LWelcome({ role, onBegin }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'' })
  const [errs, setErrs] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    setErrs(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
      </nav>
      <div style={{ display:'flex', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:480 }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>👥</div>
            <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:'-.5px', marginBottom:8 }}>{role.title}</h1>
            <p style={{ color:'var(--ink3)', fontSize:14, lineHeight:1.7 }}>
              Leadership Assessment — {role.dept || 'People Manager Evaluation'}
            </p>
          </div>

          {/* Assessment structure */}
          <div className="card card-xl" style={{ padding:20, marginBottom:16, background:'var(--accent-dim)', border:'1px solid var(--accent-mid)' }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--accent)', marginBottom:12 }}>Assessment Structure</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span>📋 Part 1 — Situational Judgement</span>
                <span style={{ fontWeight:700, color:'var(--accent)' }}>15 questions</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span>🧠 Part 2 — Personality Assessment</span>
                <span style={{ fontWeight:700, color:'var(--accent)' }}>30 statements</span>
              </div>
              <div style={{ height:1, background:'var(--accent-mid)', margin:'4px 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:700 }}>
                <span>⏱ Total Time Allowed</span>
                <span style={{ color:'var(--accent)' }}>30 minutes</span>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
            {[
              { icon:'🎯', label:'No right or wrong answers', sub:'We assess your natural leadership approach' },
              { icon:'🔒', label:'Confidential', sub:'Results are only shared with the recruitment team' },
              { icon:'📵', label:'No distractions', sub:'Find a quiet space — tab switching is monitored' },
            ].map((item, i) => (
              <div key={i} className="card card-xl" style={{ padding:'12px 16px', display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{item.label}</div>
                  <div style={{ fontSize:11, color:'var(--ink3)' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card card-xl" style={{ padding:28, marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:18 }}>Your Details</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="fg">
                <label className="fl">Full Name *</label>
                <input className="fi" placeholder="As it appears on your CV"
                  value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                {errs.name && <span className="ferr">{errs.name}</span>}
              </div>
              <div className="fg">
                <label className="fl">Email Address *</label>
                <input className="fi" type="email" placeholder="your@email.com"
                  value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                {errs.email && <span className="ferr">{errs.email}</span>}
              </div>
              <div className="fg">
                <label className="fl">Phone Number</label>
                <input className="fi" placeholder="+1 234 567 8900"
                  value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
              </div>
            </div>
          </div>

          <button className="btn btn-p btn-xl" style={{ width:'100%', justifyContent:'center' }}
            onClick={() => validate() && onBegin(form)}>
            Begin Leadership Assessment →
          </button>
          <p style={{ textAlign:'center', fontSize:11, color:'var(--ink3)', marginTop:12, lineHeight:1.6 }}>
            This assessment has a 30-minute time limit covering both parts. Find a quiet place and ensure you will not be interrupted.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── SJT Quiz ─────────────────────────────────────────────────────────
function LQuiz({ candidate, questions, onDone, totalSecs, setTotalSecs }) {
  const [idx, setIdx]         = useState(0)
  const [answers, setAnswers] = useState({})
  const [sel, setSel]         = useState(null)
  // Timer managed by parent component (totalSecs prop)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [tabWarning, setTabWarning]   = useState(false)
  const [flagged, setFlagged]         = useState(false)
  const t0Ref = React.useRef(Date.now())

  const answersRef = React.useRef({})

  // Tab switch anti-cheat
  useEffect(() => {
    const handle = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const next = prev + 1
          if (next >= 3) setFlagged(true)
          else setTabWarning(true)
          return next
        })
      }
    }
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [])

  // Auto-submit when global timer hits 0
  useEffect(() => {
    if (totalSecs <= 0) {
      onDone({ ...answersRef.current }, Math.round((Date.now() - t0Ref.current) / 1000), tabSwitches, tabSwitches >= 3)
    }
  }, [totalSecs])

  const q      = questions && questions[idx] ? questions[idx] : null
  const isLast = q && idx === questions.length - 1
  const total  = questions ? questions.length : 0

  if (!q) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center"><span className="sp sp-lg"/></div>
    </div>
  )

  const next = () => {
    if (sel === null) return
    const newAnswers = { ...answers, [q.id]: sel }
    answersRef.current = newAnswers
    setAnswers(newAnswers)
    setSel(null)
    if (isLast) {
      onDone(newAnswers, Math.round((Date.now() - t0Ref.current) / 1000), tabSwitches, flagged)
    } else {
      setIdx(i => i + 1)
    }
  }

  return (
    <div className="shell">
      {tabWarning && !flagged && (
        <div className="overlay" style={{ zIndex:9999 }}>
          <div className="modal" style={{ maxWidth:440, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
            <h2 style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>Tab Switch Detected</h2>
            <p style={{ fontSize:13, color:'var(--ink2)', marginBottom:20, lineHeight:1.7 }}>
              You have left this assessment window. This has been recorded.<br/>
              <strong>{tabSwitches} of 3 warnings used.</strong> A third switch will flag your submission.
            </p>
            <button className="btn btn-p" style={{ justifyContent:'center', width:'100%' }}
              onClick={() => setTabWarning(false)}>Return to Assessment</button>
          </div>
        </div>
      )}
      {flagged && (
        <div className="overlay" style={{ zIndex:9999 }}>
          <div className="modal" style={{ maxWidth:440, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🚩</div>
            <h2 style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>Assessment Flagged</h2>
            <p style={{ fontSize:13, color:'var(--ink2)', marginBottom:20, lineHeight:1.7 }}>
              Your assessment has been flagged due to multiple tab switches. Your recruiter will be notified.
            </p>
            <button className="btn btn-p" style={{ justifyContent:'center', width:'100%' }}
              onClick={() => setFlagged(false)}>Continue Assessment</button>
          </div>
        </div>
      )}
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
        <div style={{ flex:1, margin:'0 24px' }}>
          <div className="pb-wrap">
            <div className="pb-fill" style={{ width: (idx / total * 100) + '%' }}/>
          </div>
          <div style={{ fontSize:11, color:'var(--ink3)', marginTop:3 }}>
            Question {idx + 1} of {total}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:12, color:'var(--ink3)', display:'flex', alignItems:'center', gap:6 }}>
            {DIMENSIONS.find(d=>d.id===q.dimension)?.icon}
            {DIMENSIONS.find(d=>d.id===q.dimension)?.label}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px',
            background: totalSecs < 300 ? 'var(--bad-dim)' : 'var(--paper2)',
            border: '1.5px solid ' + (totalSecs < 300 ? 'var(--bad)' : 'var(--line)'),
            borderRadius: 8, fontSize:13, fontWeight:700,
            color: totalSecs < 300 ? 'var(--bad)' : 'var(--ink2)' }}>
            <span>⏱</span>
            {Math.floor(totalSecs/60)}:{String(totalSecs%60).padStart(2,'0')}
          </div>
        </div>
      </nav>

      <div style={{ display:'flex', justifyContent:'center', padding:'36px 24px' }}>
        <div style={{ width:'100%', maxWidth:620 }}>
          <div className="card card-xl au" style={{ padding:36 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--ink3)', textTransform:'uppercase',
              letterSpacing:'.06em', marginBottom:16 }}>
              Situation {idx + 1}
            </div>
            <p style={{ fontSize:16, fontWeight:600, lineHeight:1.65, marginBottom:28, color:'var(--ink)' }}>
              {q.scenario}
            </p>
            <div style={{ fontSize:12, color:'var(--ink3)', marginBottom:14, fontStyle:'italic' }}>
              Choose the response that best reflects how you would naturally handle this situation.
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setSel(i)}
                  style={{ padding:'14px 18px', border:'1.5px solid '+(sel===i?'var(--accent)':'var(--line)'),
                    borderRadius:10, background:sel===i?'var(--accent-dim)':'var(--paper)',
                    cursor:'pointer', fontFamily:'inherit', fontSize:13, textAlign:'left',
                    lineHeight:1.55, color:'var(--ink)', transition:'all .15s',
                    display:'flex', alignItems:'flex-start', gap:12 }}>
                  <span style={{ width:24, height:24, borderRadius:'50%', flexShrink:0, display:'flex',
                    alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700,
                    background:sel===i?'var(--accent)':'var(--paper2)',
                    color:sel===i?'#fff':'var(--ink3)', marginTop:1 }}>
                    {['A','B','C','D'][i]}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:24 }}>
              <button className="btn btn-p btn-lg" onClick={next} disabled={sel === null}>
                {isLast ? 'Complete Assessment' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ── PDF Download ──────────────────────────────────────────────────────
function downloadLeadershipPDF(candidate, results, role) {
  const { dimScores, fitLabel, leadershipStyle, pct } = results
  const fitEmoji = fitLabel === 'Strong Fit' ? 'Strong Fit' : fitLabel === 'Moderate Fit' ? 'Moderate Fit' : 'Developing'
  const overallNarrative = getOverallNarrative(fitLabel, leadershipStyle, pct)

  const dimRows = DIMENSIONS.map(dim => {
    const ds   = dimScores?.[dim.id] || { score:0, max:0 }
    const dpct = ds.max > 0 ? Math.round(ds.score / ds.max * 100) : 0
    const label = dpct >= 70 ? 'Strength' : dpct >= 45 ? 'Developing Well' : 'Focus Area'
    const narrative = getDimQualitative(dim.id, dpct)
    return '<tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:600;width:200px">' +
      dim.icon + ' ' + dim.label + '</td>' +
      '<td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:' +
      (dpct>=70?'#059669':dpct>=45?'#d97706':'#dc2626') + ';font-weight:700;width:120px">' + label + '</td>' +
      '<td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;line-height:1.6">' + narrative + '</td></tr>'
  }).join('')

  const html = '<html><head><meta charset="UTF-8"><style>' +
    'body{font-family:Arial,sans-serif;margin:40px;color:#111827}' +
    'h1{font-size:22px;font-weight:800;margin:0 0 4px}' +
    '.sub{color:#6b7280;font-size:13px;margin-bottom:24px}' +
    '.banner{background:' + (fitLabel==='Strong Fit'?'#d1fae5':fitLabel==='Moderate Fit'?'#fef3c7':'#fee2e2') + ';' +
    'border:1.5px solid ' + (fitLabel==='Strong Fit'?'#10b981':fitLabel==='Moderate Fit'?'#f59e0b':'#ef4444') + ';' +
    'border-radius:10px;padding:20px 24px;margin-bottom:20px;text-align:center}' +
    '.fit{font-size:20px;font-weight:800;color:' + (fitLabel==='Strong Fit'?'#059669':fitLabel==='Moderate Fit'?'#d97706':'#dc2626') + '}' +
    '.style{font-size:13px;color:#374151;margin-top:6px}' +
    '.narrative{font-size:13px;color:#374151;line-height:1.75;margin-top:12px}' +
    'table{width:100%;border-collapse:collapse;margin-top:20px}' +
    'th{background:#1e1b4b;color:#fff;padding:10px 14px;text-align:left;font-size:13px}' +
    '.footer{margin-top:32px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px}' +
    '</style></head><body>' +
    '<h1>Leadership Assessment Report</h1>' +
    '<div class="sub">' + candidate.name + ' &nbsp;|&nbsp; ' + candidate.email + ' &nbsp;|&nbsp; Role: ' + role.title + ' &nbsp;|&nbsp; ' + new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) + '</div>' +
    '<div class="banner">' +
    '<div class="fit">' + fitEmoji + '</div>' +
    '<div class="style">Leadership Style: <strong>' + leadershipStyle + '</strong></div>' +
    '<div class="narrative">' + overallNarrative + '</div>' +
    '</div>' +
    '<table><thead><tr><th>Dimension</th><th>Assessment</th><th>Narrative</th></tr></thead><tbody>' +
    dimRows + '</tbody></table>' +
    '<div class="footer">Generated by AssessIQ &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; ' + new Date().toLocaleString() + '</div>' +
    '</body></html>'

  const blob = new Blob([html], { type: 'text/html' })
  const url  = URL.createObjectURL(blob)
  const w    = window.open(url, '_blank')
  if (w) setTimeout(() => w.print(), 800)
  URL.revokeObjectURL(url)
}

// ── OPQ Section ──────────────────────────────────────────────────────
function OPQSection({ candidate, responses, setResponses, onDone, totalSecs }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const total = OPQ_STATEMENTS.length
  const current = OPQ_STATEMENTS[currentIdx]
  const progress = Math.round((currentIdx / total) * 100)

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (totalSecs <= 0) onDone()
  }, [totalSecs])

  const labels = [
    { val: 1, label: 'Strongly Disagree' },
    { val: 2, label: 'Disagree' },
    { val: 3, label: 'Neutral' },
    { val: 4, label: 'Agree' },
    { val: 5, label: 'Strongly Agree' },
  ]

  const select = (val) => {
    const newR = { ...responses, [current.id]: val }
    setResponses(newR)
    if (currentIdx < total - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 300)
    }
  }

  const canFinish = OPQ_STATEMENTS.every(s => responses[s.id] !== undefined)
  const dimInfo = OPQ_DIMENSIONS.find(d => d.id === current.dimension)

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
        <div className="nav-r" style={{ fontSize:13, color:'var(--ink3)', gap:16 }}>
          {dimInfo && <span>{dimInfo.icon} {dimInfo.label}</span>}
          <span style={{ fontWeight:700, color:'var(--accent)' }}>{currentIdx + 1}/{total}</span>
          <span style={{ color: totalSecs < 300 ? 'var(--bad)' : 'var(--ink3)', fontWeight: totalSecs < 300 ? 700 : 400 }}>
            ⏱ {Math.floor(totalSecs/60)}:{String(totalSecs%60).padStart(2,'0')}
          </span>
        </div>
      </nav>

      {/* Progress */}
      <div style={{ height:3, background:'var(--line)', position:'fixed', top:56, left:0, right:0, zIndex:10 }}>
        <div style={{ height:'100%', width:progress+'%', background:'var(--accent)', transition:'width .4s ease' }}/>
      </div>

      <div className="page" style={{ maxWidth:640, paddingTop:32 }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--ink3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>
            Personality Assessment — Statement {currentIdx + 1} of {total}
          </div>
          <p style={{ fontSize:12, color:'var(--ink3)', lineHeight:1.6, maxWidth:480, margin:'0 auto' }}>
            Rate how accurately each statement describes you in a professional context. There are no right or wrong answers.
          </p>
        </div>

        {/* Statement Card */}
        <div className="card card-xl" style={{ padding:36, marginBottom:28, textAlign:'center', minHeight:160, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:16, fontWeight:600, lineHeight:1.7, color:'var(--ink)', maxWidth:480 }}>
            {current.statement}
          </div>
        </div>

        {/* Scale */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
          {labels.map(({ val, label }) => {
            const selected = responses[current.id] === val
            const colors = {
              1: { bg:'#fee2e2', border:'#ef4444', text:'#dc2626' },
              2: { bg:'#fff7ed', border:'#f97316', text:'#ea580c' },
              3: { bg:'#f3f4f6', border:'#9ca3af', text:'#6b7280' },
              4: { bg:'#eff6ff', border:'#3b82f6', text:'#2563eb' },
              5: { bg:'#f0fdf4', border:'#22c55e', text:'#16a34a' },
            }
            const c = colors[val]
            return (
              <button key={val} onClick={() => select(val)}
                style={{ padding:'12px 16px', borderRadius:12, border:'2px solid ' + (selected ? c.border : 'var(--line)'),
                  background: selected ? c.bg : 'var(--paper)', color: selected ? c.text : 'var(--ink2)',
                  fontWeight: selected ? 700 : 500, fontSize:12, cursor:'pointer', transition:'all .15s',
                  minWidth:110, textAlign:'center', lineHeight:1.3 }}>
                {label}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32 }}>
          <button className="btn btn-g btn-sm" onClick={() => setCurrentIdx(i => Math.max(0, i-1))}
            disabled={currentIdx === 0} style={{ opacity: currentIdx === 0 ? 0 : 1 }}>
            ← Previous
          </button>
          <div style={{ display:'flex', gap:6 }}>
            {OPQ_STATEMENTS.map((s, i) => (
              <div key={i} onClick={() => setCurrentIdx(i)}
                style={{ width:8, height:8, borderRadius:999, cursor:'pointer', transition:'all .2s',
                  background: responses[s.id] !== undefined ? 'var(--accent)' : i === currentIdx ? 'var(--ink3)' : 'var(--line)' }}/>
            ))}
          </div>
          {currentIdx < total - 1 ? (
            <button className="btn btn-p btn-sm" onClick={() => setCurrentIdx(i => i + 1)}
              disabled={responses[current.id] === undefined}>
              Next →
            </button>
          ) : (
            <button className="btn btn-p btn-sm" onClick={onDone} disabled={!canFinish}
              style={{ opacity: canFinish ? 1 : 0.5 }}>
              Complete Assessment ✓
            </button>
          )}
        </div>

        {!canFinish && currentIdx === total - 1 && (
          <p style={{ textAlign:'center', fontSize:12, color:'var(--warn)', marginTop:12 }}>
            Please respond to all statements before completing.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Results Screen — AI-powered qualitative candidate report ──────────
function LResults({ candidate, results, role }) {
  const [report, setReport] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  // Poll Firebase for candidateReport (generated in background)
  React.useEffect(() => {
    let attempts = 0
    const poll = async () => {
      try {
        const { dbAllCandidates } = await import('../db')
        const all = await dbAllCandidates()
        const c = (all || []).find(x => x.id === candidate.id)
        if (c && c.candidateReport) {
          setReport(c.candidateReport)
          setLoading(false)
          return
        }
      } catch(e) { console.warn('Poll error:', e.message) }
      attempts++
      if (attempts < 30) setTimeout(poll, 2000)
      else { console.warn('AI report timed out after 60s'); setLoading(false) }
    }
    // Start polling after 5 second delay to give AI time to start
    setTimeout(poll, 5000)
  }, [candidate.id])

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
      </nav>
      <div style={{ display:'flex', justifyContent:'center', padding:'36px 24px' }}>
        <div style={{ width:'100%', maxWidth:620 }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Assessment Complete</h2>
            <p style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.6 }}>
              Thank you, <strong>{candidate.name}</strong>. Your personalised leadership profile is below.
            </p>
          </div>

          {loading ? (
            <div className="card card-xl" style={{ padding:40, textAlign:'center' }}>
              <span className="sp sp-lg" style={{ marginBottom:20 }}/>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>Generating your personalised report...</div>
              <p style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.6 }}>
                Our AI is analysing your responses and building your leadership profile. This takes about 20 seconds.
              </p>
            </div>
          ) : report ? (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Headline */}
              <div style={{ background:'var(--accent-dim)', border:'1.5px solid var(--accent-mid)',
                borderRadius:16, padding:'28px 32px', textAlign:'center' }}>
                <div style={{ fontWeight:800, fontSize:22, color:'var(--accent)', marginBottom:16 }}>
                  {report.headline}
                </div>
                <p style={{ fontSize:14, color:'var(--ink2)', lineHeight:1.8, maxWidth:480, margin:'0 auto' }}>
                  {report.opening}
                </p>
              </div>

              {/* Strengths */}
              <div className="card card-xl" style={{ padding:'22px 26px' }}>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--ok)', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                  <span>✦</span> Your Leadership Strengths
                </div>
                <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.8, margin:0 }}>
                  {report.strengths}
                </p>
              </div>

              {/* Personality insight */}
              {report.personalityInsight && (
                <div className="card card-xl" style={{ padding:'22px 26px' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--accent)', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                    <span>🧠</span> Your Leadership Personality
                  </div>
                  <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.8, margin:0 }}>
                    {report.personalityInsight}
                  </p>
                </div>
              )}

              {/* Growth areas */}
              <div className="card card-xl" style={{ padding:'22px 26px' }}>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--warn)', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                  <span>◈</span> Areas for Growth
                </div>
                <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.8, margin:0 }}>
                  {report.growthAreas}
                </p>
              </div>

              {/* Closing */}
              <div style={{ background:'var(--paper2)', borderRadius:12, padding:'18px 24px',
                fontSize:13, color:'var(--ink3)', lineHeight:1.75, textAlign:'center' }}>
                {report.closing}
              </div>
            </div>
          ) : (
            // Fallback if AI failed - show generic confirmation only
            <div className="card card-xl" style={{ padding:32, textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>📋</div>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>Your Assessment Has Been Submitted</div>
              <p style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.7 }}>
                Your responses have been recorded and shared with the recruitment team for <strong>{role.title}</strong>. They will review your profile and be in touch.
              </p>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign:'center', marginTop:20, padding:'18px 24px',
            fontSize:12, color:'var(--ink3)', lineHeight:1.7 }}>
            Your results have been shared with the recruitment team for <strong>{role ? role.title : ''}</strong>.
            They will be in touch if you are selected to proceed.
          </div>
          <div style={{ display:'flex', justifyContent:'center', marginTop:8 }}>
            <button className="btn btn-p btn-lg" style={{ justifyContent:'center' }}
              onClick={() => window.location.href = '/'}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Assessment Page ──────────────────────────────────────────────
export default function LeadershipAssessment() {
  const { payload } = useParams()
  const nav = useNavigate()
  const [stage, setStage]         = useState('welcome')
  const [candidate, setCand]      = useState(null)
  const [questions, setQuestions] = useState(null)
  const [results, setResults]     = useState(null)
  const [checking, setChecking]   = useState(false)
  const [alreadyTaken, setAlreadyTaken] = useState(null)
  const [opqResponses, setOpqResponses] = useState({})
  const [aiSJTLoading, setAiSJTLoading] = useState(false)
  const [totalSecs, setTotalSecs] = useState(1800)
  const timerRef = React.useRef(null)

  let role = null
  try {
    role = JSON.parse(atob(payload))
  } catch(e) {}

  if (!role) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center">
        <div style={{ textAlign:'center', maxWidth:360 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔗</div>
          <h2 style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>Invalid Link</h2>
          <p style={{ color:'var(--ink3)', fontSize:14 }}>This link is not valid. Please contact your recruiter.</p>
          <button className="btn btn-p" style={{ marginTop:20 }} onClick={() => nav('/')}>Go Home</button>
        </div>
      </div>
    </div>
  )

  // Check expiry
  if (aiSJTLoading) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center">
        <div style={{ textAlign:'center', maxWidth:360 }}>
          <span className="sp sp-lg" style={{ marginBottom:20 }}/>
          <h2 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Preparing Your Assessment</h2>
          <p style={{ color:'var(--ink3)', fontSize:13, lineHeight:1.7 }}>
            Generating personalised questions for this role. This takes about 10 seconds.
          </p>
        </div>
      </div>
    </div>
  )

  if (role.expiryDate && new Date(role.expiryDate) < new Date()) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center">
        <div style={{ textAlign:'center', maxWidth:400 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⏰</div>
          <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Assessment Link Expired</h2>
          <p style={{ color:'var(--ink3)', fontSize:14, lineHeight:1.7 }}>
            This leadership assessment link expired on {new Date(role.expiryDate).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}.
            Please contact your recruiter for an updated link.
          </p>
          <button className="btn btn-p" style={{ marginTop:20 }} onClick={() => nav('/')}>Return Home</button>
        </div>
      </div>
    </div>
  )

  const handleBegin = async (form) => {
    setChecking(true)
    try {
      const all = await dbAllCandidates()
      const existing = all.find(c =>
        c.email && form.email &&
        c.email.toLowerCase() === form.email.toLowerCase() &&
        c.roleId === role.id &&
        c.assessmentType === 'leadership' &&
        c.status === 'completed'
      )
      if (existing) { setAlreadyTaken(existing); setChecking(false); return }
    } catch(e) { console.warn('duplicate check failed', e) }
    setChecking(false)
    const tempId = genId('lc')
    const seed   = makeSeed(tempId)
    const candData = { roleId:role.id, roleName:role.title, assessmentType:'leadership',
      name:form.name, email:form.email, phone:form.phone }
    const savedCand = dbAddCandidate(candData)
    setCand(savedCand)

    // Try to get AI-generated role-specific questions (with 25s timeout)
    setAiSJTLoading(true)
    let qs = selectQuestions(15, seed)  // 15 fallback bank questions
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 40000)
      const res = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_leadership_sjt', roleTitle: role.title, department: role.dept || '' }),
        signal: controller.signal
      })
      clearTimeout(timeout)
      if (res.ok) {
        const data = await res.json()
        if (data.questions && data.questions.length >= 10) {
          const rawQs = data.questions.slice(0, 15)
          // Validate each AI question has exactly 4 scoreable options with numeric scores
          const validQs = rawQs.filter(q => {
            if (!q || !q.dimension || !q.scenario) return false
            if (!Array.isArray(q.options) || q.options.length !== 4) return false
            if (!["conflict","delegation","motivation","decision","communication"].includes(q.dimension)) return false
            return q.options.every(o => o && typeof o.text === "string" && typeof o.score === "number" && !isNaN(o.score))
          })
          console.log("AssessIQ: AI raw", rawQs.length, "valid after filter", validQs.length)
          qs = validQs.length >= 10 ? validQs : selectQuestions(15, seed)
        }
      }
    } catch(e) {
      console.warn('AssessIQ: AI SJT generation failed, using question bank:', e.message)
    }
    setAiSJTLoading(false)

    setQuestions(qs)
    setStage('quiz')
    // Start global 30-minute timer covering both SJT and OPQ
    setTotalSecs(1800)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTotalSecs(s => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  const handleDone = (answers, timeTaken, tabSwitches, flagged) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const r = scoreLeadership(answers, questions)
    const toSave = { tabSwitches: tabSwitches||0, flagged: flagged||false,
      status: 'completed',
      completedAt: new Date().toISOString(),
      timeTaken,
      fitLabel: r.fitLabel,
      leadershipStyle: r.leadershipStyle,
      leadershipPct: r.pct,
      leadershipTotal: r.total,
      leadershipMax: r.maxTotal,
      dimScores: r.dimScores,
      answers
    }
    dbSaveCandidate(candidate.id, toSave)
    setResults(r)
    setStage('results')

    // Score OPQ responses and save
    const opqProfile = scoreOPQ(opqResponses)
    dbSaveCandidate(candidate.id, { opqResponses, opqProfile })

    // Run AI analysis in background — generates both candidate and recruiter reports
    fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analyse_leadership',
        candidateData: {
          name: candidate.name,
          answers,
          dimScores: r.dimScores,
          fitLabel: r.fitLabel,
          leadershipStyle: r.leadershipStyle,
          leadershipPct: r.pct,
          questions: questions || [],
          opqProfile,
          role: candidate.roleName
        }
      })
    }).then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.analysis) {
          dbSaveCandidate(candidate.id, {
            aiAnalysis: data.analysis.recruiterReport || data.analysis,
            candidateReport: data.analysis.candidateReport || null
          })
          console.log('AssessIQ: AI reports saved for', candidate.name)
        }
      })
      .catch(e => console.warn('AssessIQ: AI analysis failed (non-critical):', e.message))
  }

  if (stage === 'quiz' && questions) return <LQuiz candidate={candidate} questions={questions} totalSecs={totalSecs} setTotalSecs={setTotalSecs}
    onDone={(answers, elapsed, tabSwitches, flagged) => {
      // Save SJT answers first then move to OPQ
      console.log("AssessIQ: onDone called, answers keys:", Object.keys(answers).length, "questions:", (questions||[]).length)
      const r = scoreLeadership(answers, questions)
      const toSave = { tabSwitches: tabSwitches||0, flagged: flagged||false,
        status: 'opq_pending',
        completedAt: new Date().toISOString(),
        timeTaken: elapsed,
        fitLabel: r.fitLabel,
        leadershipStyle: r.leadershipStyle,
        leadershipPct: r.pct,
        leadershipTotal: r.total,
        leadershipMax: r.maxTotal,
        dimScores: r.dimScores,
        answers
      }
      dbSaveCandidate(candidate.id, toSave)
      setResults({ ...r, answers, elapsed, tabSwitches, flagged })
      setStage('opq')
    }}
  />
  if (stage === 'opq') return <OPQSection
    candidate={candidate}
    responses={opqResponses}
    setResponses={setOpqResponses}
    totalSecs={totalSecs}
    onDone={() => handleDone(results.answers, results.elapsed, results.tabSwitches, results.flagged)}
  />
  if (stage === 'results' && results) return <LResults candidate={candidate} results={results} role={role} />
  if (checking) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center"><span className="sp sp-lg"/></div>
    </div>
  )

  if (alreadyTaken) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center">
        <div style={{ textAlign:'center', maxWidth:400 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Assessment Already Completed</h2>
          <p style={{ color:'var(--ink3)', fontSize:14, lineHeight:1.7, marginBottom:8 }}>
            You have already completed the leadership assessment for <strong>{role.title}</strong>.
          </p>
          <p style={{ color:'var(--ink3)', fontSize:13, lineHeight:1.7 }}>
            Your results have been submitted and are being reviewed by the recruitment team.
            Each candidate may only complete this assessment once.
          </p>
          <button className="btn btn-p" style={{ marginTop:24 }} onClick={() => nav('/')}>Return Home</button>
        </div>
      </div>
    </div>
  )

  return <LWelcome role={role} onBegin={handleBegin} />
}
