import React, { useState, useEffect } from 'react'
import { TRAIT_NAMES, TRAIT_COLORS } from '../scoring'

function ScoreRing({ score, total, size = 110, color = 'var(--accent)' }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (score / total)
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper3)" strokeWidth={7} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeLinecap="round" strokeDasharray={dash + " " + circ}
          style={{ transition: 'stroke-dasharray .9s ease' }} />
      </svg>
      <div className="ring-inner">
        <div className="ring-val">{score}</div>
        <div className="ring-sub">/ {total}</div>
      </div>
    </div>
  )
}

function TraitBar({ name, value, color, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), 300 + delay)
    return () => clearTimeout(t)
  }, [value, delay])
  const label = value >= 80 ? 'Exceptional' : value >= 65 ? 'Strong' : value >= 50 ? 'Average' : value >= 35 ? 'Below Avg' : 'Developing'
  return (
    <div className="trait-wrap">
      <div className="trait-hdr">
        <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: color }}>{value}</span>
        </span>
      </div>
      <div className="trait-track">
        <div className="trait-fill" style={{ width: w + "%", background: color }} />
      </div>
    </div>
  )
}


// ── PDF Download from Modal ───────────────────────────────────────────
function downloadCognitivePDF(candidate, result, profile) {
  const passed = result.totalScore >= 12
  const traits = ['Logical Reasoning','Numerical Reasoning','Processing Speed','Problem Solving','Analytical Thinking']
  const colors = ['#6366f1','#ef4444','#22c55e','#f59e0b','#8b5cf6']

  const traitRows = profile.traits.map((val, i) => {
    const label = val >= 85 ? 'Exceptional' : val >= 70 ? 'Strong' : val >= 50 ? 'Good' : val >= 30 ? 'Developing' : 'Low'
    const bar = '<div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;margin-top:4px">' +
      '<div style="height:100%;width:' + val + '%;background:' + colors[i] + ';border-radius:4px"></div></div>'
    return '<tr><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;font-weight:600;width:200px">' + traits[i] + '</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:' + colors[i] + ';font-weight:700;width:100px">' + label + ' ' + val + '%</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;width:200px">' + bar + '</td></tr>'
  }).join('')

  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<title>Cognitive Report - ' + candidate.name + '</title>' +
    '<style>body{font-family:Arial,sans-serif;margin:40px;color:#111827;max-width:750px}' +
    'h1{font-size:20px;font-weight:800;margin:0 0 4px;color:#1e1b4b}' +
    '.meta{color:#6b7280;font-size:12px;line-height:1.8;margin-bottom:20px}' +
    '.banner{padding:16px 20px;border-radius:10px;margin-bottom:20px;display:flex;align-items:center;gap:16px;' +
    'background:' + (passed?'#d1fae5':'#fee2e2') + ';border:2px solid ' + (passed?'#10b981':'#ef4444') + '}' +
    '.score{font-size:36px;font-weight:800;color:' + (passed?'#059669':'#dc2626') + '}' +
    '.fit{font-size:16px;font-weight:700;color:' + (passed?'#059669':'#dc2626') + '}' +
    'table{width:100%;border-collapse:collapse}' +
    'th{background:#1e1b4b;color:#fff;padding:8px 12px;text-align:left;font-size:12px}' +
    '.insight{background:#1e1b4b;color:#fff;border-radius:10px;padding:16px 20px;margin-top:20px;font-size:13px;line-height:1.7}' +
    '.footer{margin-top:24px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;text-align:center}' +
    '@media print{body{margin:20px}}</style></head><body>' +
    '<h1>' + candidate.name + ' — Cognitive Assessment Report</h1>' +
    '<div class="meta">' +
    'Email: ' + candidate.email + ' &nbsp;|&nbsp; ' +
    'Role: ' + candidate.roleName + ' &nbsp;|&nbsp; ' +
    'Date: ' + (candidate.completedAt?new Date(candidate.completedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'—') +
    '</div>' +
    '<div class="banner">' +
    '<div><div class="score">' + result.totalScore + '/20</div><div class="fit">' + (passed?'Pass':'Fail') + ' — ' + profile.fit.label + '</div></div>' +
    '<div style="margin-left:auto;text-align:right;font-size:13px;color:#374151">' +
    'Logic: <strong>' + result.logicScore + '/10</strong><br>' +
    'Numerical: <strong>' + result.numScore + '/10</strong><br>' +
    'Percentile: <strong>' + (candidate.percentile||0) + 'th</strong><br>' +
    'Time: <strong>' + Math.floor((result.timeTaken||0)/60) + 'm ' + (result.timeTaken||0)%60 + 's</strong>' +
    '</div></div>' +
    '<table><thead><tr><th>Cognitive Trait</th><th>Level</th><th>Score</th></tr></thead><tbody>' +
    traitRows + '</tbody></table>' +
    (profile.insight ? '<div class="insight"><strong>Recruiter Insight</strong><br><br>' + profile.insight + '</div>' : '') +
    '<div class="footer">AssessIQ Cognitive Assessment &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; ' + new Date().toLocaleString() + '</div>' +
    '</body></html>'

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:800px;height:600px;border:none'
  document.body.appendChild(iframe)
  iframe.contentDocument.open()
  iframe.contentDocument.write(html)
  iframe.contentDocument.close()
  iframe.contentWindow.focus()
  setTimeout(() => {
    iframe.contentWindow.print()
    setTimeout(() => document.body.removeChild(iframe), 3000)
  }, 600)
}

export default function ResultsModal({ candidate, result, profile, onClose, benchmark }) {
  const [reveal, setReveal] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 200)
    return () => clearTimeout(t)
  }, [])

  const mins = Math.floor(result.timeTaken / 60)
  const secs  = result.timeTaken % 60

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--paper)', borderRadius: 20, width: '100%', maxWidth: 860,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--sh-lg)', animation: 'up .3s ease'
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.4px', marginBottom: 6 }}>
              {candidate.name}'s Cognitive Profile
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="badge bb">{candidate.roleName}</span>
              {candidate.completedAt && (
                <span style={{ fontSize: 12, color: 'var(--ink3)' }}>
                  {new Date(candidate.completedAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0, marginLeft:16 }}>
            <button className="btn btn-s btn-sm" onClick={() => downloadCognitivePDF(candidate, result, profile)}>📄 Download PDF</button>
            <button className="btn btn-g btn-sm" onClick={onClose}>✕ Close</button>
          </div>
        </div>

        <div style={{ padding: '20px 32px 32px' }}>
          {/* Fit Banner */}
          <div style={{ background: profile.fit.bg, border: "1.5px solid " + profile.fit.color + "44", borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: profile.fit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {profile.fit.label === 'Strong Fit' ? '🌟' : profile.fit.label === 'Good Fit' ? '✅' : profile.fit.label === 'Moderate Fit' ? '🔶' : '🔴'}
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: profile.fit.color }}>{profile.fit.label}</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6, marginTop: 3 }}>{profile.fit.desc}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 2 }}>Percentile Rank</div>
              <div style={{ fontWeight: 800, fontSize: 24, color: profile.fit.color }}>
                {profile.percentile}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink3)' }}>th</span>
              </div>
            </div>
          </div>

          {/* Benchmark comparison */}
          {benchmark && benchmark.total > 1 && (
            <div style={{ background:'var(--paper2)', border:'1px solid var(--line)', borderRadius:14, padding:'16px 20px', marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--ink3)', marginBottom:14 }}>Benchmark vs Other Candidates for this Role</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12 }}>
                {[
                  { label:'Score Rank', value:'#' + benchmark.scoreRank + ' of ' + benchmark.total, color:'var(--accent)' },
                  { label:'Beats', value:benchmark.beatsPercent + '% of applicants', color:'var(--ok)' },
                  { label:'Role Avg Score', value:benchmark.avgScore + '/20', color:'var(--ink2)' },
                  { label:'Role Pass Rate', value:benchmark.passRate + '%', color:benchmark.passRate >= 50 ? 'var(--ok)' : 'var(--warn)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background:'var(--paper)', borderRadius:10, padding:'12px 14px', textAlign:'center' }}>
                    <div style={{ fontSize:11, color:'var(--ink3)', marginBottom:4 }}>{label}</div>
                    <div style={{ fontWeight:800, fontSize:15, color }}>{value}</div>
                  </div>
                ))}
              </div>
              {/* Score distribution bar */}
              {benchmark.distribution && (
                <div style={{ marginTop:14 }}>
                  <div style={{ fontSize:11, color:'var(--ink3)', marginBottom:6 }}>Score distribution (this role)</div>
                  <div style={{ display:'flex', gap:3, alignItems:'flex-end', height:40 }}>
                    {benchmark.distribution.map((d, i) => (
                      <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                        <div style={{ width:'100%', borderRadius:'2px 2px 0 0',
                          background: i === benchmark.candidateBucket ? 'var(--accent)' : 'var(--paper3)',
                          height: Math.max((d.count / Math.max(...benchmark.distribution.map(x=>x.count), 1)) * 36, d.count > 0 ? 3 : 0) + 'px',
                          transition:'height .6s ease' }}/>
                        <div style={{ fontSize:8, color:'var(--ink3)' }}>{d.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="g2" style={{ alignItems: 'start', gap: 16 }}>
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Score */}
              <div className="card card-xl" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 16 }}>Overall Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <ScoreRing score={result.totalScore} total={20} size={94} color={profile.fit.color} />
                  <div style={{ flex: 1 }}>
                    {[['Logic', result.logicScore, 10, 'var(--accent)'], ['Numerical', result.numScore, 10, 'var(--accent2)']].map(([l, s, t, c]) => (
                      <div key={l} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: 'var(--ink2)' }}>{l}</span>
                          <span style={{ fontWeight: 700, color: c }}>{s}/{t}</span>
                        </div>
                        <div className="pb-wrap" style={{ height: 6 }}>
                          <div className="pb-fill" style={{ width: reveal ? ((s/t)*100) + "%" : '0%', background: c, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Percentile gauge */}
              <div className="card card-xl" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 4 }}>Percentile Rank</div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>
                  {profile.percentile}<span style={{ fontSize: 15, fontWeight: 400, color: 'var(--ink3)' }}>th</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.6, marginBottom: 12 }}>
                  Scored higher than {profile.percentile}% of all candidates.
                </p>
                <div className="gauge-track">
                  <div className="gauge-needle" style={{ left: reveal ? profile.percentile + "%" : '50%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink3)', marginTop: 4 }}>
                  <span>0th</span><span>25th</span><span>50th</span><span>75th</span><span>100th</span>
                </div>
              </div>

              {/* Speed */}
              <div className="card card-xl" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 4 }}>Completion Speed</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'JetBrains Mono', letterSpacing: '-1px' }}>
                    {mins}:{String(secs).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink3)' }}>of 20:00</div>
                </div>
                <span className={"badge " + (profile.speedLabel === 'Fast' ? 'bg' : profile.speedLabel === 'Average' ? 'bb' : 'ba')}>
                  <span className="dot" />{profile.speedLabel} Completion
                </span>
                <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 10, lineHeight: 1.6 }}>{profile.speedDesc}</div>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Trait bars */}
              <div className="card card-xl" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 18 }}>Cognitive Trait Profile</div>
                {Object.entries(profile.traits).map(([k, v], i) => (
                  <TraitBar key={k} name={TRAIT_NAMES[k]} value={v} color={TRAIT_COLORS[k]} delay={i * 100} />
                ))}
              </div>

              {/* Level bars */}
              <div className="card card-xl" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink3)', marginBottom: 14 }}>Performance Level</div>
                {[{ label: 'Logic', score: result.logicScore, max: 10 }, { label: 'Numerical', score: result.numScore, max: 10 }].map(({ label, score, max }) => {
                  const lvl = Math.round((score / max) * 5)
                  const lvlLabel = score >= 9 ? 'Exceptional' : score >= 7 ? 'High' : score >= 5 ? 'Medium' : score >= 3 ? 'Low' : 'Very Low'
                  return (
                    <div key={label} style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                        <span>{label}</span>
                        <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>{lvlLabel}</span>
                      </div>
                      <div className="level-bar">
                        {[1,2,3,4,5].map(i => {
                          const filled = i <= lvl
                          const h = 16 + i * 7
                          const col = !filled ? 'var(--paper3)' : i >= 4 ? 'var(--ok)' : i >= 3 ? 'var(--accent)' : 'var(--warn)'
                          return <div key={i} className="level-seg" style={{ height: h, background: reveal ? col : 'var(--paper3)', transition: "background .6s ease " + (i * 0.1) + "s" }} />
                        })}
                      </div>
                      <div className="level-labels">
                        <span>Very Low</span><span>Low</span><span>Medium</span><span>High</span><span>Exceptional</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Insight */}
              <div className="card card-xl" style={{ padding: 22, background: 'var(--ink)', border: 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>Recruiter Insight</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,.85)' }}>
                  <strong style={{ color: '#fff' }}>{candidate.name}</strong> {profile.insight}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
