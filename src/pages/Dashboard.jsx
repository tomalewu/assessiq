import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, setCurrentUser, isAdmin } from '../App'
import { dbAddRole, dbUpdateRole, dbDeleteRole, dbRoles,
         dbAllCandidates, dbDeleteCandidate, dbSaveCandidate, dbAddCandidate } from '../db'
import { buildProfile } from '../scoring'
import ResultsModal from '../components/ResultsModal'
import DashboardCharts from '../components/Charts'

// ── CSV Export ────────────────────────────────────────────────────────
function exportCSV(candidates, roles) {
  const roleMap = {}
  roles.forEach(r => { roleMap[r.id] = r })
  const headers = ['Rank','Name','Email','Phone','DOB','Role','Score','Logic','Numerical','Percentile','Time (min)','Result','CV','Status','Notes','Date']
  const sorted = [...candidates].filter(c => c.status === 'completed').sort((a,b) => (b.totalScore||0)-(a.totalScore||0))
  const rankMap = {}
  sorted.forEach((c,i) => { rankMap[c.id] = i+1 })
  const rows = candidates.map(c => {
    const role      = roleMap[c.roleId]
    const threshold = role?.threshold || 12
    const passed    = c.status === 'completed' && (c.totalScore||0) >= threshold
    return [
      rankMap[c.id] || '',
      c.name, c.email, c.phone || '',
      c.dob ? new Date(c.dob).toLocaleDateString('en-GB') : '',
      c.roleName || role?.title || '',
      c.totalScore ?? '', c.logicScore ?? '', c.numScore ?? '',
      c.percentile ? c.percentile+'th' : '',
      c.timeTaken ? (c.timeTaken/60).toFixed(1) : '',
      c.status === 'completed' ? (passed ? 'Pass' : 'Fail') : '',
      c.cvUrl ? 'Yes' : '',
      c.status, c.notes || '',
      c.completedAt ? new Date(c.completedAt).toLocaleDateString('en-GB') : ''
    ].map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',')
  })
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], {type:'text/csv'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download='assessiq_results.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ── Connection Status ─────────────────────────────────────────────────
function ConnectionDot({ online }) {
  return (
    <div title={online ? 'Firebase connected' : 'Offline — using local backup'}
      style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--ink3)' }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background: online ? 'var(--ok)' : 'var(--warn)',
        boxShadow: online ? '0 0 6px var(--ok)' : '0 0 6px var(--warn)', transition:'all .5s' }}/>
      {online ? 'Live' : 'Offline'}
    </div>
  )
}

