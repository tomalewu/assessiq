import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, setCurrentUser, isAdmin, canEdit } from '../App'
import { dbRoles, dbAllCandidates, dbAddRole, dbUpdateRole, dbDeleteRole, dbDeleteCandidate, dbSaveCandidate } from '../db'
import { DIMENSIONS, getDimQualitative, getOverallNarrative } from '../leadership'
import { OPQ_DIMENSIONS } from '../opq'

// ── Generate HTML Report (for PDF print + Excel link) ────────────────
function generateReportHTML(candidate) {
  const { dimScores, fitLabel, leadershipStyle, leadershipPct: pct } = candidate
  if (!dimScores) return ''
  const overallNarrative = getOverallNarrative(fitLabel, leadershipStyle, pct)
  const fitColor = fitLabel==='Strong Fit'?'#059669':fitLabel==='Moderate Fit'?'#d97706':'#dc2626'
  const fitBg    = fitLabel==='Strong Fit'?'#d1fae5':fitLabel==='Moderate Fit'?'#fef3c7':'#fee2e2'
  const fitBorder= fitLabel==='Strong Fit'?'#10b981':fitLabel==='Moderate Fit'?'#f59e0b':'#ef4444'

  const dimRows = DIMENSIONS.map(dim => {
    const ds   = dimScores[dim.id] || { score:0, max:0 }
    const dpct = ds.max > 0 ? Math.round(ds.score / ds.max * 100) : 0
    const label = dpct >= 70 ? 'Strength' : dpct >= 45 ? 'Developing Well' : 'Focus Area'
    const lcolor = dpct >= 70 ? '#059669' : dpct >= 45 ? '#d97706' : '#dc2626'
    const narrative = getDimQualitative(dim.id, dpct)
    return '<tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:700;width:190px">' +
      dim.icon + ' ' + dim.label + '</td>' +
      '<td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:' + lcolor + ';font-weight:700;width:130px">' + label +
      ' (' + dpct + '%)</td>' +
      '<td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;line-height:1.6">' + narrative + '</td>' +
      '<td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;width:80px;text-align:center">' +
      ds.score + '/' + ds.max + '</td></tr>'
  }).join('')

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Leadership Report — ' + candidate.name + '</title><style>' +
    'body{font-family:Arial,sans-serif;margin:40px;color:#111827;max-width:900px}' +
    'h1{font-size:22px;font-weight:800;margin:0 0 4px;color:#1e1b4b}' +
    '.meta{color:#6b7280;font-size:13px;margin-bottom:24px;line-height:1.8}' +
    '.banner{background:' + fitBg + ';border:2px solid ' + fitBorder + ';border-radius:10px;padding:20px 24px;margin-bottom:24px}' +
    '.fit-label{font-size:20px;font-weight:800;color:' + fitColor + ';margin-bottom:6px}' +
    '.fit-style{font-size:13px;color:#374151;margin-bottom:10px}' +
    '.fit-narrative{font-size:13px;color:#374151;line-height:1.75}' +
    'table{width:100%;border-collapse:collapse;margin-top:4px}' +
    'th{background:#1e1b4b;color:#fff;padding:10px 14px;text-align:left;font-size:12px}' +
    '.section-title{font-size:16px;font-weight:800;margin:24px 0 12px;color:#1e1b4b}' +
    '.footer{margin-top:32px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;text-align:center}' +
    '@media print{body{margin:20px}.footer{position:fixed;bottom:0;width:100%}}' +
    '</style></head><body>' +
    '<h1>Leadership Assessment Report</h1>' +
    '<div class="meta">' +
    '<strong>Candidate:</strong> ' + candidate.name + '<br>' +
    '<strong>Email:</strong> ' + candidate.email + '<br>' +
    '<strong>Role:</strong> ' + candidate.roleName + '<br>' +
    '<strong>Date:</strong> ' + (candidate.completedAt ? new Date(candidate.completedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '—') + '<br>' +
    '<strong>Time Taken:</strong> ' + (candidate.timeTaken ? Math.floor(candidate.timeTaken/60)+'m '+candidate.timeTaken%60+'s' : '—') +
    '</div>' +
    '<div class="banner">' +
    '<div class="fit-label">' + fitLabel + '</div>' +
    '<div class="fit-style">Leadership Style: <strong>' + leadershipStyle + '</strong> &nbsp;|&nbsp; Overall Score: ' + candidate.leadershipTotal + '/' + candidate.leadershipMax + ' (' + pct + '%)</div>' +
    '<div class="fit-narrative">' + overallNarrative + '</div>' +
    '</div>' +
    '<div class="section-title">Dimension Breakdown</div>' +
    '<table><thead><tr><th>Dimension</th><th>Assessment</th><th>Narrative</th><th>Score</th></tr></thead>' +
    '<tbody>' + dimRows + '</tbody></table>' +
    '<div class="footer">AssessIQ Leadership Assessment &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; Generated: ' + new Date().toLocaleString() + '</div>' +
    '</body></html>'
}

function openReport(candidate) {
  const html = generateReportHTML(candidate)
  if (!html) return
  const blob = new Blob([html], { type: 'text/html' })
  const url  = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

// ── Excel Export ──────────────────────────────────────────────────────
function exportLeadershipExcel(candidates, roleName) {
  const headers = ['Name','Email','Phone','Role','Fit','Style','Overall %','Score','Report URL',
    ...DIMENSIONS.map(d => d.label),
    'Date','Time (min)','Notes','Report']

  const rows = candidates.filter(c => c.status === 'completed').map(c => {
    const dimPcts = DIMENSIONS.map(dim => {
      const ds = c.dimScores?.[dim.id] || { score:0, max:0 }
      return ds.max > 0 ? Math.round(ds.score/ds.max*100)+'%' : '—'
    })
    return [
      c.name, c.email, c.phone||'', c.roleName||roleName||'',
      c.fitLabel||'', c.leadershipStyle||'',
      c.leadershipPct!=null?c.leadershipPct+'%':'',
      c.leadershipTotal!=null?c.leadershipTotal+'/'+c.leadershipMax:'',
      ...dimPcts,
      c.completedAt?new Date(c.completedAt).toLocaleDateString('en-GB'):'',
      c.timeTaken?Math.floor(c.timeTaken/60)+'.'+Math.round((c.timeTaken%60/60)*10):'',
      c.notes||'',
      window.location.origin+'/report/leadership/'+c.id
    ]
  })

  // Build Excel HTML with report hyperlinks
  const fitBg = (fit) => fit==='Strong Fit'?'#d1fae5':fit==='Moderate Fit'?'#fef3c7':fit==='Developing'?'#fee2e2':'#fff'

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">'
  html += '<head><meta charset="UTF-8"><style>'
  html += 'table{border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px}'
  html += 'th{background:#1e1b4b;color:#fff;padding:8px 12px;border:1px solid #ccc;text-align:left}'
  html += 'td{padding:7px 12px;border:1px solid #ddd}'
  html += '.report-link{color:#4f46e5;font-weight:700}'
  html += '</style></head><body><table>'
  html += '<tr>' + headers.map(h => '<th>' + h + '</th>').join('') + '</tr>'

  candidates.filter(c => c.status === 'completed').forEach((c, i) => {
    const reportHTML = generateReportHTML(c)
    const reportBlob = reportHTML ? 'data:text/html;charset=utf-8,' + encodeURIComponent(reportHTML) : ''
    const fit = c.fitLabel || ''
    const row = rows[i]
    html += '<tr style="background:' + fitBg(fit) + '">'
    row.forEach((val, vi) => {
      if (vi === row.length - 1) {
        const rUrl = window.location.origin + '/report/leadership/' + c.id
        html += '<td><a href="' + rUrl + '" target="_blank" class="report-link">📄 View Report</a></td>'
      } else {
        html += '<td>' + String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</td>'
      }
    })
    html += '</tr>'
  })
  html += '</table></body></html>'

  const blob = new Blob([html], { type:'application/vnd.ms-excel;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'leadership_results.xls'; a.click()
  URL.revokeObjectURL(url)
}

// ── Bulk PDF Leadership Modal ────────────────────────────────────────
function BulkPDFLeadershipModal({ candidates, roleName, origin, onClose }) {
  const completed = candidates.filter(c => c.status === 'completed')
  const fitEmoji = (f) => f==='Strong Fit'?'🌟':f==='Moderate Fit'?'✨':'🌱'

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{ maxWidth:500 }}>
        <h3>Bulk PDF Export — Leadership</h3>
        <div className="msub">{completed.length} completed candidate{completed.length!==1?'s':''} will be included.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, margin:'16px 0' }}>
          {completed.map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              background:'var(--paper2)', borderRadius:9, fontSize:13 }}>
              <span style={{ fontWeight:600, flex:1 }}>{c.name}</span>
              <span style={{ fontSize:11 }}>{fitEmoji(c.fitLabel)} {c.fitLabel}</span>
              <a href={origin+'/report/leadership/'+c.id} target="_blank" rel="noreferrer"
                style={{ fontSize:11, color:'var(--accent)', fontWeight:600, textDecoration:'none' }}>
                📄 Open
              </a>
            </div>
          ))}
          {completed.length === 0 && (
            <div style={{ textAlign:'center', padding:'20px', color:'var(--ink3)' }}>No completed candidates.</div>
          )}
        </div>
        <div style={{ padding:'12px 14px', background:'var(--accent-dim)', border:'1px solid var(--accent-mid)',
          borderRadius:9, fontSize:12, color:'var(--ink2)', lineHeight:1.7, marginBottom:16 }}>
          <strong>How to save as PDF:</strong> Click <strong>📄 Open</strong> → report opens in new tab → <strong>Ctrl+P</strong> → Save as PDF.
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-s" style={{ flex:1, justifyContent:'center' }} onClick={onClose}>Close</button>
          {completed.length > 0 && (
            <button className="btn btn-p" style={{ flex:1, justifyContent:'center' }}
              onClick={() => completed.forEach((c,i) => setTimeout(() => window.open(origin+'/report/leadership/'+c.id,'_blank'), i*500))}>
              Open All Reports
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ConnectionDot({ online }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--ink3)' }}>
      <div style={{ width:7, height:7, borderRadius:'50%',
        background: online ? 'var(--ok)' : 'var(--warn)',
        boxShadow: online ? '0 0 6px var(--ok)' : '0 0 6px var(--warn)' }}/>
      {online ? 'Live' : 'Offline'}
    </div>
  )
}

