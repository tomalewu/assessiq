import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dbRoleByLink, dbAddCandidate, dbSaveCandidate, dbLoadSettings, dbAllCandidates } from '../db'
import { loadQuestions } from '../questions'
import { buildProfile, TRAIT_NAMES, TRAIT_COLORS } from '../scoring'

// ── Already took test screen ──────────────────────────────────────────
function AlreadyTaken({ candidate, nav }) {
  const profile = buildProfile(candidate.totalScore, candidate.logicScore, candidate.numScore, candidate.timeTaken)
  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
        <div className="nav-r">
          <button className="btn btn-g btn-sm" onClick={() => nav('/')}>Home</button>
        </div>
      </nav>
      <div className="center">
        <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.4px', marginBottom: 8 }}>
            Already Completed
          </h2>
          <p style={{ color: 'var(--ink2)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            You have already completed this assessment for <strong>{candidate.roleName}</strong>.
            Each candidate may only attempt each role once.
          </p>
          <div className="card card-xl" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 16 }}>Your previous result</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-2px', color: profile.fit.color }}>
                  {candidate.totalScore}<span style={{ fontSize: 20, color: 'var(--ink3)', fontWeight: 400 }}>/20</span>
                </div>
                <span className="badge" style={{ background: profile.fit.bg, color: profile.fit.color, marginTop: 8 }}>
                  <span className="dot" />{profile.fit.label}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--paper2)', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>{candidate.logicScore}/10</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>Logic</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--paper2)', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent2)' }}>{candidate.numScore}/10</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>Numerical</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--paper2)', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', fontFamily: 'JetBrains Mono' }}>
                  {profile.percentile}th
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>Percentile</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.6 }}>
            Completed on {new Date(candidate.completedAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <button className="btn btn-s" style={{ marginTop: 20 }} onClick={() => nav('/')}>← Back to Home</button>
        </div>
      </div>
    </div>
  )
}