// ── Bulk Invite Modal ─────────────────────────────────────────────────
function BulkInviteModal({ role, onClose }) {
  const [csv, setCsv]       = useState('')
  const [preview, setPreview] = useState([])
  const [copied, setCopied]   = useState(false)

  const parse = (text) => {
    const lines = text.trim().split('\n').filter(Boolean)
    return lines.map(l => {
      const [name, email] = l.split(',').map(s => s.trim().replace(/"/g,''))
      return { name: name||'', email: email||name||'' }
    }).filter(r => r.email.includes('@'))
  }

  useEffect(() => { setPreview(parse(csv)) }, [csv])

  const getLink = () => {
    const payload = btoa(JSON.stringify({ id: role.id, linkId: role.linkId, title: role.title, dept: role.dept||'', isMTO: role.isMTO||false, ageLimit: role.ageLimit||28, threshold: role.threshold||12, recruiterEmail: role.recruiterEmail||'' }))
    return window.location.origin + '/assess/' + payload
  }

  const copyAll = () => {
    const link = getLink()
    const lines = preview.map(r => r.name + ' <' + r.email + '> — ' + link).join('\n')
    navigator.clipboard.writeText(lines).catch(()=>{})
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <h3>Bulk Invite Candidates</h3>
        <div className="msub">Paste CSV for <strong>{role.title}</strong>. One per line: <code style={{fontFamily:'JetBrains Mono',fontSize:11}}>Name, Email</code></div>
        <textarea value={csv} onChange={e=>setCsv(e.target.value)}
          placeholder={'John Smith, john@company.com\nPriya Sharma, priya@company.com'}
          style={{width:'100%',minHeight:100,padding:'11px 14px',border:'1.5px solid var(--line)',borderRadius:'var(--r-sm)',
            fontFamily:'JetBrains Mono',fontSize:12,resize:'vertical',outline:'none',lineHeight:1.7,color:'var(--ink)',marginBottom:10}}/>
        {preview.length > 0 && (
          <div style={{marginBottom:14,background:'var(--paper2)',borderRadius:9,padding:'10px 14px',fontSize:12,color:'var(--ink3)'}}>
            {preview.length} candidate{preview.length!==1?'s':''} detected
          </div>
        )}
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-s" style={{flex:1,justifyContent:'center'}} onClick={onClose}>Close</button>
          {preview.length > 0 && (
            <button className="btn btn-p" style={{flex:1,justifyContent:'center'}} onClick={copyAll}>
              {copied ? '✓ Copied!' : 'Copy Links'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Role Card with expandable candidates ──────────────────────────────
function RoleCard({ role, candidates, onLink, onBulk, onDelete, onArchive, onEditThreshold, onViewResult, onNote, onDeleteCand, userIsAdmin, me }) {
  const [expanded, setExpanded]   = useState(false)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [filterStatus, setFilter] = useState('all')
  const [sortBy, setSort]         = useState('date')
  const [sortDir, setSortDir]     = useState('desc')
  const [editingThreshold, setEditingThreshold] = useState(false)
  const PER_PAGE = 20

  const rc    = candidates.filter(c => c.roleId === role.id)
  const rdone = rc.filter(c => c.status === 'completed')
  const passed = rdone.filter(c => (c.totalScore||0) >= (role.threshold||12))
  const passRate = rdone.length > 0 ? Math.round(passed.length / rdone.length * 100) : 0

  // Filter + search + sort
  let filtered = rc
  if (filterStatus !== 'all') filtered = filtered.filter(c => c.status === filterStatus)
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(c => (c.name||'').toLowerCase().includes(q) || (c.email||'').toLowerCase().includes(q))
  }
  filtered = [...filtered].sort((a,b) => {
    let va, vb
    if (sortBy === 'score') { va = a.totalScore??-1; vb = b.totalScore??-1 }
    else if (sortBy === 'name') { va = (a.name||'').toLowerCase(); vb = (b.name||'').toLowerCase() }
    else { va = a.completedAt||a.startedAt||''; vb = b.completedAt||b.startedAt||'' }
    if (va < vb) return sortDir === 'asc' ? -1 : 1
    if (va > vb) return sortDir === 'asc' ? 1 : -1
    return 0
  })
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const fmtDate    = d => !d ? '—' : new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})

  return (
    <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:12 }}>
      {/* Role header */}
      <div style={{ padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}
        onClick={() => { setExpanded(v=>!v); setPage(1) }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{role.title}</div>
            {role.isMTO && <span style={{ fontSize:10, background:'#fef3c7', color:'#92400e', padding:'2px 7px', borderRadius:999, fontWeight:700 }}>MTO</span>}
            {role.difficulty && role.difficulty !== 'medium' && (
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, fontWeight:700,
                background:role.difficulty==='hard'?'#fee2e2':'#dcfce7',
                color:role.difficulty==='hard'?'#991b1b':'#166534' }}>
                {role.difficulty==='hard'?'🔴 Hard':'🟢 Easy'}
              </span>
            )}
            {role.archived && <span style={{ fontSize:10, background:'var(--paper3)', color:'var(--ink3)', padding:'2px 7px', borderRadius:999, fontWeight:700 }}>Archived</span>}
            {role.dept && <span style={{ fontSize:12, color:'var(--ink3)' }}>{role.dept}</span>}
          </div>
          <div style={{ display:'flex', gap:12, fontSize:12, color:'var(--ink3)', flexWrap:'wrap' }}>
            <span><strong style={{ color:'var(--ink)' }}>{rc.length}</strong> total</span>
            <span><strong style={{ color:'var(--accent)' }}>{rdone.length}</strong> completed</span>
            <span><strong style={{ color:'var(--ok)' }}>{passed.length}</strong> passed</span>
            {rdone.length > 0 && <span style={{ color:'var(--ok)', fontWeight:600 }}>{passRate}% pass rate</span>}
            <span>Pass mark: <strong>{role.threshold||12}/20</strong></span>
            {role.isMTO && <span>Age limit: <strong>≤{role.ageLimit||28}</strong></span>}
          </div>
          {rc.length > 0 && (
            <div className="pb-wrap" style={{ marginTop:8, height:4 }}>
              <div className="pb-fill" style={{ width:(rc.length?rdone.length/rc.length*100:0)+'%', height:'100%' }}/>
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
          <button className="btn btn-s btn-sm" style={{ fontSize:11 }}
            onClick={e=>{e.stopPropagation();onLink(role)}}>🔗 Link</button>
          <button className="btn btn-s btn-sm" style={{ fontSize:11 }}
            onClick={e=>{e.stopPropagation();onBulk(role)}}>📧</button>
          {(userIsAdmin || role.createdBy===me?.id) && (
            <button className="btn btn-g btn-sm" style={{ fontSize:11,padding:'5px 8px',color:'var(--warn)' }}
              title={role.archived?'Unarchive role':'Archive role'}
              onClick={e=>{e.stopPropagation();onArchive(role)}}>
              {role.archived?'📤':'🗄'}
            </button>
          )}
          {userIsAdmin && (
            <button className="btn btn-g btn-sm" style={{ fontSize:11,padding:'5px 8px',color:'var(--bad)' }}
              onClick={e=>{e.stopPropagation();onDelete(role)}}>🗑</button>
          )}
          <div style={{ fontSize:18, color:'var(--ink3)', marginLeft:4, transition:'transform .2s', transform: expanded?'rotate(180deg)':'rotate(0deg)' }}>▾</div>
        </div>
      </div>

      {/* Expanded candidates */}
      {expanded && (
        <div style={{ borderTop:'1px solid var(--line)', background:'var(--paper2)' }}>
          {/* Controls */}
          <div style={{ padding:'12px 20px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', borderBottom:'1px solid var(--line)' }}>
            <input
              placeholder="Search name or email..."
              value={search}
              onChange={e=>{setSearch(e.target.value);setPage(1)}}
              style={{ flex:1, minWidth:160, padding:'7px 12px', border:'1.5px solid var(--line)', borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:12, outline:'none', background:'var(--paper)' }}
            />
            <select value={filterStatus} onChange={e=>{setFilter(e.target.value);setPage(1)}}
              style={{ padding:'7px 10px',border:'1.5px solid var(--line)',borderRadius:'var(--r-sm)',fontFamily:'inherit',fontSize:12,background:'var(--paper)',outline:'none' }}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <select value={sortBy} onChange={e=>setSort(e.target.value)}
              style={{ padding:'7px 10px',border:'1.5px solid var(--line)',borderRadius:'var(--r-sm)',fontFamily:'inherit',fontSize:12,background:'var(--paper)',outline:'none' }}>
              <option value="date">Date</option>
              <option value="score">Score</option>
              <option value="name">Name</option>
            </select>
            <button className="btn btn-g btn-sm" onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')}>
              {sortDir==='asc'?'↑ Asc':'↓ Desc'}
            </button>
            <button className="btn btn-s btn-sm" onClick={()=>exportCSV(rc,[role])}>📥 CSV</button>
            {/* Pass mark edit */}
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, marginLeft:'auto' }}>
              <span style={{ color:'var(--ink3)' }}>Pass:</span>
              {editingThreshold ? (
                <span style={{ display:'flex', gap:5 }}>
                  <input type="number" min="1" max="20" defaultValue={role.threshold||12} id={'thresh-'+role.id}
                    style={{ width:46,padding:'4px 7px',border:'1.5px solid var(--accent)',borderRadius:6,fontFamily:'inherit',fontSize:12,outline:'none' }}/>
                  <button className="btn btn-p btn-sm" style={{ fontSize:11 }}
                    onClick={()=>{onEditThreshold(role.id, document.getElementById('thresh-'+role.id).value);setEditingThreshold(false)}}>Save</button>
                  <button className="btn btn-s btn-sm" style={{ fontSize:11 }} onClick={()=>setEditingThreshold(false)}>✕</button>
                </span>
              ) : (
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <strong style={{ color:'var(--accent)' }}>{role.threshold||12}/20</strong>
                  <button className="btn btn-g btn-sm" style={{ fontSize:11,padding:'2px 7px' }} onClick={()=>setEditingThreshold(true)}>Edit</button>
                </span>
              )}
            </div>
          </div>

          {/* Table */}
          {paginated.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px', color:'var(--ink3)', fontSize:13 }}>
              {search ? 'No candidates match your search.' : 'No candidates yet.'}
            </div>
          ) : (
            <div className="tw" style={{ margin:0, borderRadius:0, border:'none' }}>
              <table>
                <thead>
                  <tr><th>#</th><th>Candidate</th><th>Score</th><th>Time</th><th>Result</th><th>Date</th><th></th></tr>
                </thead>
                <tbody>
                  {paginated.map((c,i) => {
                    const threshold = role.threshold||12
                    const passed    = c.status==='completed' && (c.totalScore||0)>=threshold
                    const profile   = c.status==='completed' ? buildProfile(c.totalScore,c.logicScore,c.numScore,c.timeTaken) : null
                    return (
                      <tr key={c.id} style={{ cursor:c.status==='completed'?'pointer':'default' }}
                        onClick={()=>c.status==='completed'&&onViewResult({cand:c,profile})}>
                        <td style={{ color:'var(--ink3)',fontSize:12,width:28 }}>{(page-1)*PER_PAGE+i+1}</td>
                        <td>
                          <div style={{ fontWeight:600 }}>{c.name}</div>
                          <div style={{ fontSize:11,color:'var(--ink3)' }}>{c.email}</div>
                          {c.dob && <div style={{ fontSize:11,color:'var(--ink3)' }}>DOB: {new Date(c.dob).toLocaleDateString('en-GB')}</div>}
                          {c.notes && <div style={{ fontSize:11,color:'var(--accent)',marginTop:1 }}>📝 {c.notes.slice(0,30)}{c.notes.length>30?'…':''}</div>}
                          {c.cvUrl && <a href={c.cvUrl} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                            style={{ fontSize:11,color:'var(--ok)',fontWeight:600,textDecoration:'none',display:'block',marginTop:1 }}>📎 View CV</a>}
                        </td>
                        <td>{c.status==='completed'?<b>{c.totalScore}<span style={{ color:'var(--ink3)',fontWeight:400 }}>/20</span></b>:'—'}</td>
                        <td style={{ fontFamily:'JetBrains Mono',fontSize:12 }}>{c.status==='completed'?Math.floor(c.timeTaken/60)+'m':'—'}</td>
                        <td>
                          {c.status==='completed'
                            ?<span className={'badge '+(passed?'bg':'br')}><span className="dot"/>{passed?'Pass':'Fail'}</span>
                            :<span className="badge ba"><span className="dot"/>Pending</span>}
                        </td>
                        <td style={{ fontSize:11,color:'var(--ink3)' }}>{fmtDate(c.completedAt)}</td>
                        <td onClick={e=>e.stopPropagation()}>
                          <div style={{ display:'flex',gap:4 }}>
                            <button className="btn btn-g btn-sm" style={{ fontSize:11,padding:'3px 7px' }}
                              onClick={()=>onNote(c)}>📝</button>
                            {userIsAdmin && <button className="btn btn-g btn-sm" style={{ fontSize:11,padding:'3px 7px',color:'var(--bad)' }}
                              onClick={()=>onDeleteCand(c)}>🗑</button>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid var(--line)' }}>
              <span style={{ fontSize:12, color:'var(--ink3)' }}>
                Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}
              </span>
              <div style={{ display:'flex', gap:6 }}>
                <button className="btn btn-g btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).map((p,i,arr)=>(
                  <React.Fragment key={p}>
                    {i>0 && arr[i-1]!==p-1 && <span style={{ padding:'0 4px',color:'var(--ink3)' }}>…</span>}
                    <button className={'btn btn-sm '+(page===p?'btn-p':'btn-g')} onClick={()=>setPage(p)}>{p}</button>
                  </React.Fragment>
                ))}
                <button className="btn btn-g btn-sm" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next →</button>
              </div>
            </div>
          )}

          {/* Role summary footer */}
          <div style={{ padding:'10px 20px', borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--ink3)' }}>
            <span>{filtered.length} candidate{filtered.length!==1?'s':''}{search?' matching':''}  ·  {rdone.length} completed  ·  {passed.length} passed</span>
            <button className="btn btn-s btn-sm" style={{ fontSize:11 }} onClick={()=>exportCSV(rc,[role])}>📥 Export CSV</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const nav         = useNavigate()
  const me          = getCurrentUser()
  const userIsAdmin = isAdmin()
  const logout      = () => { setCurrentUser(null); nav('/') }

  const [roles, setRoles]                 = useState([])
  const [allCandidates, setAllCandidates] = useState([])
  const [loading, setLoading]             = useState(true)
  const [online, setOnline]               = useState(true)
  const [globalSearch, setGlobalSearch]   = useState('')
  const [newRoleModal, setNewRoleModal]   = useState(false)
  const [linkModal, setLinkModal]         = useState(null)
  const [bulkModal, setBulkModal]         = useState(null)
  const [viewResult, setViewResult]       = useState(null)
  const [noteModal, setNoteModal]         = useState(null)
  const [noteText, setNoteText]           = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm]                   = useState({ title:'', dept:'', threshold:12, isMTO:false, ageLimit:28, recruiterEmail:'', difficulty:'medium' })
  const [creating, setCreating]           = useState(false)
  const [copied, setCopied]               = useState(false)
  const [activeTab, setActiveTab]         = useState('roles')
  const [showCharts, setShowCharts]       = useState(false)
  const [showArchived, setShowArchived]   = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([dbRoles(), dbAllCandidates()])
      setRoles(r||[]); setAllCandidates(c||[])
      setOnline(true)
    } catch(e) {
      console.error('refresh failed',e)
      setOnline(false)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { refresh(); const t=setInterval(refresh,5000); return()=>clearInterval(t) },[refresh])
  useEffect(() => {
    const fn=()=>{ if(document.visibilityState==='visible') refresh() }
    document.addEventListener('visibilitychange',fn)
    return()=>document.removeEventListener('visibilitychange',fn)
  },[refresh])

  const done = allCandidates.filter(c=>c.status==='completed')
  const avg  = done.length ? Math.round(done.reduce((a,c)=>a+(c.totalScore||0),0)/done.length) : 0

  // Global search across all candidates
  const globalResults = globalSearch.trim() ? allCandidates.filter(c => {
    const q = globalSearch.toLowerCase()
    return (c.name||'').toLowerCase().includes(q) || (c.email||'').toLowerCase().includes(q)
  }) : []

  const makeRole = () => {
    if(!form.title.trim()) return
    setCreating(true)
    dbAddRole({
      title: form.title, dept: form.dept, threshold: Number(form.threshold)||12,
      createdBy: me?.id||'admin', createdByName: me?.name||'Admin',
      isMTO: form.isMTO, ageLimit: Number(form.ageLimit)||28, recruiterEmail: form.recruiterEmail,
      difficulty: form.difficulty || 'medium', archived: false
    })
    setForm({ title:'', dept:'', threshold:12, isMTO:false, ageLimit:28, recruiterEmail:'' })
    setNewRoleModal(false); setCreating(false); refresh()
  }

  const getLink = r => {
    const payload = btoa(JSON.stringify({ id:r.id, linkId:r.linkId, title:r.title, dept:r.dept||'', isMTO:r.isMTO||false, ageLimit:r.ageLimit||28, threshold:r.threshold||12, recruiterEmail:r.recruiterEmail||'' }))
    return window.location.origin+'/assess/'+payload
  }

  const copyLink = r => {
    navigator.clipboard.writeText(getLink(r)).catch(()=>{})
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  const handleDelete = async () => {
    if(!deleteConfirm) return
    if(deleteConfirm.type==='role') dbDeleteRole(deleteConfirm.id)
    else dbDeleteCandidate(deleteConfirm.id)
    setDeleteConfirm(null); await refresh()
  }

  const saveNote = () => {
    if(!noteModal) return
    dbSaveCandidate(noteModal.id,{notes:noteText}); setNoteModal(null); refresh()
  }

  // Ranking across all roles
  const rankingCands = [...allCandidates]
    .filter(c=>c.status==='completed')
    .map(c => {
      const role = roles.find(r=>r.id===c.roleId)
      return { ...c, passed:(c.totalScore||0)>=(role?.threshold||12), profile:buildProfile(c.totalScore,c.logicScore,c.numScore,c.timeTaken), roleTitle:role?.title||c.roleName||'' }
    })
    .sort((a,b)=>b.totalScore!==a.totalScore?(b.totalScore||0)-(a.totalScore||0):(a.timeTaken||9999)-(b.timeTaken||9999))

  if(loading) return(
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center">
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <span className="sp sp-lg"/>
          <p style={{color:'var(--ink3)',fontSize:14}}>Loading dashboard…</p>
        </div>
      </div>
    </div>
  )

  return(
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={()=>nav('/')} style={{cursor:'pointer'}}>
          <div className="logo-mark">A</div>AssessIQ
          <span style={{fontSize:11,color:'var(--ink3)',fontWeight:400,marginLeft:3}}>Admin</span>
        </div>
        <div className="nav-r">
          <ConnectionDot online={online}/>
          {me && <span style={{fontSize:12,color:'var(--ink3)',marginLeft:4}}>{me.name} <span style={{color:me.role==='admin'?'var(--ok)':'var(--accent)',fontWeight:600,textTransform:'capitalize'}}>({me.role})</span></span>}
          <button className="btn btn-g btn-sm" onClick={refresh} title="Refresh">↻</button>
          {userIsAdmin && <button className="btn btn-g btn-sm" onClick={()=>nav('/admin/users')}>👥 Users</button>}
          {userIsAdmin && <button className="btn btn-g btn-sm" onClick={()=>nav('/admin/settings')}>⚙ Settings</button>}
          <button className="btn btn-g btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="page">
        <div style={{marginBottom:20}}>
          <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.5px'}}>Assessment Hub</h1>
          <p style={{color:'var(--ink3)',marginTop:4,fontSize:13}}>Create roles, share links, track cognitive profiles</p>
        </div>

        {/* Stats */}
        <div className="g4" style={{marginBottom:20}}>
          {[
            {icon:'📋',v:roles.length,l:'Active Roles'},
            {icon:'👥',v:allCandidates.length,l:'Candidates'},
            {icon:'✅',v:done.length,l:'Completed'},
            {icon:'📈',v:avg?avg+'/20':'—',l:'Avg Score'},
          ].map((s,i)=>(
            <div key={i} className="scard">
              <div style={{fontSize:20,marginBottom:8}}>{s.icon}</div>
              <div className="sv">{s.v}</div><div className="sl">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Global search */}
        <div style={{ marginBottom:20, position:'relative' }}>
          <input
            placeholder="🔍  Search any candidate by name or email across all roles..."
            value={globalSearch}
            onChange={e=>setGlobalSearch(e.target.value)}
            style={{ width:'100%', padding:'11px 16px', border:'1.5px solid var(--line)', borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:13, outline:'none', background:'var(--paper)', transition:'border-color .15s' }}
            onFocus={e=>e.target.style.borderColor='var(--accent)'}
            onBlur={e=>e.target.style.borderColor='var(--line)'}
          />
          {globalSearch && (
            <button onClick={()=>setGlobalSearch('')}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'var(--ink3)' }}>✕</button>
          )}
        </div>

        {/* Global search results */}
        {globalSearch.trim() && (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--ink2)', marginBottom:12 }}>
              {globalResults.length} result{globalResults.length!==1?'s':''} for "{globalSearch}"
            </div>
            {globalResults.length > 0 ? (
              <div className="tw">
                <table>
                  <thead><tr><th>Candidate</th><th>Role</th><th>Score</th><th>Result</th><th>Date</th></tr></thead>
                  <tbody>
                    {globalResults.map(c => {
                      const role = roles.find(r=>r.id===c.roleId)
                      const threshold = role?.threshold||12
                      const passed = c.status==='completed'&&(c.totalScore||0)>=threshold
                      const profile = c.status==='completed'?buildProfile(c.totalScore,c.logicScore,c.numScore,c.timeTaken):null
                      return (
                        <tr key={c.id} style={{ cursor:c.status==='completed'?'pointer':'default' }}
                          onClick={()=>c.status==='completed'&&setViewResult({cand:c,profile})}>
                          <td>
                            <div style={{ fontWeight:600 }}>{c.name}</div>
                            <div style={{ fontSize:11,color:'var(--ink3)' }}>{c.email}</div>
                          </td>
                          <td style={{ fontSize:12,color:'var(--ink2)' }}>{role?.title||c.roleName||'—'}</td>
                          <td>{c.status==='completed'?<b>{c.totalScore}<span style={{ color:'var(--ink3)',fontWeight:400 }}>/20</span></b>:'—'}</td>
                          <td>
                            {c.status==='completed'
                              ?<span className={'badge '+(passed?'bg':'br')}><span className="dot"/>{passed?'Pass':'Fail'}</span>
                              :<span className="badge ba"><span className="dot"/>Pending</span>}
                          </td>
                          <td style={{ fontSize:11,color:'var(--ink3)' }}>{c.completedAt?new Date(c.completedAt).toLocaleDateString('en-GB'):'—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding:'24px', textAlign:'center', color:'var(--ink3)', background:'var(--paper2)', borderRadius:10 }}>
                No candidates found matching "{globalSearch}"
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        {!globalSearch.trim() && (
          <>
            <div style={{ display:'flex', gap:0, marginBottom:20, background:'var(--paper2)', borderRadius:'var(--r-sm)', padding:3, border:'1px solid var(--line)', width:'fit-content' }}>
              {[['roles','📋 Roles'],['ranking','🏆 Ranking'],['analytics','📊 Analytics']].map(([id,label])=>(
                <button key={id} onClick={()=>setActiveTab(id)}
                  style={{ padding:'7px 18px', borderRadius:6, border:'none', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer',
                    background:activeTab===id?'var(--paper)':'transparent', color:activeTab===id?'var(--ink)':'var(--ink3)',
                    boxShadow:activeTab===id?'var(--sh)':'none', transition:'all .15s' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Roles tab */}
            {activeTab==='roles' && (
              <div>
                <div className="shdr" style={{ marginBottom:16 }}>
                  <div>
                    <div className="stitle">{showArchived ? 'Archived Roles' : 'Active Roles'}</div>
                    <div className="ssub">Click any role to expand candidates · Search inside each role</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className={'btn btn-sm ' + (showArchived ? 'btn-s' : 'btn-g')}
                      onClick={()=>setShowArchived(v=>!v)}
                      title={showArchived ? 'Show active roles' : 'Show archived roles'}>
                      {showArchived ? '← Active' : '🗄 Archived'}
                    </button>
                    {!showArchived && <button className="btn btn-p btn-sm" onClick={()=>setNewRoleModal(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      New Role
                    </button>}
                  </div>
                </div>
                {roles.filter(r => showArchived ? r.archived : !r.archived).length === 0 ? (
                  <div style={{ textAlign:'center', padding:'60px 0', color:'var(--ink3)' }}>
                    No roles yet. Create your first role above.
                  </div>
                ) : (
                  roles.filter(r => showArchived ? r.archived : !r.archived).map(role => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      candidates={allCandidates}
                      onLink={r=>{setLinkModal(r);setCopied(false)}}
                      onBulk={r=>setBulkModal(r)}
                      onDelete={r=>setDeleteConfirm({type:'role',id:r.id,name:r.title})}
                      onArchive={r=>{dbUpdateRole(r.id,{archived:!r.archived});refresh()}}
                      onEditThreshold={(id,val)=>{dbUpdateRole(id,{threshold:Number(val)});refresh()}}
                      onViewResult={setViewResult}
                      onNote={c=>{setNoteModal(c);setNoteText(c.notes||'')}}
                      onDeleteCand={c=>setDeleteConfirm({type:'candidate',id:c.id,name:c.name})}
                      userIsAdmin={userIsAdmin}
                      me={me}
                    />
                  ))
                )}
              </div>
            )}

            {/* Ranking tab */}
            {activeTab==='ranking' && (
              <div>
                <div className="shdr" style={{ marginBottom:16 }}>
                  <div>
                    <div className="stitle">Overall Ranking</div>
                    <div className="ssub">All completed candidates ranked by score · tiebreak by speed</div>
                  </div>
                  <button className="btn btn-s btn-sm" onClick={()=>exportCSV(rankingCands,roles)}>📥 CSV</button>
                </div>
                <div className="tw">
                  <table>
                    <thead><tr><th>Rank</th><th>Candidate</th><th>Role</th><th>Score</th><th>Logic</th><th>Num</th><th>Percentile</th><th>Time</th><th>Result</th></tr></thead>
                    <tbody>
                      {rankingCands.map((c,i)=>{
                        const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1)
                        return(
                          <tr key={c.id} style={{ cursor:'pointer', background:i<3?'var(--paper2)':'', fontWeight:i===0?700:400 }}
                            onClick={()=>{ const roleCands=rankingCands.filter(x=>x.roleId===c.roleId); const rank=roleCands.findIndex(x=>x.id===c.id)+1; const beats=Math.round((1-rank/roleCands.length)*100); const avgScore=roleCands.length?Math.round(roleCands.reduce((a,x)=>a+(x.totalScore||0),0)/roleCands.length):0; const role=roles.find(r=>r.id===c.roleId); const threshold=role?.threshold||12; const passed=roleCands.filter(x=>(x.totalScore||0)>=threshold); const passRate=roleCands.length?Math.round(passed.length/roleCands.length*100):0; setViewResult({cand:c,profile:c.profile,benchmark:{total:roleCands.length,scoreRank:rank,beatsPercent:beats,avgScore,passRate}})}}>
                            <td style={{ textAlign:'center', fontSize:i<3?18:13 }}>{medal}</td>
                            <td>
                              <div style={{ fontWeight:600 }}>{c.name}</div>
                              <div style={{ fontSize:11,color:'var(--ink3)' }}>{c.email}</div>
                            </td>
                            <td style={{ fontSize:12,color:'var(--ink2)' }}>{c.roleTitle}</td>
                            <td><b style={{ color:i===0?'var(--ok)':'inherit' }}>{c.totalScore}<span style={{ color:'var(--ink3)',fontWeight:400 }}>/20</span></b></td>
                            <td style={{ color:'var(--ink2)' }}>{c.logicScore}/10</td>
                            <td style={{ color:'var(--ink2)' }}>{c.numScore}/10</td>
                            <td><span style={{ fontWeight:600,color:'var(--accent)' }}>{c.percentile}th</span></td>
                            <td style={{ fontFamily:'JetBrains Mono',fontSize:12 }}>{Math.floor(c.timeTaken/60)}m {c.timeTaken%60}s</td>
                            <td><span className={'badge '+(c.passed?'bg':'br')}><span className="dot"/>{c.passed?'Pass':'Fail'}</span></td>
                          </tr>
                        )
                      })}
                      {rankingCands.length===0&&<tr><td colSpan={9} style={{ textAlign:'center',padding:'40px',color:'var(--ink3)' }}>No completed assessments yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics tab */}
            {activeTab==='analytics' && (
              <div>
                {allCandidates.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'60px 0', color:'var(--ink3)' }}>No data yet. Analytics will appear once candidates complete assessments.</div>
                ) : (
                  <DashboardCharts candidates={allCandidates} roles={roles}/>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {newRoleModal&&(
        <div className="overlay" onClick={()=>setNewRoleModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Create New Role</h3>
            <div className="msub">A shareable candidate link is generated instantly.</div>
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              <div className="fg"><label className="fl">Role Title *</label>
                <input className="fi" placeholder="e.g. Senior Data Analyst" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
              </div>
              <div className="fg"><label className="fl">Department</label>
                <input className="fi" placeholder="e.g. Analytics" value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))}/>
              </div>
              <div className="fg"><label className="fl">Pass Mark (out of 20)</label>
                <input className="fi" type="number" min="1" max="20" value={form.threshold} onChange={e=>setForm(p=>({...p,threshold:e.target.value}))}/>
                <span style={{fontSize:11,color:'var(--ink3)'}}>Candidates at or above this score are marked Pass</span>
              </div>
              <div className="fg">
                <label className="fl">Question Difficulty</label>
                <div style={{display:'flex',gap:8}}>
                  {['easy','medium','hard'].map(d=>(
                    <div key={d} onClick={()=>setForm(p=>({...p,difficulty:d}))}
                      style={{flex:1,padding:'10px 12px',borderRadius:9,border:'1.5px solid '+(form.difficulty===d?'var(--accent)':'var(--line)'),
                        background:form.difficulty===d?'var(--accent-dim)':'var(--paper)',cursor:'pointer',textAlign:'center',transition:'all .15s'}}>
                      <div style={{fontSize:16,marginBottom:3}}>{d==='easy'?'🟢':d==='medium'?'🟡':'🔴'}</div>
                      <div style={{fontWeight:700,fontSize:12,textTransform:'capitalize'}}>{d}</div>
                      <div style={{fontSize:10,color:'var(--ink3)',marginTop:1}}>
                        {d==='easy'?'45s/Q · Simpler':d==='medium'?'60s/Q · Standard':'45s/Q · Complex'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding:'14px 16px',background:'var(--paper2)',borderRadius:10,border:'1.5px solid var(--line)'}}>
                <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginBottom:form.isMTO?14:0}}>
                  <input type="checkbox" checked={form.isMTO} onChange={e=>setForm(p=>({...p,isMTO:e.target.checked}))}
                    style={{width:16,height:16,accentColor:'var(--accent)',cursor:'pointer'}}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>MTO Recruitment Mode</div>
                    <div style={{fontSize:11,color:'var(--ink3)',marginTop:1}}>Age gate + CV upload + email notifications</div>
                  </div>
                </label>
                {form.isMTO && (
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    <div className="fg">
                      <label className="fl">Maximum Age (years)</label>
                      <input className="fi" type="number" min="18" max="60" value={form.ageLimit} onChange={e=>setForm(p=>({...p,ageLimit:e.target.value}))}/>
                      <span style={{fontSize:11,color:'var(--ink3)'}}>Candidates older than this will see a polite rejection</span>
                    </div>
                    <div className="fg">
                      <label className="fl">Recruiter Email (for CV alerts)</label>
                      <input className="fi" type="email" placeholder="recruiter@company.com" value={form.recruiterEmail} onChange={e=>setForm(p=>({...p,recruiterEmail:e.target.value}))}/>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:22}}>
              <button className="btn btn-s" onClick={()=>setNewRoleModal(false)}>Cancel</button>
              <button className="btn btn-p" style={{flex:1,justifyContent:'center'}} onClick={makeRole} disabled={creating||!form.title.trim()}>
                {creating?'Creating…':'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {linkModal&&(
        <div className="overlay" onClick={()=>setLinkModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Candidate Assessment Link</h3>
            <div className="msub">Share for <strong>{linkModal.title}</strong>. Works on any browser or device.</div>
            {linkModal.isMTO && (
              <div style={{background:'#fef3c7',border:'1px solid #f59e0b',borderRadius:9,padding:'10px 14px',fontSize:12,color:'#92400e',marginBottom:14}}>
                <strong>MTO Mode:</strong> Age limit {linkModal.ageLimit||28} years · CV upload on pass · Pass mark {linkModal.threshold||12}/20
              </div>
            )}
            <div className="copybox">
              <input className="copytext" readOnly value={getLink(linkModal)}/>
              <button className="btn btn-p btn-sm" onClick={()=>copyLink(linkModal)}>{copied?'✓ Copied!':'Copy Link'}</button>
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button className="btn btn-s" style={{flex:1,justifyContent:'center'}} onClick={()=>setLinkModal(null)}>Done</button>
              <button className="btn btn-p" style={{flex:1,justifyContent:'center'}}
                onClick={()=>{setLinkModal(null);window.open(getLink(linkModal),'_blank')}}>▶ Preview</button>
            </div>
          </div>
        </div>
      )}

      {bulkModal&&<BulkInviteModal role={bulkModal} onClose={()=>setBulkModal(null)}/>}

      {noteModal&&(
        <div className="overlay" onClick={()=>setNoteModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Notes — {noteModal.name}</h3>
            <div className="msub">Private notes visible only to admins and recruiters.</div>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="e.g. Strong logic score. Phone screen scheduled for Friday."
              style={{width:'100%',minHeight:120,padding:'11px 14px',border:'1.5px solid var(--line)',borderRadius:'var(--r-sm)',
                fontFamily:'inherit',fontSize:14,resize:'vertical',outline:'none',lineHeight:1.6,color:'var(--ink)'}}/>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button className="btn btn-s" onClick={()=>setNoteModal(null)}>Cancel</button>
              <button className="btn btn-p" style={{flex:1,justifyContent:'center'}} onClick={saveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm&&(
        <div className="overlay" onClick={()=>setDeleteConfirm(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <div className="msub">Delete <strong>{deleteConfirm.name}</strong>?{deleteConfirm.type==='role'?' Candidates will remain.':''} This cannot be undone.</div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-s" style={{flex:1,justifyContent:'center'}} onClick={()=>setDeleteConfirm(null)}>Cancel</button>
              <button style={{flex:1,justifyContent:'center',background:'var(--bad)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',
                padding:'9px 18px',fontFamily:'inherit',fontSize:13,fontWeight:600,cursor:'pointer'}} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {viewResult&&(
        <ResultsModal
          candidate={viewResult.cand}
          result={{totalScore:viewResult.cand.totalScore,logicScore:viewResult.cand.logicScore,numScore:viewResult.cand.numScore,timeTaken:viewResult.cand.timeTaken}}
          profile={viewResult.profile}
          benchmark={viewResult.benchmark}
          onClose={()=>setViewResult(null)}
        />
      )}
    </div>
  )
}
