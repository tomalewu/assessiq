import React, { useEffect, useRef } from 'react'

// Simple SVG bar chart — no external library needed
function BarChart({ data, color, height = 120, label }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height, paddingBottom: 20, position: 'relative' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: 10, color: 'var(--ink3)', marginBottom: 3, fontWeight: 600 }}>
              {d.value > 0 ? d.value : ''}
            </div>
            <div style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              background: d.highlight ? 'var(--ok)' : color || 'var(--accent)',
              height: Math.max((d.value / max) * (height - 30), d.value > 0 ? 4 : 0) + "px",
              transition: 'height .6s ease',
              opacity: d.value === 0 ? 0.2 : 1,
            }} />
            <div style={{ fontSize: 9, color: 'var(--ink3)', marginTop: 4, textAlign: 'center', lineHeight: 1.2 }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Donut chart
function DonutChart({ value, total, color, label, size = 80 }) {
  const pct = total > 0 ? value / total : 0
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * pct
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper3)" strokeWidth={8} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeLinecap="round" strokeDasharray={dash + " " + circ}
            style={{ transition: 'stroke-dasharray .8s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>{total > 0 ? Math.round(pct * 100) : 0}%</span>
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{value} of {total}</div>
      </div>
    </div>
  )
}

export default function DashboardCharts({ candidates, roles }) {
  const done = candidates.filter(c => c.status === 'completed')

  // Score distribution: buckets 0-4, 5-8, 9-12, 13-16, 17-20
  const scoreBuckets = [
    { label: '0–4',   value: 0 },
    { label: '5–8',   value: 0 },
    { label: '9–12',  value: 0 },
    { label: '13–16', value: 0 },
    { label: '17–20', value: 0, highlight: true },
  ]
  done.forEach(c => {
    const s = c.totalScore || 0
    if (s <= 4)       scoreBuckets[0].value++
    else if (s <= 8)  scoreBuckets[1].value++
    else if (s <= 12) scoreBuckets[2].value++
    else if (s <= 16) scoreBuckets[3].value++
    else              scoreBuckets[4].value++
  })

  // Pass rate per role
  const roleStats = roles.map(r => {
    const rc   = candidates.filter(c => c.roleId === r.id && c.status === 'completed')
    const pass = rc.filter(c => (c.totalScore || 0) >= (r.threshold || 12))
    return { label: r.title.slice(0, 10), value: rc.length > 0 ? Math.round(pass.length / rc.length * 100) : 0 }
  })

  // Completion rate
  const completed = done.length
  const pending   = candidates.filter(c => c.status === 'pending').length
  const total     = candidates.length

  // Avg logic vs numerical
  const avgLogic = done.length ? Math.round(done.reduce((a,c) => a + (c.logicScore||0), 0) / done.length * 10) : 0
  const avgNum   = done.length ? Math.round(done.reduce((a,c) => a + (c.numScore||0), 0)   / done.length * 10) : 0

  if (candidates.length === 0) return null

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.3px', marginBottom: 16 }}>Analytics</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>

        {/* Score Distribution */}
        <div className="card" style={{ padding: 20, gridColumn: 'span 2' }}>
          <BarChart data={scoreBuckets} color="var(--accent)" height={130} label="Score Distribution" />
        </div>

        {/* Completion Rate */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 16 }}>Completion Rate</div>
          <DonutChart value={completed} total={total} color="var(--ok)" label="Completed" size={80} />
          <div style={{ marginTop: 14, display: 'flex', gap: 12 }}>
            <span className="badge bg"><span className="dot"/>{completed} done</span>
            <span className="badge ba"><span className="dot"/>{pending} pending</span>
          </div>
        </div>

        {/* Logic vs Numerical avg */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 16 }}>Avg Scores (out of 10)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Logic', avgLogic, 'var(--accent)'], ['Numerical', avgNum, 'var(--accent2)']].map(([l, v, c]) => (
              <div key={l}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'var(--ink2)' }}>{l}</span>
                  <span style={{ fontWeight: 700, color: c }}>{(v/10).toFixed(1)}</span>
                </div>
                <div style={{ height: 8, background: 'var(--paper3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: v + '%', background: c, borderRadius: 4, transition: 'width .8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pass rate per role */}
        {roleStats.length > 0 && (
          <div className="card" style={{ padding: 20 }}>
            <BarChart data={roleStats} color="var(--ok)" height={120} label="Pass Rate % by Role" />
          </div>
        )}
      </div>
    </div>
  )
}