// ── Welcome / entry form ──────────────────────────────────────────────
function Welcome({ role, onBegin, onAlreadyTaken, onAgeRejected }) {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', dob: '' })
  const [errs, setErrs]   = useState({})
  const [checking, setChecking] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.dob)          e.dob   = 'Required'
    else {
      const age = (Date.now() - new Date(form.dob)) / (365.25 * 24 * 3600 * 1000)
      if (age < 16 || age > 80) e.dob = 'Please enter a valid date of birth'
    }
    setErrs(e)
    if (Object.keys(e).length > 0) return false
    // MTO age gate check
    if (role.isMTO) {
      const ageYears = (Date.now() - new Date(form.dob)) / (365.25 * 24 * 3600 * 1000)
      if (ageYears > (role.ageLimit || 28)) {
        onAgeRejected(ageYears, role.ageLimit || 28)
        return false
      }
    }
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setChecking(true)
    // Check if this email already completed this role
    try {
      const all = await dbAllCandidates()
      const existing = all.find(c =>
        c.email && form.email &&
        c.email.toLowerCase() === form.email.toLowerCase() &&
        c.roleId === role.id &&
        c.status === 'completed'
      )
      if (existing) { onAlreadyTaken(existing); return }
    } catch(e) { console.warn('duplicate check failed', e) }
    setChecking(false)
    const c = dbAddCandidate({ ...form, roleId: role.id, roleName: role.title })
    onBegin(c)
  }

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
      </nav>
      <div className="center">
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }} className="au">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', background: 'var(--accent-dim)', border: '1px solid var(--accent-mid)', borderRadius: 999 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{role.title}</span>
              {role.dept && <span style={{ fontSize: 12, color: 'var(--ink3)' }}>· {role.dept}</span>}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 30 }} className="au">
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.6px', lineHeight: 1.1, marginBottom: 12 }}>
              Cognitive Assessment
            </h1>
            <p style={{ color: 'var(--ink2)', fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
              This test measures your logical and numerical reasoning — a key predictor of on-the-job performance.
            </p>
          </div>

          <div style={{ display: 'flex', background: 'var(--paper2)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 0', marginBottom: 28 }} className="au">
            {[['20', 'Questions'], [role?.difficulty==='easy'||role?.difficulty==='hard'?'15 min':'20 min', 'Time limit'], ['No back', 'Forward only'], ['AI-scored', 'Instant results']].map(([v, l], i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-.3px' }}>{v}</div>
                <div style={{ color: 'var(--ink3)', fontSize: 11, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>

          <div className="card card-xl au" style={{ padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 22, height: 22, background: 'var(--accent)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>1</span>
              Your Details
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {[
                ['name',  'Full Name',         'e.g. Priya Sharma',      'text'],
                ['email', 'Work Email',         'e.g. priya@company.com', 'email'],
                ['phone', 'Phone Number',       'e.g. +91 98765 43210',   'tel'],
              ].map(([k, l, ph, t]) => (
                <div className="fg" key={k}>
                  <label className="fl">{l}</label>
                  <input className="fi" type={t} placeholder={ph} value={form[k]}
                    onChange={e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrs(p => ({ ...p, [k]: '' })) }}
                    style={{ borderColor: errs[k] ? 'var(--bad)' : '' }} />
                  {errs[k] && <span className="ferr">{errs[k]}</span>}
                </div>
              ))}
              {/* Date of Birth */}
              <div className="fg">
                <label className="fl">Date of Birth</label>
                <input className="fi" type="date"
                  max={new Date(Date.now() - 16 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]}
                  value={form.dob}
                  onChange={e => { setForm(p => ({ ...p, dob: e.target.value })); setErrs(p => ({ ...p, dob: '' })) }}
                  style={{ borderColor: errs.dob ? 'var(--bad)' : '' }} />
                {errs.dob && <span className="ferr">{errs.dob}</span>}
              </div>
            </div>
            <button className="btn btn-p btn-xl" style={{ width: '100%', justifyContent: 'center' }} onClick={submit} disabled={checking}>
              {checking
                ? <><span className="sp sp-sm" style={{ borderTopColor: '#fff' }} /> Checking…</>
                : <>Start Assessment <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
              }
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink3)', marginTop: 12, lineHeight: 1.6 }}>
              By starting, you confirm this is your own work. Results are shared with the hiring team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


// ── Practice / Demo Screen ────────────────────────────────────────────
const PRACTICE_LOGIC = {
  grid: [['▲','●','■'],['●','■','▲'],['■','▲','?']],
  options: ['●','▲','■','◆'],
  answer: '●',
  exp: 'Each symbol (▲ ● ■) appears exactly once in each row and column — like a Latin square. The missing symbol is ●.'
}
const PRACTICE_NUM = {
  question: 'A store sells 3 items for $12. How much do 7 items cost at the same rate?',
  options: ['$24','$28','$32','$36'],
  answer: '$28',
  exp: 'Each item costs $12 ÷ 3 = $4. So 7 items cost 7 × $4 = $28.'
}

function Practice({ role, onSkip, onReady }) {
  const [step, setStep]         = useState(0) // 0=intro, 1=logic, 2=num, 3=done
  const [logicSel, setLogicSel] = useState(null)
  const [numSel, setNumSel]     = useState(null)
  const [logicDone, setLogicDone] = useState(false)
  const [numDone, setNumDone]     = useState(false)

  const checkLogic = () => { if (logicSel) setLogicDone(true) }
  const checkNum   = () => { if (numSel)   setNumDone(true) }

  const canStart = step === 1 ? logicDone : step === 2 ? numDone : false

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
        <div className="nav-r">
          <button className="btn btn-s btn-sm" onClick={onSkip}>
            Skip Practice & Start Test →
          </button>
        </div>
      </nav>

      <div style={{ display:'flex', justifyContent:'center', padding:'36px 24px' }}>
        <div style={{ width:'100%', maxWidth:580 }}>

          {/* Progress dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:28 }}>
            {['How it works','Logic example','Numerical example'].map((label, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  background: step === i ? 'var(--accent)' : step > i ? 'var(--ok)' : 'var(--paper3)',
                  color: step >= i ? '#fff' : 'var(--ink3)', fontSize:13, fontWeight:700, transition:'all .3s' }}>
                  {step > i ? '✓' : i + 1}
                </div>
                {i < 2 && <div style={{ width:32, height:2, background: step > i ? 'var(--ok)' : 'var(--paper3)', transition:'all .3s' }}/>}
              </div>
            ))}
          </div>

          {/* Step 0 — How it works */}
          {step === 0 && (
            <div style={{ animation:'up .4s ease' }}>
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🧠</div>
                <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-.4px', marginBottom:8 }}>Practice Round</h2>
                <p style={{ color:'var(--ink2)', fontSize:14, lineHeight:1.7 }}>
                  Before your real test, try 2 sample questions to get familiar with the format. These do not count toward your score.
                </p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
                <div className="card card-xl" style={{ padding:'18px 20px', display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>🔷</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Logical Reasoning</div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.6 }}>
                      You will see a 3x3 grid filled with symbols. Find the pattern and identify which symbol belongs in the empty cell marked <strong>?</strong>
                    </p>
                  </div>
                </div>
                <div className="card card-xl" style={{ padding:'18px 20px', display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>🔢</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Numerical Reasoning</div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.6 }}>
                      You will solve word problems or interpret data tables. Choose the correct answer from 4 options. Show your working mentally — no calculator needed.
                    </p>
                  </div>
                </div>
                <div className="card card-xl" style={{ padding:'14px 20px', background:'var(--accent-dim)', border:'1.5px solid var(--accent-mid)' }}>
                  <div style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7 }}>
                    <strong>⏱ Timer:</strong> Each question has its own countdown ({role?.difficulty==='easy'||role?.difficulty==='hard'?'45 seconds':'60 seconds'} per question). The overall test has a {role?.difficulty==='easy'||role?.difficulty==='hard'?'15':'20'}-minute limit. Work quickly but carefully — unanswered questions count as wrong.
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-s btn-lg" style={{ flex:1, justifyContent:'center' }} onClick={onSkip}>
                  Skip — I know the format
                </button>
                <button className="btn btn-p btn-lg" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(1)}>
                  Try a Practice Question →
                </button>
              </div>
            </div>
          )}

          {/* Step 1 — Logic practice */}
          {step === 1 && (
            <div style={{ animation:'up .4s ease' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                <span className="badge bb">🔷 Practice — Logical Reasoning</span>
                <span style={{ fontSize:12, color:'var(--ink3)' }}>No timer · Does not count</span>
              </div>
              <div className="card card-xl" style={{ padding:28 }}>
                <h2 style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>Which symbol completes the pattern?</h2>
                <p style={{ fontSize:12, color:'var(--ink3)', marginBottom:20, lineHeight:1.6 }}>
                  Study the 3x3 grid and find the symbol that belongs in the <strong>bottom-right cell (?)</strong>.
                </p>
                <div className="agrid" style={{ maxWidth:210, marginBottom:24 }}>
                  {PRACTICE_LOGIC.grid.flatMap((row, ri) => row.map((cell, ci) => (
                    <div key={ri+'-'+ci} className={'acell' + (cell === '?' ? ' qm' : '')}>{cell}</div>
                  )))}
                </div>
                <div className="opts">
                  {PRACTICE_LOGIC.options.map((opt, i) => (
                    <button key={i}
                      className={'opt' + (logicSel === opt ? ' sel' : '') + (logicDone ? (opt === PRACTICE_LOGIC.answer ? ' correct' : logicSel === opt ? ' wrong' : '') : '')}
                      onClick={() => !logicDone && setLogicSel(opt)}
                      disabled={logicDone}
                      style={{ fontFamily:'JetBrains Mono', fontSize:22 }}>
                      <span className="olabel">{['A','B','C','D'][i]}</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {!logicDone && (
                  <div style={{ marginTop:22, display:'flex', justifyContent:'flex-end' }}>
                    <button className="btn btn-p btn-lg" onClick={checkLogic} disabled={!logicSel}>
                      Check Answer
                    </button>
                  </div>
                )}

                {logicDone && (
                  <div style={{ marginTop:20, padding:'16px 18px', borderRadius:10,
                    background: logicSel === PRACTICE_LOGIC.answer ? 'var(--ok-dim)' : 'var(--bad-dim)',
                    border: '1.5px solid ' + (logicSel === PRACTICE_LOGIC.answer ? 'var(--ok)' : 'var(--bad)') }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:6,
                      color: logicSel === PRACTICE_LOGIC.answer ? 'var(--ok)' : 'var(--bad)' }}>
                      {logicSel === PRACTICE_LOGIC.answer ? '✓ Correct!' : '✗ Not quite — the answer is ' + PRACTICE_LOGIC.answer}
                    </div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.6 }}>{PRACTICE_LOGIC.exp}</p>
                  </div>
                )}
              </div>

              {logicDone && (
                <div style={{ display:'flex', gap:10, marginTop:16 }}>
                  <button className="btn btn-s btn-lg" style={{ flex:1, justifyContent:'center' }} onClick={onSkip}>
                    Skip & Start Test
                  </button>
                  <button className="btn btn-p btn-lg" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(2)}>
                    Try Numerical Question →
                  </button>
                </div>
              )}
              {!logicDone && (
                <div style={{ marginTop:14, textAlign:'center' }}>
                  <button className="btn btn-g btn-sm" onClick={onSkip}>Skip practice & start test directly</button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Numerical practice */}
          {step === 2 && (
            <div style={{ animation:'up .4s ease' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                <span className="badge bg">🔢 Practice — Numerical Reasoning</span>
                <span style={{ fontSize:12, color:'var(--ink3)' }}>No timer · Does not count</span>
              </div>
              <div className="card card-xl" style={{ padding:28 }}>
                <h2 style={{ fontSize:15, fontWeight:700, lineHeight:1.55, marginBottom:20 }}>{PRACTICE_NUM.question}</h2>
                <div className="opts">
                  {PRACTICE_NUM.options.map((opt, i) => (
                    <button key={i}
                      className={'opt' + (numSel === opt ? ' sel' : '') + (numDone ? (opt === PRACTICE_NUM.answer ? ' correct' : numSel === opt ? ' wrong' : '') : '')}
                      onClick={() => !numDone && setNumSel(opt)}
                      disabled={numDone}
                      style={{ fontSize:14 }}>
                      <span className="olabel">{['A','B','C','D'][i]}</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {!numDone && (
                  <div style={{ marginTop:22, display:'flex', justifyContent:'flex-end' }}>
                    <button className="btn btn-p btn-lg" onClick={checkNum} disabled={!numSel}>
                      Check Answer
                    </button>
                  </div>
                )}

                {numDone && (
                  <div style={{ marginTop:20, padding:'16px 18px', borderRadius:10,
                    background: numSel === PRACTICE_NUM.answer ? 'var(--ok-dim)' : 'var(--bad-dim)',
                    border: '1.5px solid ' + (numSel === PRACTICE_NUM.answer ? 'var(--ok)' : 'var(--bad)') }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:6,
                      color: numSel === PRACTICE_NUM.answer ? 'var(--ok)' : 'var(--bad)' }}>
                      {numSel === PRACTICE_NUM.answer ? '✓ Correct!' : '✗ Not quite — the answer is ' + PRACTICE_NUM.answer}
                    </div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.6 }}>{PRACTICE_NUM.exp}</p>
                  </div>
                )}
              </div>

              {numDone && (
                <div style={{ marginTop:16 }}>
                  <div style={{ padding:'14px 18px', background:'var(--ok-dim)', border:'1.5px solid var(--ok)', borderRadius:12, marginBottom:14, textAlign:'center' }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'var(--ok)', marginBottom:4 }}>
                      Practice Complete! 🎉
                    </div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7 }}>
                      You now know the format. Your real test has <strong>20 questions</strong> with a <strong>
                      {role?.difficulty === 'easy' || role?.difficulty === 'hard' ? '45 seconds' : '60 seconds'}
                      </strong> timer per question
                      ({role?.difficulty === 'easy' || role?.difficulty === 'hard' ? '15 minutes' : '20 minutes'} total).
                      Work at a steady pace — good luck!
                    </p>
                  </div>
                  <button className="btn btn-p btn-xl" style={{ width:'100%', justifyContent:'center' }} onClick={onReady}>
                    Start Real Assessment →
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
              {!numDone && (
                <div style={{ marginTop:14, textAlign:'center' }}>
                  <button className="btn btn-g btn-sm" onClick={onSkip}>Skip practice & start test directly</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Loading screen ────────────────────────────────────────────────────
function Loader({ onReady, role }) {
  const [step, setStep] = useState(0)
  const msgs = ['Generating logical patterns…', 'Building numerical problems…', 'Randomising your unique set…', 'Almost ready…']
  useEffect(() => {
    const ts = [700, 1500, 2300].map((t, i) => setTimeout(() => setStep(i + 1), t))
    dbLoadSettings().then(settings => {
      loadQuestions({ ...settings, difficulty: role?.difficulty || 'medium' }).then(qs => setTimeout(() => onReady(qs), 2800))
    })
    return () => ts.forEach(clearTimeout)
  }, [])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'var(--paper2)' }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="sp sp-lg" style={{ borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
      </div>
      <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.4px' }}>Preparing Your Assessment</div>
      <div style={{ fontSize: 13, color: 'var(--ink3)', height: 20 }}>{msgs[step]}</div>
      <div style={{ width: 240, height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 2, width: (step / 3 * 100) + '%', transition: 'width .7s ease' }} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--ink3)', maxWidth: 260, textAlign: 'center', lineHeight: 1.7, marginTop: 4 }}>
        AI generates a unique question set for every candidate — no two tests are the same.
      </p>
    </div>
  )
}

// ── Countdown timer ───────────────────────────────────────────────────
function Timer({ secs, onDone }) {
  const [rem, setRem] = useState(secs)
  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(() => {
      setRem(p => { if (p <= 1) { clearInterval(ref.current); onDone(); return 0 } return p - 1 })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])
  const m = String(Math.floor(rem / 60)).padStart(2, '0')
  const s = String(rem % 60).padStart(2, '0')
  return (
    <div className={'timer' + (rem < 120 ? ' hot' : '')}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      {m}:{s}
    </div>
  )
}

// ── Per-question countdown ring ───────────────────────────────────────
function QTimer({ secs, total }) {
  const pct   = secs / total
  const size  = 48
  const r     = (size - 6) / 2
  const circ  = 2 * Math.PI * r
  const dash  = circ * pct
  const color = secs > 20 ? 'var(--ok)' : secs > 10 ? 'var(--warn)' : 'var(--bad)'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper3)" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeLinecap="round" strokeDasharray={dash + ' ' + circ}
          style={{ transition: 'stroke-dasharray .9s linear' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, fontFamily: 'JetBrains Mono', color }}>
        {secs}
      </div>
    </div>
  )
}

// ── Quiz ──────────────────────────────────────────────────────────────
function Quiz({ candidate, questions, onDone, difficulty }) {
  const [idx, setIdx]           = useState(0)
  const [answers, setAnswers]   = useState({})
  const [sel, setSel]           = useState(null)
  const Q_TIME = difficulty === 'easy' ? 45 : difficulty === 'hard' ? 45 : 60
  const [qTime, setQTime]       = useState(Q_TIME)
  const [timedOut, setTimedOut] = useState(false)
  const [tabWarning, setTabWarning] = useState(false)
  const [violations, setViolations] = useState(0)
  const t0        = useRef(Date.now())
  const qTimerRef = useRef(null)
  const q       = questions[idx]
  const isLast  = idx === questions.length - 1

  // Tab switch detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setViolations(v => {
          const newCount = v + 1
          import('../db').then(({ dbSaveCandidate }) => {
            dbSaveCandidate(candidate.id, { tabSwitches: newCount, flagged: newCount >= 3 })
          }).catch(() => {})
          return newCount
        })
        setTabWarning(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [candidate.id])

  useEffect(() => {
    setQTime(Q_TIME)
    setTimedOut(false)
    if (qTimerRef.current) clearInterval(qTimerRef.current)
    qTimerRef.current = setInterval(() => {
      setQTime(t => {
        if (t <= 1) {
          clearInterval(qTimerRef.current)
          setTimedOut(true)
          setTimeout(() => {
            setAnswers(prev => {
              const a = { ...prev, [q.id]: sel || '__timeout__' }
              if (isLast) { finish(a); return a }
              setIdx(i => i + 1)
              setSel(null)
              return a
            })
          }, 800)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(qTimerRef.current)
  }, [idx])

  const next = () => {
    if (!sel && !timedOut) return
    clearInterval(qTimerRef.current)
    const a = { ...answers, [q.id]: sel || '__timeout__' }
    setAnswers(a)
    if (isLast) finish(a)
    else { setIdx(i => i + 1); setSel(null) }
  }

  const finish = (ans) => {
    const elapsed = Math.round((Date.now() - t0.current) / 1000)
    let ls = 0, ns = 0
    questions.forEach(q => {
      if (ans[q.id] === q.answer) { if (q.type === 'logic') ls++; else ns++ }
    })
    const result  = { logicScore: ls, numScore: ns, totalScore: ls + ns, timeTaken: elapsed }
    const profile = buildProfile(ls + ns, ls, ns, elapsed)
    dbSaveCandidate(candidate.id, { ...result, percentile: profile.percentile, status: 'completed', completedAt: new Date().toISOString() })
    onDone(result, profile)
  }

  return (
    <div className="shell">
      {/* Tab switch warning overlay */}
      {tabWarning && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:9999,
          display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'var(--paper)', borderRadius:20, padding:40, maxWidth:440, textAlign:'center', boxShadow:'var(--sh-lg)' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>⚠️</div>
            <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-.4px', marginBottom:10, color:'var(--bad)' }}>
              Tab Switch Detected
            </h2>
            <p style={{ fontSize:14, color:'var(--ink2)', lineHeight:1.7, marginBottom:16 }}>
              You left the assessment window. This action has been <strong>recorded and reported</strong> to the recruitment team.
            </p>
            <div style={{ background:'var(--bad-dim)', border:'1.5px solid var(--bad)', borderRadius:10,
              padding:'12px 16px', marginBottom:24, fontSize:13, color:'var(--bad)', fontWeight:600 }}>
              Warning {violations} of 3 — {violations >= 3 ? 'Your attempt has been flagged.' : (3 - violations) + ' more will flag your attempt.'}
            </div>
            <p style={{ fontSize:12, color:'var(--ink3)', marginBottom:20, lineHeight:1.6 }}>
              Please keep this window active and in focus for the remainder of the assessment. Do not switch tabs, open other applications, or minimize this window.
            </p>
            <button className="btn btn-p btn-lg" style={{ width:'100%', justifyContent:'center' }}
              onClick={() => setTabWarning(false)}>
              I understand — Continue Assessment
            </button>
          </div>
        </div>
      )}

      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
        <div style={{ flex: 1, margin: '0 24px' }}>
          <div className="pb-wrap"><div className="pb-fill" style={{ width: (idx / questions.length * 100) + '%' }} /></div>
          <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 3 }}>{idx}/{questions.length} completed</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {violations > 0 && (
            <div title={'Tab switches: ' + violations} style={{ display:'flex', alignItems:'center', gap:5,
              fontSize:11, color: violations >= 3 ? 'var(--bad)' : 'var(--warn)', fontWeight:600 }}>
              <span>⚠️</span> {violations} switch{violations !== 1 ? 'es' : ''}
            </div>
          )}
          <Timer secs={difficulty === 'easy' || difficulty === 'hard' ? 900 : 1200} onDone={() => finish(answers)} />
        </div>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '36px 24px' }}>
        <div style={{ width: '100%', maxWidth: 620, animation: 'slide .4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span className={'badge ' + (q.type === 'logic' ? 'bb' : 'bg')}>
              {q.type === 'logic' ? '🔷 Logical Reasoning' : '🔢 Numerical Reasoning'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--ink3)' }}>Question {idx + 1} of {questions.length}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              {timedOut && <span className="badge br"><span className="dot" />Time's up</span>}
              {!timedOut && <QTimer secs={qTime} total={Q_TIME} />}
            </div>
          </div>

          <div className="qdots">
            {questions.map((_, i) => <div key={i} className={'qd' + (i < idx ? ' done' : i === idx ? ' now' : '')} />)}
          </div>

          <div className="card card-xl" style={{ padding: 30 }}>
            {timedOut && (
              <div style={{ background: 'var(--bad-dim)', border: '1px solid #fca5a5', borderRadius: 9, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: 'var(--bad)', fontWeight: 600 }}>
                ⏰ Time's up for this question — moving on automatically
              </div>
            )}
            {q.type === 'logic' ? (
              <>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Which symbol completes the pattern?</h2>
                <p style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 20, lineHeight: 1.6 }}>
                  Study the 3×3 grid. Find the symbol that belongs in the <strong>bottom-right cell (?)</strong>.
                </p>
                <div className="agrid" style={{ maxWidth: 210 }}>
                  {q.grid.flatMap((row, ri) => row.map((cell, ci) => (
                    <div key={ri + '-' + ci} className={'acell' + (cell === '?' ? ' qm' : '')}>{cell}</div>
                  )))}
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.55, marginBottom: 14 }}>{q.question}</h2>
                {q.tableHtml && <div style={{ marginBottom: 18, overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: q.tableHtml }} />}
              </>
            )}

            <div className="opts">
              {q.options.map((opt, i) => (
                <button key={i} className={'opt' + (sel === opt ? ' sel' : '')} onClick={() => !timedOut && setSel(opt)} disabled={timedOut}>
                  <span className="olabel">{['A','B','C','D'][i]}</span>
                  <span style={{ fontFamily: q.type === 'logic' ? 'JetBrains Mono' : 'inherit', fontSize: q.type === 'logic' ? 22 : 13 }}>{opt}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 26, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-p btn-lg" onClick={next} disabled={!sel && !timedOut}>
                {isLast ? 'Submit Assessment' : 'Next Question'}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Assessment page ──────────────────────────────────────────────
export default function Assessment() {
  const { linkId } = useParams()
  const nav        = useNavigate()
  const role = (() => {
    try { const d = JSON.parse(atob(linkId)); if (d && d.title) return d } catch {}
    try { return dbRoleByLink(linkId) } catch {}
    return null
  })()

  const [stage,    setStage]   = useState('welcome')
  const [candidate, setCand]  = useState(null)
  const [questions, setQs]    = useState(null)
  const [result,   setResult] = useState(null)
  const [profile,  setProfile]= useState(null)
  const [prevCand, setPrevCand] = useState(null)
  const [ageRejected, setAgeRejected] = useState(null) // {age, limit}

  if (!role) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center">
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Invalid Link</h2>
          <p style={{ color: 'var(--ink3)', fontSize: 14, lineHeight: 1.7 }}>This link is not valid. Please contact your recruiter.</p>
          <button className="btn btn-p" style={{ marginTop: 20 }} onClick={() => nav('/')}>Go Home</button>
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
          <p style={{ color:'var(--ink3)', fontSize:14, lineHeight:1.7, marginBottom:20 }}>
            The assessment link for <strong>{role.title}</strong> expired on {new Date(role.expiryDate).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}.
            Please contact your recruiter for an updated link.
          </p>
          <button className="btn btn-p" style={{ marginTop:8 }} onClick={() => nav('/')}>Return Home</button>
        </div>
      </div>
    </div>
  )

  if (prevCand) return <AlreadyTaken candidate={prevCand} nav={nav} />

  if (ageRejected) return (
    <AgeRejectedScreen role={role} ageRejected={ageRejected} nav={nav} />
  )

  if (stage === 'welcome') return (
    <Welcome
      role={role}
      onBegin={c => { setCand(c); setStage('practice') }}
      onAlreadyTaken={c => setPrevCand(c)}
      onAgeRejected={(age, limit) => setAgeRejected({ age, limit })}
    />
  )
  if (stage === 'practice') return (
    <Practice
      role={role}
      onSkip={() => setStage('loading')}
      onReady={() => setStage('loading')}
    />
  )
  if (stage === 'loading') return <Loader role={role} onReady={qs => { setQs(qs); setStage('quiz') }} />
  if (stage === 'quiz' && questions) return (
    <Quiz candidate={candidate} questions={questions} difficulty={role?.difficulty||'medium'} onDone={(r, p) => { setResult(r); setProfile(p); setStage('done') }} />
  )
  if (stage === 'done' && result) return (
    <CandidateResults candidate={candidate} result={result} profile={profile} nav={nav} role={role} />
  )
  return null
}

// ── Score Ring ────────────────────────────────────────────────────────
function ScoreRing({ score, total, size = 110, color = 'var(--accent)' }) {
  const r = (size - 12) / 2, circ = 2 * Math.PI * r, dash = circ * (score / total)
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper3)" strokeWidth={7} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeLinecap="round" strokeDasharray={dash + ' ' + circ} style={{ transition: 'stroke-dasharray .9s ease' }} />
      </svg>
      <div className="ring-inner"><div className="ring-val">{score}</div><div className="ring-sub">/ {total}</div></div>
    </div>
  )
}

function TraitBar({ name, value, color, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 300 + delay); return () => clearTimeout(t) }, [value, delay])
  const label = value >= 80 ? 'Exceptional' : value >= 65 ? 'Strong' : value >= 50 ? 'Average' : value >= 35 ? 'Below Avg' : 'Developing'
  return (
    <div className="trait-wrap">
      <div className="trait-hdr">
        <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
        </span>
      </div>
      <div className="trait-track"><div className="trait-fill" style={{ width: w + '%', background: color }} /></div>
    </div>
  )
}

// ── PDF download ──────────────────────────────────────────────────────
function downloadPDF(candidate, result, profile) {
  const mins = Math.floor(result.timeTaken / 60)
  const secs = result.timeTaken % 60
  const date = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const dob  = candidate.dob ? new Date(candidate.dob).toLocaleDateString('en-GB') : 'N/A'
  const fitColor = profile.fit.color
    .replace('var(--ok)',     '#00b37e')
    .replace('var(--accent)', '#4f6ef7')
    .replace('var(--warn)',   '#f59e0b')
    .replace('var(--bad)',    '#ef4444')

  const traitRows = Object.entries(profile.traits).map(([k, v]) => {
    const label = v >= 80 ? 'Exceptional' : v >= 65 ? 'Strong' : v >= 50 ? 'Average' : v >= 35 ? 'Below Avg' : 'Developing'
    return '<tr><td>' + (TRAIT_NAMES[k]||k) + '</td><td style="text-align:right;font-weight:700;color:#4f6ef7">' + v + '/100</td><td style="color:#888">' + label + '</td></tr>'
  }).join('')

  const fitIcon = profile.fit.label === 'Strong Fit' ? 'STRONG FIT' : profile.fit.label === 'Good Fit' ? 'GOOD FIT' : profile.fit.label === 'Moderate Fit' ? 'MODERATE FIT' : 'LOW FIT'

  const lines = [
    '<!DOCTYPE html><html><head><meta charset="UTF-8">',
    '<title>AssessIQ Result - ' + candidate.name + '</title>',
    '<style>',
    'body{font-family:Arial,sans-serif;background:#f5f6fa;color:#0a0f1e;padding:32px;margin:0}',
    '.page{max-width:720px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,.08)}',
    '.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e2e5f0}',
    '.logo{font-size:22px;font-weight:800;color:#4f6ef7}',
    '.fit-banner{background:#f0fdf4;border:2px solid ' + fitColor + '33;border-radius:12px;padding:20px 24px;margin-bottom:28px}',
    '.fit-label{font-size:20px;font-weight:800;color:' + fitColor + '}',
    '.fit-desc{font-size:13px;color:#3d4663;margin-top:4px;line-height:1.5}',
    '.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}',
    '.card{background:#f5f6fa;border-radius:12px;padding:20px}',
    '.card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#8891aa;margin-bottom:12px}',
    '.score-big{font-size:42px;font-weight:800;letter-spacing:-2px;color:' + fitColor + '}',
    '.sub-scores{display:flex;gap:12px;margin-top:12px}',
    '.sub-score{flex:1;text-align:center;background:#fff;border-radius:8px;padding:10px}',
    '.sub-score .val{font-size:20px;font-weight:700}',
    '.sub-score .lbl{font-size:11px;color:#8891aa;margin-top:2px}',
    '.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.info-lbl{font-size:11px;color:#8891aa;text-transform:uppercase;letter-spacing:.04em}',
    '.info-val{font-size:14px;font-weight:600;margin-top:2px}',
    'table{width:100%;border-collapse:collapse;font-size:13px}',
    'table th{text-align:left;padding:8px 12px;background:#f5f6fa;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#8891aa}',
    'table td{padding:10px 12px;border-bottom:1px solid #e2e5f0}',
    '.insight{background:#0a0f1e;border-radius:12px;padding:20px 24px;color:rgba(255,255,255,.85);font-size:13px;line-height:1.8;margin-top:20px}',
    '.insight-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.4);margin-bottom:10px}',
    '.footer{margin-top:32px;padding-top:20px;border-top:1px solid #e2e5f0;display:flex;justify-content:space-between;font-size:11px;color:#8891aa}',
    '@media print{body{padding:0;background:#fff}.page{box-shadow:none;border-radius:0}}',
    '</style></head><body><div class="page">',
    '<div class="header"><div class="logo">AssessIQ</div><div style="font-size:13px;color:#8891aa">Generated: ' + date + '</div></div>',
    '<div class="fit-banner">',
    '<div class="fit-label">' + fitIcon + '</div>',
    '<div class="fit-desc">' + profile.fit.desc + '</div>',
    '<div style="margin-top:8px;font-size:13px;color:' + fitColor + ';font-weight:700">Percentile: ' + profile.percentile + 'th</div>',
    '</div>',
    '<div class="grid">',
    '<div class="card"><div class="card-title">Overall Score</div>',
    '<div class="score-big">' + result.totalScore + '<span style="font-size:18px;color:#8891aa;font-weight:400">/20</span></div>',
    '<div class="sub-scores">',
    '<div class="sub-score"><div class="val" style="color:#4f6ef7">' + result.logicScore + '/10</div><div class="lbl">Logic</div></div>',
    '<div class="sub-score"><div class="val" style="color:#7c5cfc">' + result.numScore + '/10</div><div class="lbl">Numerical</div></div>',
    '<div class="sub-score"><div class="val" style="font-family:monospace">' + mins + ':' + String(secs).padStart(2,'0') + '</div><div class="lbl">Time</div></div>',
    '</div></div>',
    '<div class="card"><div class="card-title">Candidate Details</div>',
    '<div class="info-grid">',
    '<div><div class="info-lbl">Name</div><div class="info-val">' + candidate.name + '</div></div>',
    '<div><div class="info-lbl">Email</div><div class="info-val">' + candidate.email + '</div></div>',
    '<div><div class="info-lbl">Phone</div><div class="info-val">' + (candidate.phone || 'N/A') + '</div></div>',
    '<div><div class="info-lbl">Date of Birth</div><div class="info-val">' + dob + '</div></div>',
    '<div><div class="info-lbl">Role</div><div class="info-val">' + candidate.roleName + '</div></div>',
    '<div><div class="info-lbl">Speed</div><div class="info-val">' + profile.speedLabel + ' Completion</div></div>',
    '</div></div></div>',
    '<div class="card" style="margin-bottom:20px"><div class="card-title">Cognitive Trait Profile</div>',
    '<table><tr><th>Trait</th><th style="text-align:right">Score</th><th>Level</th></tr>' + traitRows + '</table>',
    '</div>',
    '<div class="insight"><div class="insight-title">Assessment Insight</div>',
    '<strong style="color:#fff">' + candidate.name + '</strong> ' + profile.insight,
    '</div>',
    '<div class="footer"><span>AssessIQ Cognitive Assessment Platform</span><span>Confidential - For HR use only</span></div>',
    '</div></body></html>'
  ]

  const html = lines.join('')
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 500)
  }
}


// ── Age Rejected Screen ───────────────────────────────────────────────
function AgeRejectedScreen({ role, ageRejected, nav }) {
  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
      </nav>
      <div className="center">
        <div style={{ width:'100%', maxWidth:480, textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:20 }}>🙏</div>
          <h2 style={{ fontSize:24, fontWeight:800, letterSpacing:'-.4px', marginBottom:12 }}>
            Thank You for Your Interest
          </h2>
          <div style={{ background:'var(--warn-dim)', border:'1.5px solid var(--warn)', borderRadius:14, padding:'20px 24px', marginBottom:24 }}>
            <div style={{ fontWeight:700, fontSize:15, color:'var(--warn)', marginBottom:8 }}>Age Criteria Not Met</div>
            <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7 }}>
              We appreciate your interest in the <strong>{role.title}</strong> position.
              Unfortunately, the maximum age requirement for this role is <strong>{role.ageLimit || 28} years</strong>.
              We are unable to proceed with your application at this time.
            </p>
          </div>
          <p style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.7, marginBottom:28 }}>
            We encourage you to explore other opportunities that may be a better fit.
            Thank you for your understanding.
          </p>
          <button className="btn btn-p btn-lg" style={{ justifyContent:'center' }} onClick={() => nav('/')}>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}

