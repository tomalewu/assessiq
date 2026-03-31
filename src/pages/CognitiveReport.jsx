import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dbAllCandidates, dbRoles } from '../db'
import { buildProfile, TRAIT_NAMES, TRAIT_COLORS } from '../scoring'

function ScoreRing({ score, total = 20 }) {
  const pct = score / total
  const r = 54, cx = 60, cy = 60
  const circ = 2 * Math.PI * r
  const dash  = pct * circ
  const color = pct >= 0.7 ? 'var(--ok)' : pct >= 0.5 ? 'var(--warn)' : 'var(--bad)'
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--paper3)" strokeWidth="10"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={dash + ' ' + (circ - dash)}
        strokeDashoffset={circ * 0.25} strokeLinecap="round"/>
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill={color}>{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--ink3)">out of {total}</text>
    </svg>
  )
}

export default function CognitiveReport() {
  const { candidateId } = useParams()
  const nav = useNavigate()
  const [candidate, setCand] = useState(null)
  const [role, setRole]      = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dbAllCandidates(), dbRoles()]).then(([cands, roles]) => {
      const c = (cands||[]).find(x => x.id === candidateId)
      if (c) {
        setCand(c)
        setRole((roles||[]).find(r => r.id === c.roleId))
      }
      setLoading(false)
    })
  }, [candidateId])

  if (loading) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center"><span className="sp sp-lg"/></div>
    </div>
  )

  if (!candidate || candidate.status !== 'completed') return (
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

  const threshold = role?.threshold || 12
  const passed    = (candidate.totalScore||0) >= threshold
  const profile   = buildProfile(candidate.totalScore, candidate.logicScore, candidate.numScore, candidate.timeTaken)

  const print = () => window.print()

  return (
    <div className="shell">
      <nav className="nav" style={{ printVisibility:'hidden' }}>
        <div className="logo" onClick={() => nav('/')} style={{ cursor:'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
        </div>
        <div className="nav-r">
          <button className="btn btn-s btn-sm" onClick={() => nav(-1)}>← Back</button>
          <button className="btn btn-p btn-sm" onClick={print}>🖨 Print / Save PDF</button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth:720 }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Cognitive Assessment Report</h1>
            <div style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.8 }}>
              <div><strong>Candidate:</strong> {candidate.name}</div>
              <div><strong>Email:</strong> {candidate.email}</div>
              {candidate.phone && <div><strong>Phone:</strong> {candidate.phone}</div>}
              <div><strong>Role:</strong> {candidate.roleName || role?.title || '—'}</div>
              <div><strong>Date:</strong> {candidate.completedAt ? new Date(candidate.completedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
            </div>
          </div>
          <div style={{ textAlign:'center' }}>
            <ScoreRing score={candidate.totalScore||0}/>
            <div style={{ marginTop:8 }}>
              <span className={'badge '+(passed?'bg':'br')} style={{ fontSize:13 }}>
                <span className="dot"/>{passed ? 'Pass' : 'Fail'}
              </span>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="card card-xl" style={{ padding:24, marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Score Breakdown</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
            {[
              { label:'Total Score', value:candidate.totalScore+'/20', color:'var(--accent)' },
              { label:'Logic', value:candidate.logicScore+'/10', color:'var(--ok)' },
              { label:'Numerical', value:candidate.numScore+'/10', color:'var(--ok)' },
              { label:'Percentile', value:(candidate.percentile||0)+'th', color:'var(--accent)' },
              { label:'Time Taken', value:Math.floor((candidate.timeTaken||0)/60)+'m '+(candidate.timeTaken||0)%60+'s', color:'var(--ink2)' },
              { label:'Pass Mark', value:threshold+'/20', color:'var(--ink2)' },
            ].map(({label,value,color})=>(
              <div key={label} style={{ background:'var(--paper2)', borderRadius:10, padding:'12px 14px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'var(--ink3)', marginBottom:4 }}>{label}</div>
                <div style={{ fontWeight:800, fontSize:16, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive Profile */}
        <div className="card card-xl" style={{ padding:24, marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Cognitive Profile</div>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16, padding:'14px 18px', background:'var(--paper2)', borderRadius:10 }}>
            <div style={{ fontSize:32 }}>{profile.fit.emoji}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:16, color:profile.fit.color }}>{profile.fit.label}</div>
              <div style={{ fontSize:13, color:'var(--ink2)', marginTop:2 }}>{profile.fit.desc}</div>
            </div>
          </div>
          {TRAIT_NAMES.map((trait, i) => {
            const val = profile.traits[i]
            return (
              <div key={trait} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ fontWeight:600 }}>{trait}</span>
                  <span style={{ color:'var(--ink3)' }}>{val}%</span>
                </div>
                <div style={{ height:8, background:'var(--paper3)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:val+'%', background:TRAIT_COLORS[i], borderRadius:4, transition:'width .6s' }}/>
                </div>
              </div>
            )
          })}
        </div>

        {/* Insight */}
        {profile.insight && (
          <div className="card card-xl" style={{ padding:24, marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:10 }}>Recruiter Insight</div>
            <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75 }}>{profile.insight}</p>
          </div>
        )}

        {/* Notes */}
        {candidate.notes && (
          <div className="card card-xl" style={{ padding:24, marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:10 }}>Recruiter Notes</div>
            <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75 }}>{candidate.notes}</p>
          </div>
        )}

        <div style={{ textAlign:'center', fontSize:11, color:'var(--ink3)', marginTop:24, paddingTop:16, borderTop:'1px solid var(--line)' }}>
          AssessIQ Cognitive Assessment &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; Generated: {new Date().toLocaleString()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: '@media print { nav { display: none !important; } .shell { background: white; } .card-xl { box-shadow: none !important; border: 1px solid #e5e7eb !important; } }' }}/>
    </div>
  )
}
