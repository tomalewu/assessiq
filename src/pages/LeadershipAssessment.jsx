import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SJT_QUESTIONS, DIMENSIONS, scoreLeadership, getDimQualitative, getOverallNarrative, selectQuestions } from '../leadership'
import { dbAddCandidate, dbSaveCandidate, dbAllCandidates, dbLoadSettings } from '../db'

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

          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
            {[
              { icon:'📋', label:'20 situational questions', sub:'Real workplace scenarios' },
              { icon:'⏱', label:'30-minute time limit', sub:'90 seconds per question — reflect carefully' },
              { icon:'🎯', label:'Qualitative results', sub:'Personalised leadership profile' },
              { icon:'🔒', label:'No right or wrong answers', sub:'We assess your natural approach' },
            ].map((item, i) => (
              <div key={i} className="card card-xl" style={{ padding:'14px 18px', display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{item.label}</div>
                  <div style={{ fontSize:12, color:'var(--ink3)' }}>{item.sub}</div>
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
            This assessment has a 30-minute time limit. Find a quiet place and ensure you will not be interrupted.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── SJT Quiz ─────────────────────────────────────────────────────────
function LQuiz({ candidate, questions, onDone }) {
  const [idx, setIdx]         = useState(0)
  const [answers, setAnswers] = useState({})
  const [sel, setSel]         = useState(null)
  const [secs, setSecs]       = useState(1800) // 30 minutes
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

  // Hard 30-minute timer
  useEffect(() => {
    const tick = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(tick)
          onDone({ ...answersRef.current }, Math.round((Date.now() - t0Ref.current) / 1000), tabSwitches, tabSwitches >= 3)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const q      = questions[idx]
  const isLast = idx === questions.length - 1
  const total  = questions.length

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
            background: secs < 300 ? 'var(--bad-dim)' : 'var(--paper2)',
            border: '1.5px solid ' + (secs < 300 ? 'var(--bad)' : 'var(--line)'),
            borderRadius: 8, fontSize:13, fontWeight:700,
            color: secs < 300 ? 'var(--bad)' : 'var(--ink2)' }}>
            <span>⏱</span>
            {Math.floor(secs/60)}:{String(secs%60).padStart(2,'0')}
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

// ── Results Screen ────────────────────────────────────────────────────
function LResults({ candidate, results, role }) {
  const { dimScores, fitLabel, fitColor, leadershipStyle, pct } = results
  const overallNarrative = getOverallNarrative(fitLabel, leadershipStyle, pct)

  const fitEmoji = fitLabel === 'Strong Fit' ? '🌟' : fitLabel === 'Moderate Fit' ? '✨' : '🌱'
  const fitBg    = fitLabel === 'Strong Fit' ? 'var(--ok-dim)' : fitLabel === 'Moderate Fit' ? '#fffbeb' : 'var(--bad-dim)'
  const fitBorder = fitLabel === 'Strong Fit' ? 'var(--ok)' : fitLabel === 'Moderate Fit' ? '#f59e0b' : 'var(--bad)'

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
      </nav>
      <div style={{ display:'flex', justifyContent:'center', padding:'36px 24px' }}>
        <div style={{ width:'100%', maxWidth:620 }}>

          {/* Fit banner */}
          <div style={{ background:fitBg, border:'1.5px solid '+fitBorder, borderRadius:16,
            padding:'28px 32px', marginBottom:24, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>{fitEmoji}</div>
            <div style={{ fontWeight:800, fontSize:22, color:fitColor, marginBottom:8 }}>
              {fitLabel}
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--ink2)', marginBottom:16 }}>
              Leadership Style: <span style={{ color:'var(--accent)' }}>{leadershipStyle}</span>
            </div>
            <p style={{ fontSize:14, color:'var(--ink2)', lineHeight:1.75, maxWidth:480, margin:'0 auto' }}>
              {overallNarrative}
            </p>
          </div>

          {/* Dimension narratives */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Your Leadership Profile</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {DIMENSIONS.map(dim => {
                const ds  = dimScores[dim.id]
                const dpct = ds.max > 0 ? Math.round(ds.score / ds.max * 100) : 0
                const label = dpct >= 70 ? 'Strength' : dpct >= 45 ? 'Developing Well' : 'Focus Area'
                const lcolor = dpct >= 70 ? 'var(--ok)' : dpct >= 45 ? 'var(--warn)' : 'var(--bad)'
                const narrative = getDimQualitative(dim.id, dpct)
                return (
                  <div key={dim.id} className="card card-xl" style={{ padding:'20px 24px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <span style={{ fontSize:20 }}>{dim.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:14 }}>{dim.label}</div>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:lcolor,
                        background:lcolor+'22', padding:'3px 10px', borderRadius:999 }}>
                        {label}
                      </span>
                    </div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7, margin:0 }}>
                      {narrative}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{ background:'var(--paper2)', borderRadius:12, padding:'18px 24px', textAlign:'center', fontSize:13, color:'var(--ink3)', lineHeight:1.7, marginBottom:16 }}>
            Thank you for completing this assessment, <strong>{candidate.name}</strong>.
            Your results have been shared with the recruitment team for <strong>{role.title}</strong>.
            They will be in touch if you are selected to proceed.
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn btn-s btn-lg" style={{ justifyContent:'center' }}
              onClick={() => downloadLeadershipPDF(candidate, results, role)}>
              📄 Download PDF Report
            </button>
            <button className="btn btn-p btn-lg" style={{ justifyContent:'center' }}
              onClick={() => window.location.href = '/'}>
              Exit Assessment
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
    const qs     = selectQuestions(20, seed)
    const candData = { roleId:role.id, roleName:role.title, assessmentType:'leadership',
      name:form.name, email:form.email, phone:form.phone }
    const savedCand = dbAddCandidate(candData)
    setCand(savedCand)
    setQuestions(qs)
    setStage('quiz')
  }

  const handleDone = (answers, timeTaken, tabSwitches, flagged) => {
    const r = scoreLeadership(answers)
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
  }

  if (stage === 'quiz' && questions) return <LQuiz candidate={candidate} questions={questions} onDone={handleDone} />
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