// ── CV Upload (MTO only — Firebase Storage) ──────────────────────────
function CVUpload({ candidate, role }) {
  const [file, setFile]           = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [error, setError]         = useState('')

  const submit = async () => {
    if (!file) { setError('Please select your CV file (PDF, DOC, or DOCX)'); return }
    if (file.size > 10 * 1024 * 1024) { setError('File too large. Maximum size is 10MB.'); return }
    setUploading(true)
    setError('')
    setProgress(10)
    try {
      const { initializeApp, getApps, getApp } = await import('firebase/app')
      const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
      setProgress(20)
      const FB_CFG = {
        apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId:             import.meta.env.VITE_FIREBASE_APP_ID,
      }
      const app     = getApps().length ? getApp() : initializeApp(FB_CFG)
      const storage = getStorage(app)
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path    = 'cvs/' + candidate.id + '_' + safeName
      const storageRef = ref(storage, path)

      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, file)
        task.on('state_changed',
          snap => setProgress(20 + Math.round(snap.bytesTransferred / snap.totalBytes * 70)),
          err  => reject(err),
          ()   => resolve()
        )
      })
      setProgress(95)
      const cvUrl = await getDownloadURL(storageRef)
      setProgress(100)

      const { dbSaveCandidate } = await import('../db')
      dbSaveCandidate(candidate.id, {
        cvUrl,
        cvFileName: file.name,
        cvSubmittedAt: new Date().toISOString()
      })
      setSubmitted(true)
    } catch(e) {
      console.error('Upload failed:', e)
      setError('Upload failed: ' + (e.message || 'Please try again.'))
    }
    setUploading(false)
  }

  if (submitted) return (
    <div style={{ background:'var(--ok-dim)', border:'1.5px solid var(--ok)', borderRadius:14, padding:24, textAlign:'center' }}>
      <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
      <div style={{ fontWeight:800, fontSize:17, color:'var(--ok)', marginBottom:8 }}>Application Submitted!</div>
      <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7 }}>
        Your CV has been submitted for the <strong>{role.title}</strong> position.
        Our recruitment team will review your application and contact you at <strong>{candidate.email}</strong> if you are selected for the next stage.
      </p>
    </div>
  )

  return (
    <div className="card card-xl au" style={{ padding:28, animationDelay:'.4s' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <div style={{ width:40, height:40, borderRadius:11, background:'var(--ok-dim)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📎</div>
        <div>
          <div style={{ fontWeight:800, fontSize:16 }}>Upload Your CV</div>
          <div style={{ fontSize:12, color:'var(--ink3)', marginTop:2 }}>You passed! Please upload your CV to complete your application.</div>
        </div>
      </div>

      <div className="fg" style={{ marginBottom:14 }}>
        <label className="fl">CV File (PDF, DOC, DOCX — max 10MB)</label>
        <input type="file" accept=".pdf,.doc,.docx"
          onChange={e => { setFile(e.target.files[0]); setError('') }}
          style={{ padding:'10px 12px', border:'1.5px dashed var(--line)', borderRadius:'var(--r-sm)',
            width:'100%', fontSize:13, cursor:'pointer', background:'var(--paper2)', outline:'none' }}/>
        {file && (
          <div style={{ marginTop:8, fontSize:12, color:'var(--ok)', display:'flex', alignItems:'center', gap:6 }}>
            <span>✓</span> {file.name} ({(file.size/1024).toFixed(0)} KB)
          </div>
        )}
        {error && <span className="ferr">{error}</span>}
      </div>

      {uploading && (
        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--ink3)', marginBottom:6 }}>
            <span>Uploading...</span><span>{progress}%</span>
          </div>
          <div style={{ height:6, background:'var(--paper3)', borderRadius:3, overflow:'hidden' }}>
            <div style={{ height:'100%', width:progress+'%', background:'var(--accent)', borderRadius:3, transition:'width .3s ease' }}/>
          </div>
        </div>
      )}

      <button className="btn btn-p btn-lg" style={{ width:'100%', justifyContent:'center' }}
        onClick={submit} disabled={uploading || !file}>
        {uploading
          ? <><span className="sp sp-sm" style={{ borderTopColor:'#fff' }}/> Uploading {progress}%...</>
          : 'Submit CV & Complete Application'}
      </button>
      <p style={{ textAlign:'center', fontSize:11, color:'var(--ink3)', marginTop:10, lineHeight:1.6 }}>
        Your CV will only be shared with the hiring team for the <strong>{role.title}</strong> position.
      </p>
    </div>
  )
}

// ── Score Ring ────────────────────────────────────────────────────────
function CandidateResults({ candidate, result, profile, nav, role }) {
  const [reveal, setReveal] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReveal(true), 200); return () => clearTimeout(t) }, [])
  const mins = Math.floor(result.timeTaken / 60)
  const secs  = result.timeTaken % 60

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo"><div className="logo-mark">A</div>AssessIQ</div>
        <div className="nav-r">
          <button className="btn btn-s btn-sm" onClick={() => downloadPDF(candidate, result, profile)}>
            📄 Download PDF
          </button>
          <button className="btn btn-g btn-sm" onClick={() => nav('/')}>
            Exit
          </button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 28, animation: 'up .4s ease' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.5px', marginBottom: 6 }}>Assessment Complete</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="badge bb">{candidate.roleName}</span>
            <span style={{ fontSize: 13, color: 'var(--ink2)' }}>
              Thank you, {candidate.name}. Your results have been submitted to the hiring team.
            </span>
          </div>
        </div>

        {/* Fit Banner */}
        <div style={{ background: profile.fit.bg, border: '1.5px solid ' + profile.fit.color + '44', borderRadius: 14, padding: '18px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, animation: 'up .45s ease', flexWrap: 'wrap' }}>
          <div style={{ width: 50, height: 50, borderRadius: 13, background: profile.fit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {profile.fit.label === 'Strong Fit' ? '🌟' : profile.fit.label === 'Good Fit' ? '✅' : profile.fit.label === 'Moderate Fit' ? '🔶' : '🔴'}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: profile.fit.color }}>{profile.fit.label}</div>
            <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6, marginTop: 3 }}>{profile.fit.desc}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 2 }}>Percentile Rank</div>
            <div style={{ fontWeight: 800, fontSize: 26, color: profile.fit.color }}>
              {profile.percentile}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink3)' }}>th</span>
            </div>
          </div>
        </div>

        <div className="g2" style={{ alignItems: 'start', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card card-xl au" style={{ padding: 26, animationDelay: '.1s' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 18 }}>Overall Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <ScoreRing score={result.totalScore} total={20} size={100} color={profile.fit.color} />
                <div style={{ flex: 1 }}>
                  {[['Logic', result.logicScore, 10, 'var(--accent)'], ['Numerical', result.numScore, 10, 'var(--accent2)']].map(([l, s, t, c]) => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--ink2)' }}>{l}</span>
                        <span style={{ fontWeight: 700, color: c }}>{s}/{t}</span>
                      </div>
                      <div className="pb-wrap" style={{ height: 6 }}>
                        <div className="pb-fill" style={{ width: reveal ? (s/t*100) + '%' : '0%', background: c, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card card-xl au" style={{ padding: 26, animationDelay: '.15s' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 4 }}>Percentile Rank</div>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>
                {profile.percentile}<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--ink3)' }}>th</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.6, marginBottom: 14 }}>
                Scored higher than {profile.percentile}% of all candidates.
              </p>
              <div className="gauge-track">
                <div className="gauge-needle" style={{ left: reveal ? profile.percentile + '%' : '50%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink3)', marginTop: 4 }}>
                <span>0th</span><span>25th</span><span>50th</span><span>75th</span><span>100th</span>
              </div>
            </div>

            <div className="card card-xl au" style={{ padding: 26, animationDelay: '.2s' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 4 }}>Completion Speed</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'JetBrains Mono', letterSpacing: '-1px' }}>
                  {mins}:{String(secs).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink3)' }}>of 20:00</div>
              </div>
              <span className={'badge ' + (profile.speedLabel === 'Fast' ? 'bg' : profile.speedLabel === 'Average' ? 'bb' : 'ba')}>
                <span className="dot" />{profile.speedLabel} Completion
              </span>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 10, lineHeight: 1.6 }}>{profile.speedDesc}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card card-xl au" style={{ padding: 26, animationDelay: '.25s' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 20 }}>Cognitive Trait Profile</div>
              {Object.entries(profile.traits).map(([k, v], i) => (
                <TraitBar key={k} name={TRAIT_NAMES[k]} value={v} color={TRAIT_COLORS[k]} delay={i * 100} />
              ))}
            </div>

            <div className="card card-xl au" style={{ padding: 26, animationDelay: '.3s' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 16 }}>Performance Level</div>
              {[{ label: 'Logic', score: result.logicScore, max: 10 }, { label: 'Numerical', score: result.numScore, max: 10 }].map(({ label, score, max }) => {
                const lvl = Math.round((score / max) * 5)
                const lvlLabel = score >= 9 ? 'Exceptional' : score >= 7 ? 'High' : score >= 5 ? 'Medium' : score >= 3 ? 'Low' : 'Very Low'
                return (
                  <div key={label} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                      <span>{label}</span><span style={{ color: 'var(--ink3)', fontWeight: 400 }}>{lvlLabel}</span>
                    </div>
                    <div className="level-bar">
                      {[1,2,3,4,5].map(i => {
                        const filled = i <= lvl
                        const h = 16 + i * 7
                        const col = !filled ? 'var(--paper3)' : i >= 4 ? 'var(--ok)' : i >= 3 ? 'var(--accent)' : 'var(--warn)'
                        return <div key={i} className="level-seg" style={{ height: h, background: reveal ? col : 'var(--paper3)', transition: 'background .6s ease ' + (i * 0.1) + 's' }} />
                      })}
                    </div>
                    <div className="level-labels">
                      <span>Very Low</span><span>Low</span><span>Medium</span><span>High</span><span>Exceptional</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="card card-xl au" style={{ padding: 26, animationDelay: '.35s', background: 'var(--ink)', border: 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>What This Means</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,.85)' }}>
                <strong style={{ color: '#fff' }}>{candidate.name}</strong> {profile.insight}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-s btn-lg" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => downloadPDF(candidate, result, profile)}>
                📄 Download PDF Result
              </button>
              <button className="btn btn-p btn-lg" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => nav('/')}>
                Exit Assessment
              </button>
            </div>
            {/* MTO CV Upload - only if role is MTO and candidate passed */}
            {role && role.isMTO && result.totalScore >= (role.threshold || 12) && (
              <CVUpload candidate={candidate} role={role} result={result} profile={profile} />
            )}
            {/* MTO fail message */}
            {role && role.isMTO && result.totalScore < (role.threshold || 12) && (
              <div style={{ background:'var(--paper2)', border:'1.5px solid var(--line)', borderRadius:14, padding:24, textAlign:'center', marginTop:4 }}>
                <div style={{ fontSize:32, marginBottom:10 }}>📬</div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>Thank You for Completing the Assessment</div>
                <p style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.7 }}>
                  We appreciate you taking the time to complete this assessment for the <strong>{candidate.roleName}</strong> position.
                  Our recruitment team will review all applications and will be in touch if you are selected to move forward.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
