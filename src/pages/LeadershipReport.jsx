import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dbAllCandidates } from '../db'
import { DIMENSIONS, getDimQualitative, getOverallNarrative } from '../leadership'
import { OPQ_DIMENSIONS } from '../opq'

export default function LeadershipReport() {
  const { candidateId } = useParams()
  const nav = useNavigate()
  const [candidate, setCand] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dbAllCandidates().then(cands => {
      const c = (cands||[]).find(x => x.id === candidateId)
      setCand(c || null)
      setLoading(false)
    })
  }, [candidateId])

  if (loading) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center"><span className="sp sp-lg"/></div>
    </div>
  )

  if (!candidate || candidate.status !== 'completed' || candidate.assessmentType !== 'leadership') return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center">
        <div style={{ textAlign:'center', maxWidth:360 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <h2 style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>Report Not Found</h2>
          <p style={{ color:'var(--ink3)', fontSize:14 }}>This report link is invalid or the assessment has not been completed.</p>
          <button className="btn btn-p" style={{ marginTop:20 }} onClick={() => nav('/')}>Go Home</button>
        </div>
      </div>
    </div>
  )

  const { dimScores, fitLabel, leadershipStyle, leadershipPct: pct, leadershipTotal, leadershipMax } = candidate
  const fitColor  = fitLabel==='Strong Fit'?'var(--ok)':fitLabel==='Moderate Fit'?'var(--warn)':'var(--bad)'
  const fitBg     = fitLabel==='Strong Fit'?'var(--ok-dim)':fitLabel==='Moderate Fit'?'#fffbeb':'var(--bad-dim)'
  const fitBorder = fitLabel==='Strong Fit'?'var(--ok)':fitLabel==='Moderate Fit'?'#f59e0b':'var(--bad)'
  const fitEmoji  = fitLabel==='Strong Fit'?'🌟':fitLabel==='Moderate Fit'?'✨':'🌱'
  const overall   = getOverallNarrative(fitLabel, leadershipStyle, pct)

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={() => nav('/')} style={{ cursor:'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
        </div>
        <div className="nav-r">
          <button className="btn btn-s btn-sm" onClick={() => nav(-1)}>← Back</button>
          <button className="btn btn-p btn-sm" onClick={() => window.print()}>🖨 Print / Save PDF</button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth:720 }}>
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Leadership Assessment Report</h1>
          <div style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.8 }}>
            <div><strong>Candidate:</strong> {candidate.name}</div>
            <div><strong>Email:</strong> {candidate.email}</div>
            {candidate.phone && <div><strong>Phone:</strong> {candidate.phone}</div>}
            <div><strong>Role:</strong> {candidate.roleName}</div>
            <div><strong>Date:</strong> {candidate.completedAt ? new Date(candidate.completedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
            <div><strong>Time Taken:</strong> {candidate.timeTaken ? Math.floor(candidate.timeTaken/60)+'m '+candidate.timeTaken%60+'s' : '—'}</div>
          </div>
        </div>

        {/* Fit Banner */}
        <div style={{ background:fitBg, border:'1.5px solid '+fitBorder, borderRadius:14,
          padding:'24px 28px', marginBottom:24, textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:10 }}>{fitEmoji}</div>
          <div style={{ fontWeight:800, fontSize:22, color:fitColor, marginBottom:6 }}>{fitLabel}</div>
          <div style={{ fontSize:13, color:'var(--ink2)', marginBottom:4 }}>
            Leadership Style: <strong style={{ color:'var(--accent)' }}>{leadershipStyle}</strong>
          </div>
          <div style={{ fontSize:12, color:'var(--ink3)', marginBottom:14 }}>
            Overall Score: {leadershipTotal}/{leadershipMax} ({pct}%)
          </div>
          <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75, maxWidth:520, margin:'0 auto' }}>{overall}</p>
        </div>

        {/* Dimension Breakdown */}
        <div className="card card-xl" style={{ padding:24, marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Dimension Breakdown</div>
          {DIMENSIONS.map(dim => {
            const ds   = dimScores?.[dim.id] || { score:0, max:0 }
            const dpct = ds.max > 0 ? Math.round(ds.score/ds.max*100) : 0
            const label  = dpct >= 70 ? 'Strength' : dpct >= 45 ? 'Developing Well' : 'Focus Area'
            const lcolor = dpct >= 70 ? 'var(--ok)' : dpct >= 45 ? 'var(--warn)' : 'var(--bad)'
            const narrative = getDimQualitative(dim.id, dpct)
            return (
              <div key={dim.id} style={{ marginBottom:18, paddingBottom:18, borderBottom:'1px solid var(--line)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:18 }}>{dim.icon}</span>
                  <span style={{ fontWeight:700, fontSize:14, flex:1 }}>{dim.label}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:lcolor,
                    background:lcolor+'22', padding:'3px 10px', borderRadius:999 }}>{label}</span>
                  <span style={{ fontSize:12, color:'var(--ink3)', marginLeft:8 }}>{ds.score}/{ds.max} ({dpct}%)</span>
                </div>
                <div style={{ height:6, background:'var(--paper3)', borderRadius:3, marginBottom:8, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:dpct+'%', background:lcolor, borderRadius:3 }}/>
                </div>
                <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7, margin:0 }}>{narrative}</p>
              </div>
            )
          })}
        </div>

        {/* Notes */}
        {candidate.notes && (
          <div className="card card-xl" style={{ padding:24, marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:10 }}>Recruiter Notes</div>
            <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75 }}>{candidate.notes}</p>
          </div>
        )}

        {/* OPQ Personality Profile */}
        {candidate.opqProfile && (
          <div className="card card-xl" style={{ padding:24, marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Personality Profile</div>
            <div style={{ fontSize:12, color:'var(--ink3)', marginBottom:20 }}>Based on occupational personality assessment</div>
            {OPQ_DIMENSIONS.map(dim => {
              const score = candidate.opqProfile[dim.id]
              if (!score) return null
              const color = score.pct >= 75 ? 'var(--ok)' : score.pct >= 60 ? 'var(--accent)' : score.pct >= 40 ? 'var(--warn)' : 'var(--bad)'
              return (
                <div key={dim.id} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:16 }}>{dim.icon}</span>
                      <span style={{ fontWeight:600, fontSize:13 }}>{dim.label}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:11, fontWeight:700, color, background:color+'22', padding:'2px 8px', borderRadius:999 }}>{score.label}</span>
                      <span style={{ fontSize:11, color:'var(--ink3)' }}>{score.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height:6, background:'var(--paper3)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:score.pct+'%', background:color, borderRadius:3 }}/>
                  </div>
                  <div style={{ fontSize:11, color:'var(--ink3)', marginTop:3 }}>{dim.desc}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* AI Analysis Section */}
        {candidate.aiAnalysis && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ fontWeight:800, fontSize:17, paddingTop:8, display:'flex', alignItems:'center', gap:10 }}>
              AI-Powered Assessment
              <span style={{ fontSize:11, fontWeight:500, color:'var(--ink3)', background:'var(--accent-dim)', color:'var(--accent)', padding:'3px 10px', borderRadius:999 }}>Claude AI</span>
            </div>

            <div className="card card-xl" style={{ padding:24 }}>
              <div style={{ fontWeight:700, fontSize:12, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Executive Summary</div>
              <p style={{ fontSize:14, lineHeight:1.85, color:'var(--ink2)', margin:0 }}>{candidate.aiAnalysis.executiveSummary}</p>
            </div>

            <div className="card card-xl" style={{ padding:24 }}>
              <div style={{ fontWeight:700, fontSize:12, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Leadership Profile</div>
              <p style={{ fontSize:13, lineHeight:1.85, color:'var(--ink2)', margin:0, whiteSpace:'pre-line' }}>{candidate.aiAnalysis.leadershipProfile}</p>
            </div>

            {candidate.aiAnalysis.dimensionInsights && (
              <div className="card card-xl" style={{ padding:24 }}>
                <div style={{ fontWeight:700, fontSize:12, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:16 }}>Dimension Analysis</div>
                {[
                  { id:'conflict',      label:'Conflict Resolution',     icon:'🤝' },
                  { id:'delegation',    label:'Delegation & Empowerment', icon:'📋' },
                  { id:'motivation',    label:'Team Motivation',          icon:'🔥' },
                  { id:'decision',      label:'Decision Making',          icon:'⚡' },
                  { id:'communication', label:'Communication',            icon:'💬' },
                ].map(dim => candidate.aiAnalysis.dimensionInsights[dim.id] && (
                  <div key={dim.id} style={{ marginBottom:16, paddingBottom:16, borderBottom:'1px solid var(--line)' }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:6 }}>{dim.icon} {dim.label}</div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75, margin:0 }}>{candidate.aiAnalysis.dimensionInsights[dim.id]}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {candidate.aiAnalysis.keyStrengths && (
                <div className="card card-xl" style={{ padding:24 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:'var(--ok)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Key Strengths</div>
                  {candidate.aiAnalysis.keyStrengths.map((s, i) => (
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:13 }}>
                      <span style={{ color:'var(--ok)', flexShrink:0 }}>✓</span>
                      <span style={{ color:'var(--ink2)', lineHeight:1.6 }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {candidate.aiAnalysis.developmentAreas && (
                <div className="card card-xl" style={{ padding:24 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:'var(--warn)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Development Areas</div>
                  {candidate.aiAnalysis.developmentAreas.map((d, i) => (
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:13 }}>
                      <span style={{ color:'var(--warn)', flexShrink:0 }}>△</span>
                      <span style={{ color:'var(--ink2)', lineHeight:1.6 }}>{d}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {candidate.aiAnalysis.leadershipRisks && (
              <div className="card card-xl" style={{ padding:24, background:'var(--bad-dim)', border:'1px solid #fca5a544' }}>
                <div style={{ fontWeight:700, fontSize:12, color:'var(--bad)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Leadership Risk Indicators</div>
                <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75, margin:0 }}>{candidate.aiAnalysis.leadershipRisks}</p>
              </div>
            )}

            {candidate.aiAnalysis.recruiterRecommendation && (
              <div className="card card-xl" style={{ padding:24, background:'var(--ink)', border:'none' }}>
                <div style={{ fontWeight:700, fontSize:12, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Recruiter Recommendation</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,.92)', lineHeight:1.85, margin:0, fontStyle:'italic' }}>{candidate.aiAnalysis.recruiterRecommendation}</p>
              </div>
            )}

            {candidate.aiAnalysis.interviewQuestions && (
              <div className="card card-xl" style={{ padding:24 }}>
                <div style={{ fontWeight:700, fontSize:12, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:16 }}>Suggested Interview Questions</div>
                {candidate.aiAnalysis.interviewQuestions.map((q, i) => (
                  <div key={i} style={{ display:'flex', gap:12, marginBottom:16, paddingBottom:16,
                    borderBottom: i < candidate.aiAnalysis.interviewQuestions.length-1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ width:26, height:26, borderRadius:999, background:'var(--accent-dim)',
                      color:'var(--accent)', fontWeight:800, fontSize:12, display:'flex', alignItems:'center',
                      justifyContent:'center', flexShrink:0 }}>{i+1}</div>
                    <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75, margin:0 }}>{q}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!candidate.aiAnalysis && candidate.status === 'completed' && (
          <div className="card card-xl" style={{ padding:32, textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>AI Analysis Pending</div>
            <div style={{ fontSize:12, color:'var(--ink3)' }}>The personalised AI analysis is being generated. Refresh this page in a few seconds.</div>
          </div>
        )}

        <div style={{ textAlign:'center', fontSize:11, color:'var(--ink3)', marginTop:24, paddingTop:16, borderTop:'1px solid var(--line)' }}>
          AssessIQ Leadership Assessment &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; Generated: {new Date().toLocaleString()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: '@media print { nav { display: none !important; } .shell { background: white; } .card-xl { box-shadow: none !important; border: 1px solid #e5e7eb !important; } }'}}/>
    </div>
  )
}