function LeadershipProfileModal({ candidate, onClose }) {
  const { dimScores, fitLabel, fitColor, leadershipStyle, leadershipPct: pct } = candidate
  const fitEmoji = fitLabel === 'Strong Fit' ? '🌟' : fitLabel === 'Moderate Fit' ? '✨' : '🌱'

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{ maxWidth:580, maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <h3 style={{ margin:0 }}>{candidate.name}</h3>
            <div style={{ fontSize:12, color:'var(--ink3)', marginTop:2 }}>{candidate.email} · {candidate.roleName}</div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button className="btn btn-s btn-sm" style={{ fontSize:11 }}
            onClick={()=>window.open(window.location.origin+'/report/leadership/'+candidate.id,'_blank')}>📄 View Report</button>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'var(--ink3)' }}>✕</button>
        </div>
        </div>

        {/* Fit banner */}
        <div style={{ background: fitLabel==='Strong Fit'?'var(--ok-dim)':fitLabel==='Moderate Fit'?'#fffbeb':'var(--bad-dim)',
          border:'1.5px solid '+(fitLabel==='Strong Fit'?'var(--ok)':fitLabel==='Moderate Fit'?'#f59e0b':'var(--bad)'),
          borderRadius:12, padding:'18px 20px', marginBottom:20, textAlign:'center' }}>
          <div style={{ fontSize:32, marginBottom:6 }}>{fitEmoji}</div>
          <div style={{ fontWeight:800, fontSize:18, color:fitColor, marginBottom:4 }}>{fitLabel}</div>
          <div style={{ fontSize:13, color:'var(--ink2)' }}>Leadership Style: <strong style={{ color:'var(--accent)' }}>{leadershipStyle}</strong></div>
          <div style={{ fontSize:12, color:'var(--ink3)', marginTop:4 }}>Overall Score: {candidate.leadershipTotal}/{candidate.leadershipMax} ({pct}%)</div>
        </div>

        {/* Overall narrative */}
        <div style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75, marginBottom:20, padding:'14px 16px',
          background:'var(--paper2)', borderRadius:10 }}>
          {getOverallNarrative(fitLabel, leadershipStyle, pct)}
        </div>

        {/* Dimension breakdown — full scores visible to recruiter */}
        <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Dimension Breakdown</div>
        {DIMENSIONS.map(dim => {
          const ds   = dimScores?.[dim.id] || { score:0, max:0 }
          const dpct = ds.max > 0 ? Math.round(ds.score / ds.max * 100) : 0
          const label = dpct >= 70 ? 'Strength' : dpct >= 45 ? 'Developing Well' : 'Focus Area'
          const lcolor = dpct >= 70 ? 'var(--ok)' : dpct >= 45 ? 'var(--warn)' : 'var(--bad)'
          return (
            <div key={dim.id} style={{ marginBottom:14, padding:'14px 16px', background:'var(--paper2)', borderRadius:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:16 }}>{dim.icon}</span>
                <span style={{ fontWeight:600, fontSize:13, flex:1 }}>{dim.label}</span>
                <span style={{ fontSize:11, fontWeight:700, color:lcolor }}>{label}</span>
                <span style={{ fontSize:12, color:'var(--ink3)', marginLeft:8 }}>{ds.score}/{ds.max} ({dpct}%)</span>
              </div>
              <div style={{ height:6, background:'var(--paper3)', borderRadius:3, marginBottom:8, overflow:'hidden' }}>
                <div style={{ height:'100%', width:dpct+'%', background:lcolor, borderRadius:3, transition:'width .6s ease' }}/>
              </div>
              <p style={{ fontSize:12, color:'var(--ink2)', lineHeight:1.65, margin:0 }}>
                {getDimQualitative(dim.id, dpct)}
              </p>
            </div>
          )
        })}

        <div style={{ marginTop:4, fontSize:11, color:'var(--ink3)', textAlign:'center' }}>
          Time taken: {candidate.timeTaken ? Math.floor(candidate.timeTaken/60)+'m '+candidate.timeTaken%60+'s' : '—'}
        </div>

        {/* OPQ Personality Profile in Modal */}
        {candidate.opqProfile && (
          <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid var(--line)' }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:14 }}>Personality Profile</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {OPQ_DIMENSIONS.map(dim => {
                const score = candidate.opqProfile[dim.id]
                if (!score) return null
                const color = score.pct >= 75 ? 'var(--ok)' : score.pct >= 60 ? 'var(--accent)' : score.pct >= 40 ? 'var(--warn)' : 'var(--bad)'
                return (
                  <div key={dim.id} style={{ padding:'8px 12px', background:'var(--paper2)', borderRadius:9 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ fontSize:12, fontWeight:600 }}>{dim.icon} {dim.label}</span>
                      <span style={{ fontSize:10, fontWeight:700, color }}>{score.label}</span>
                    </div>
                    <div style={{ height:4, background:'var(--paper3)', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:score.pct+'%', background:color, borderRadius:2 }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* AI Analysis Preview */}
        {candidate.aiAnalysis && (
          <div style={{ marginTop:20, borderTop:'1px solid var(--line)', paddingTop:20 }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
              AI Assessment
              <span style={{ fontSize:10, fontWeight:600, background:'var(--accent-dim)', color:'var(--accent)', padding:'2px 8px', borderRadius:999 }}>Claude AI</span>
            </div>
            {candidate.aiAnalysis.executiveSummary && (
              <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.75, marginBottom:14 }}>{candidate.aiAnalysis.executiveSummary}</p>
            )}
            {candidate.aiAnalysis.recruiterRecommendation && (
              <div style={{ background:'var(--ink)', borderRadius:10, padding:'14px 16px', marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>Recruiter Recommendation</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.9)', lineHeight:1.75, margin:0, fontStyle:'italic' }}>{candidate.aiAnalysis.recruiterRecommendation}</p>
              </div>
            )}
            {candidate.aiAnalysis.interviewQuestions && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--ink3)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:10 }}>Suggested Interview Questions</div>
                {candidate.aiAnalysis.interviewQuestions.map((q, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:12 }}>
                    <span style={{ color:'var(--accent)', fontWeight:800, flexShrink:0 }}>{i+1}.</span>
                    <span style={{ color:'var(--ink2)', lineHeight:1.65 }}>{q}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign:'center', marginTop:12 }}>
              <a href={window.location.origin+'/report/leadership/'+candidate.id} target="_blank" rel="noreferrer"
                style={{ fontSize:12, color:'var(--accent)', fontWeight:600 }}>
                View full AI report →
              </a>
            </div>
          </div>
        )}
        {!candidate.aiAnalysis && candidate.status === 'completed' && (
          <div style={{ marginTop:16, padding:'12px 16px', background:'var(--paper2)', borderRadius:10, fontSize:12, color:'var(--ink3)', textAlign:'center' }}>
            ⏳ AI analysis generating — refresh in a few seconds
          </div>
        )}
      </div>
    </div>
  )
}

function LRoleCard({ role, candidates, onLink, onDelete, onArchive, onManageExpiry, onViewResult, onNote, onDeleteCand, userIsAdmin, userCanEdit, me }) {
  const [expanded, setExpanded] = useState(false)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const PER_PAGE = 20

  const rc     = candidates.filter(c => c.roleId === role.id && c.assessmentType === 'leadership')
  const done   = rc.filter(c => c.status === 'completed')
  const strong = done.filter(c => c.fitLabel === 'Strong Fit')
  const mod    = done.filter(c => c.fitLabel === 'Moderate Fit')
  const dev    = done.filter(c => c.fitLabel === 'Developing')

  let filtered = rc
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = rc.filter(c => (c.name||'').toLowerCase().includes(q) || (c.email||'').toLowerCase().includes(q))
  }
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})

  const fitBadge = (label) => {
    if (label === 'Strong Fit')   return <span style={{ fontSize:11, background:'var(--ok-dim)', color:'var(--ok)', padding:'2px 8px', borderRadius:999, fontWeight:700 }}>🌟 Strong Fit</span>
    if (label === 'Moderate Fit') return <span style={{ fontSize:11, background:'#fffbeb', color:'#92400e', padding:'2px 8px', borderRadius:999, fontWeight:700 }}>✨ Moderate Fit</span>
    if (label === 'Developing')   return <span style={{ fontSize:11, background:'var(--bad-dim)', color:'var(--bad)', padding:'2px 8px', borderRadius:999, fontWeight:700 }}>🌱 Developing</span>
    return <span style={{ fontSize:11, background:'var(--paper2)', color:'var(--ink3)', padding:'2px 8px', borderRadius:999 }}>Pending</span>
  }

  return (
    <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:12 }}>
      <div style={{ padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}
        onClick={() => { setExpanded(v=>!v); setPage(1) }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{role.title}</div>
            <span style={{ fontSize:10, background:'#ede9fe', color:'#5b21b6', padding:'2px 7px', borderRadius:999, fontWeight:700 }}>Leadership</span>
            {role.dept && <span style={{ fontSize:12, color:'var(--ink3)' }}>{role.dept}</span>}
          </div>
          <div style={{ display:'flex', gap:12, fontSize:12, color:'var(--ink3)', flexWrap:'wrap' }}>
            <span><strong style={{ color:'var(--ink)' }}>{rc.length}</strong> assessed</span>
            {done.length > 0 && <>
              <span style={{ color:'var(--ok)', fontWeight:600 }}>🌟 {strong.length} Strong</span>
              <span style={{ color:'#92400e', fontWeight:600 }}>✨ {mod.length} Moderate</span>
              <span style={{ color:'var(--bad)', fontWeight:600 }}>🌱 {dev.length} Developing</span>
            </>}
          </div>
          {rc.length > 0 && (
            <div style={{ display:'flex', gap:2, marginTop:8, height:6, borderRadius:3, overflow:'hidden', background:'var(--paper3)' }}>
              {strong.length > 0 && <div style={{ flex:strong.length, background:'var(--ok)' }}/>}
              {mod.length > 0    && <div style={{ flex:mod.length,    background:'#f59e0b' }}/>}
              {dev.length > 0    && <div style={{ flex:dev.length,    background:'var(--bad)' }}/>}
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
          <button className="btn btn-s btn-sm" style={{ fontSize:11 }}
            onClick={e=>{e.stopPropagation();onLink(role)}}>🔗 Link</button>
          {userCanEdit && (userIsAdmin || role.createdBy===me?.id) && <>
            <button className="btn btn-g btn-sm" style={{ fontSize:11, padding:'5px 8px', color:'var(--warn)' }}
              title={role.archived?'Unarchive':'Archive'}
              onClick={e=>{e.stopPropagation();onArchive(role)}}>
              {role.archived?'📤':'🗄'}
            </button>
            <button className="btn btn-g btn-sm" style={{ fontSize:11, padding:'5px 8px', color:'var(--ok)' }}
              title="Manage expiry"
              onClick={e=>{e.stopPropagation();onManageExpiry(role)}}>
              ⏰
            </button>
            {userIsAdmin && <button className="btn btn-g btn-sm" style={{ fontSize:11, padding:'5px 8px', color:'var(--bad)' }}
              onClick={e=>{e.stopPropagation();onDelete(role)}}>🗑</button>}
          </>}
          <div style={{ fontSize:18, color:'var(--ink3)', transition:'transform .2s', transform:expanded?'rotate(180deg)':'rotate(0deg)' }}>▾</div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop:'1px solid var(--line)', background:'var(--paper2)' }}>
          <div style={{ padding:'12px 20px', display:'flex', gap:8, flexWrap:'wrap', borderBottom:'1px solid var(--line)' }}>
            <input placeholder="Search name or email..." value={search}
              onChange={e=>{setSearch(e.target.value);setPage(1)}}
              style={{ flex:1, minWidth:160, padding:'7px 12px', border:'1.5px solid var(--line)', borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:12, outline:'none', background:'var(--paper)' }}/>
          </div>

          {paginated.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px', color:'var(--ink3)', fontSize:13 }}>
              {search ? 'No candidates match your search.' : 'No candidates yet.'}
            </div>
          ) : (
            <div className="tw" style={{ margin:0, borderRadius:0, border:'none' }}>
              <table>
                <thead><tr><th>#</th><th>Candidate</th><th>Fit</th><th>Style</th><th>Score</th><th>Date</th><th></th></tr></thead>
                <tbody>
                  {paginated.map((c, i) => (
                    <tr key={c.id} style={{ cursor:c.status==='completed'?'pointer':'default' }}
                      onClick={()=>c.status==='completed'&&onViewResult(c)}>
                      <td style={{ color:'var(--ink3)', fontSize:12 }}>{(page-1)*PER_PAGE+i+1}</td>
                      <td>
                        <div style={{ fontWeight:600 }}>{c.name}</div>
                        <div style={{ fontSize:11, color:'var(--ink3)' }}>{c.email}</div>
                        {c.notes && <div style={{ fontSize:11, color:'var(--accent)', marginTop:1 }}>📝 {c.notes.slice(0,30)}{c.notes.length>30?'…':''}</div>}
                      </td>
                      <td>{fitBadge(c.fitLabel)}</td>
                      <td style={{ fontSize:12, color:'var(--accent)', fontWeight:600 }}>{c.leadershipStyle||'—'}</td>
                      <td style={{ fontSize:12 }}>{c.leadershipPct!=null?c.leadershipPct+'%':'—'}</td>
                      <td style={{ fontSize:11, color:'var(--ink3)' }}>{fmtDate(c.completedAt)}</td>
                      <td onClick={e=>e.stopPropagation()}>
                        <div style={{ display:'flex', gap:4 }}>
                          {c.status==='completed' && <button className="btn btn-g btn-sm" style={{ fontSize:11, padding:'3px 7px', color:'var(--accent)' }}
                            title="View full report"
                            onClick={()=>window.open(window.location.origin+'/report/leadership/'+c.id,'_blank')}>📄</button>}
                          {userCanEdit && <button className="btn btn-g btn-sm" style={{ fontSize:11, padding:'3px 7px' }}
                            onClick={()=>onNote(c)}>📝</button>}
                          {userCanEdit && userIsAdmin && <button className="btn btn-g btn-sm" style={{ fontSize:11, padding:'3px 7px', color:'var(--bad)' }}
                            onClick={()=>onDeleteCand(c)}>🗑</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid var(--line)', flexWrap:'wrap', gap:8 }}>
            <div style={{ display:'flex', gap:6 }}>
              <button className="btn btn-s btn-sm" style={{ fontSize:11, background:'#f0fdf4', border:'1px solid #86efac', color:'#166534' }}
                onClick={()=>exportLeadershipExcel(rc, role.title)}>📊 Excel</button>
              <button className="btn btn-s btn-sm" style={{ fontSize:11, background:'#ede9fe', border:'1px solid #c4b5fd', color:'#5b21b6' }}
                onClick={()=>setBulkPDFModal({candidates:rc, roleName:role.title})}>📄 Bulk PDF</button>
            </div>
            {totalPages > 1 && (
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:12, color:'var(--ink3)' }}>
                  Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}
                </span>
                <button className="btn btn-g btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
                <button className="btn btn-g btn-sm" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function LeadershipDashboard() {
  const nav         = useNavigate()
  const me          = getCurrentUser()
  const userIsAdmin = isAdmin()
  const userCanEdit = me?.role === 'admin' || me?.role === 'recruiter' || me?.isSuper
  const userIsViewer = me?.role === 'viewer'
  const logout      = () => { setCurrentUser(null); nav('/') }

  const [roles, setRoles]                 = useState([])
  const [allCandidates, setAllCandidates] = useState([])
  const [loading, setLoading]             = useState(true)
  const [online, setOnline]               = useState(true)
  const [newRoleModal, setNewRoleModal]   = useState(false)
  const [linkModal, setLinkModal]         = useState(null)
  const [copied, setCopied]               = useState(false)
  const [viewModal, setViewModal]         = useState(null)
  const [noteModal, setNoteModal]         = useState(null)
  const [noteText, setNoteText]           = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [expiryModal, setExpiryModal]     = useState(null)
  const [bulkPDFModal, setBulkPDFModal]   = useState(null)
  const [expiryInput, setExpiryInput]     = useState('')
  const [showArchived, setShowArchived]   = useState(false)
  const [globalSearch, setGlobalSearch]   = useState('')
  const [form, setForm]                   = useState({ title:'', dept:'', expiryDate:'' })

  const refresh = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([dbRoles(), dbAllCandidates()])
      // Filter only leadership roles
      const lRoles = (r||[]).filter(role => role.assessmentType === 'leadership')
      const lCands = (c||[]).filter(cand => cand.assessmentType === 'leadership')
      setRoles(lRoles); setAllCandidates(lCands)
      setOnline(true)
    } catch(e) { setOnline(false) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { refresh(); const t=setInterval(refresh,5000); return()=>clearInterval(t) },[refresh])

  const totalDone   = allCandidates.filter(c=>c.status==='completed')
  const strongCount = totalDone.filter(c=>c.fitLabel==='Strong Fit').length
  const modCount    = totalDone.filter(c=>c.fitLabel==='Moderate Fit').length

  const makeRole = () => {
    if (!form.title.trim()) return
    dbAddRole({
      title: form.title, dept: form.dept, assessmentType: 'leadership',
      createdBy: me?.id||'admin', createdByName: me?.name||'Admin',
      archived: false, expiryDate: form.expiryDate || ''
    })
    setForm({ title:'', dept:'', expiryDate:'' })
    setNewRoleModal(false); refresh()
  }

  const getLink = r => {
    const payload = btoa(JSON.stringify({ id:r.id, title:r.title, dept:r.dept||'', assessmentType:'leadership', expiryDate:r.expiryDate||'' }))
    return window.location.origin + '/leadership/' + payload
  }

  const copyLink = r => {
    navigator.clipboard.writeText(getLink(r)).catch(()=>{})
    setCopied(true); setTimeout(()=>setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    if (deleteConfirm.type==='role') dbDeleteRole(deleteConfirm.id)
    else dbDeleteCandidate(deleteConfirm.id)
    setDeleteConfirm(null); await refresh()
  }

  const saveNote = () => {
    if (!noteModal) return
    dbSaveCandidate(noteModal.id, { notes:noteText }); setNoteModal(null); refresh()
  }

  const globalResults = globalSearch.trim() ? allCandidates.filter(c => {
    const q = globalSearch.toLowerCase()
    return (c.name||'').toLowerCase().includes(q) || (c.email||'').toLowerCase().includes(q)
  }) : []

  const activeRoles = roles.filter(r => showArchived ? r.archived : !r.archived)

  if (loading) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center"><span className="sp sp-lg"/></div>
    </div>
  )

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={()=>nav('/admin')} style={{ cursor:'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
          <span style={{ fontSize:11, color:'var(--ink3)', fontWeight:400, marginLeft:3 }}>Leadership</span>
        </div>
        <div className="nav-r">
          <ConnectionDot online={online}/>
          {me && <span style={{ fontSize:12, color:'var(--ink3)', marginLeft:4 }}>{me.name}</span>}
          <button className="btn btn-g btn-sm" onClick={refresh}>↻</button>
          <button className="btn btn-g btn-sm" onClick={()=>nav('/admin')}>← Dashboard</button>
          {userIsAdmin && <button className="btn btn-g btn-sm" onClick={()=>nav('/admin/settings')}>⚙ Settings</button>}
          <button className="btn btn-g btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="page">
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:'-.5px' }}>Leadership Assessment</h1>
          <p style={{ color:'var(--ink3)', marginTop:4, fontSize:13 }}>Situational judgement assessments for people manager roles</p>
        </div>

        {/* Stats */}
        <div className="g4" style={{ marginBottom:20 }}>
          {[
            { icon:'👥', v:roles.length, l:'Active Roles' },
            { icon:'📋', v:allCandidates.length, l:'Assessed' },
            { icon:'🌟', v:strongCount, l:'Strong Fit' },
            { icon:'✨', v:modCount, l:'Moderate Fit' },
          ].map((s,i) => (
            <div key={i} className="scard">
              <div style={{ fontSize:20, marginBottom:8 }}>{s.icon}</div>
              <div className="sv">{s.v}</div><div className="sl">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Global search */}
        <div style={{ marginBottom:20, position:'relative' }}>
          <input placeholder="🔍  Search any candidate by name or email..."
            value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)}
            style={{ width:'100%', padding:'11px 16px', border:'1.5px solid var(--line)', borderRadius:'var(--r-sm)',
              fontFamily:'inherit', fontSize:13, outline:'none', background:'var(--paper)' }}
            onFocus={e=>e.target.style.borderColor='var(--accent)'}
            onBlur={e=>e.target.style.borderColor='var(--line)'}/>
          {globalSearch && <button onClick={()=>setGlobalSearch('')}
            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'var(--ink3)' }}>✕</button>}
        </div>

        {globalSearch.trim() ? (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--ink2)', marginBottom:12 }}>
              {globalResults.length} result{globalResults.length!==1?'s':''} for "{globalSearch}"
            </div>
            {globalResults.length > 0 ? (
              <div className="tw">
                <table>
                  <thead><tr><th>Candidate</th><th>Role</th><th>Fit</th><th>Style</th><th>Date</th></tr></thead>
                  <tbody>
                    {globalResults.map(c => (
                      <tr key={c.id} style={{ cursor:c.status==='completed'?'pointer':'default' }}
                        onClick={()=>c.status==='completed'&&setViewModal(c)}>
                        <td><div style={{ fontWeight:600 }}>{c.name}</div><div style={{ fontSize:11,color:'var(--ink3)' }}>{c.email}</div></td>
                        <td style={{ fontSize:12 }}>{c.roleName}</td>
                        <td style={{ fontSize:12, fontWeight:600 }}>
                          {c.fitLabel||'Pending'}
                          {(c.tabSwitches > 0) && (
                            <span style={{ marginLeft:6, fontSize:11, fontWeight:700,
                              color: c.flagged ? 'var(--bad)' : 'var(--warn)' }}>
                              {c.flagged ? '🚩' : '⚠️ ' + c.tabSwitches}
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize:12, color:'var(--accent)' }}>{c.leadershipStyle||'—'}</td>
                        <td style={{ fontSize:11, color:'var(--ink3)' }}>{c.completedAt?new Date(c.completedAt).toLocaleDateString('en-GB'):'—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div style={{ padding:'24px', textAlign:'center', color:'var(--ink3)', background:'var(--paper2)', borderRadius:10 }}>No candidates found.</div>}
          </div>
        ) : (
          <>
            <div className="shdr" style={{ marginBottom:16 }}>
              <div>
                <div className="stitle">{showArchived ? 'Archived Roles' : 'Active Roles'}</div>
                <div className="ssub">Click any role to expand candidates</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className={'btn btn-sm '+(showArchived?'btn-s':'btn-g')} onClick={()=>setShowArchived(v=>!v)}>
                  {showArchived?'← Active':'🗄 Archived'}
                </button>
                {!showArchived && userCanEdit && <button className="btn btn-p btn-sm" onClick={()=>setNewRoleModal(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Role
                </button>}
              </div>
            </div>

            {activeRoles.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'var(--ink3)' }}>
                {showArchived ? 'No archived roles.' : 'No leadership roles yet. Create your first one above.'}
              </div>
            ) : (
              activeRoles.map(role => (
                <LRoleCard key={role.id} role={role} candidates={allCandidates}
                  onLink={r=>{setLinkModal(r);setCopied(false)}}
                  onDelete={r=>setDeleteConfirm({type:'role',id:r.id,name:r.title})}
                  onArchive={r=>{dbUpdateRole(r.id,{archived:!r.archived});refresh()}}
                  onManageExpiry={r=>{setExpiryModal(r);setExpiryInput(r.expiryDate||'')}}
                  onViewResult={setViewModal}
                  onNote={c=>{setNoteModal(c);setNoteText(c.notes||'')}}
                  onDeleteCand={c=>setDeleteConfirm({type:'candidate',id:c.id,name:c.name})}
                  userIsAdmin={userIsAdmin}
                  userCanEdit={userCanEdit}
            userCanEdit={userCanEdit} me={me}/>
              ))
            )}
          </>
        )}
      </div>

      {/* New Role Modal */}
      {newRoleModal && (
        <div className="overlay" onClick={()=>setNewRoleModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Create Leadership Assessment Role</h3>
            <div className="msub">Generate a shareable link for a leadership situational judgement assessment.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              <div className="fg"><label className="fl">Role Title *</label>
                <input className="fi" placeholder="e.g. Senior Manager — People Leadership"
                  value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
              </div>
              <div className="fg"><label className="fl">Department</label>
                <input className="fi" placeholder="e.g. Operations"
                  value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))}/>
              </div>
              <div className="fg"><label className="fl">Expiry Date (optional)</label>
                <input className="fi" type="date" min={new Date().toISOString().split('T')[0]}
                  value={form.expiryDate} onChange={e=>setForm(p=>({...p,expiryDate:e.target.value}))}/>
              </div>
              <div style={{ padding:'12px 14px', background:'var(--accent-dim)', border:'1px solid var(--accent-mid)', borderRadius:9, fontSize:12, color:'var(--ink2)', lineHeight:1.6 }}>
                📋 This will create a <strong>Leadership SJT Assessment</strong> — 20 situational judgement questions across 5 dimensions. No cognitive test included.
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="btn btn-s" onClick={()=>setNewRoleModal(false)}>Cancel</button>
              <button className="btn btn-p" style={{ flex:1, justifyContent:'center' }} onClick={makeRole} disabled={!form.title.trim()}>
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {linkModal && (
        <div className="overlay" onClick={()=>setLinkModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Leadership Assessment Link</h3>
            <div className="msub">Share with candidates for <strong>{linkModal.title}</strong>.</div>
            <div className="copybox">
              <input className="copytext" readOnly value={getLink(linkModal)}/>
              <button className="btn btn-p btn-sm" onClick={()=>copyLink(linkModal)}>{copied?'✓ Copied!':'Copy Link'}</button>
            </div>
            <div style={{ background:'var(--accent-dim)', border:'1px solid var(--accent-mid)', borderRadius:9, padding:'10px 14px', fontSize:12, color:'var(--ink2)', marginTop:12 }}>
              20 SJT questions · 5 dimensions · Qualitative results only for candidates · Full scores visible to you
            </div>
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button className="btn btn-s" style={{ flex:1, justifyContent:'center' }} onClick={()=>setLinkModal(null)}>Done</button>
              <button className="btn btn-p" style={{ flex:1, justifyContent:'center' }}
                onClick={()=>{setLinkModal(null);window.open(getLink(linkModal),'_blank')}}>▶ Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* Expiry Modal */}
      {expiryModal && (
        <div className="overlay" onClick={()=>setExpiryModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Manage Expiry — {expiryModal.title}</h3>
            <div className="fg" style={{ marginBottom:12 }}>
              <label className="fl">Expiry Date</label>
              <input className="fi" type="date" min={new Date().toISOString().split('T')[0]}
                value={expiryInput} onChange={e=>setExpiryInput(e.target.value)}/>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
              {[7,14,30].map(d => (
                <button key={d} className="btn btn-g btn-sm" style={{ fontSize:11 }}
                  onClick={()=>{const dt=new Date();dt.setDate(dt.getDate()+d);setExpiryInput(dt.toISOString().split('T')[0])}}>
                  +{d} days
                </button>
              ))}
              <button className="btn btn-s btn-sm" style={{ fontSize:11, color:'var(--bad)' }} onClick={()=>setExpiryInput('')}>Remove Expiry</button>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-s" style={{ flex:1, justifyContent:'center' }} onClick={()=>setExpiryModal(null)}>Cancel</button>
              <button className="btn btn-p" style={{ flex:1, justifyContent:'center' }} onClick={()=>{
                dbUpdateRole(expiryModal.id,{expiryDate:expiryInput}); setExpiryModal(null); refresh()
              }}>{expiryInput?'Save Date':'Remove Expiry'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <div className="overlay" onClick={()=>setNoteModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Notes — {noteModal.name}</h3>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="Recruiter notes..."
              style={{ width:'100%', minHeight:100, padding:'11px 14px', border:'1.5px solid var(--line)',
                borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:14, resize:'vertical', outline:'none' }}/>
            <div style={{ display:'flex', gap:10, marginTop:12 }}>
              <button className="btn btn-s" onClick={()=>setNoteModal(null)}>Cancel</button>
              <button className="btn btn-p" style={{ flex:1, justifyContent:'center' }} onClick={saveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="overlay" onClick={()=>setDeleteConfirm(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <div className="msub">Delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-s" style={{ flex:1, justifyContent:'center' }} onClick={()=>setDeleteConfirm(null)}>Cancel</button>
              <button style={{ flex:1, justifyContent:'center', background:'var(--bad)', color:'#fff', border:'none',
                borderRadius:'var(--r-sm)', padding:'9px 18px', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}
                onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {bulkPDFModal && (
        <BulkPDFLeadershipModal
          candidates={bulkPDFModal.candidates}
          roleName={bulkPDFModal.roleName}
          origin={window.location.origin}
          onClose={()=>setBulkPDFModal(null)}
        />
      )}

      {/* Profile Modal */}
      {viewModal && <LeadershipProfileModal candidate={viewModal} onClose={()=>setViewModal(null)}/>}
    </div>
  )
}
