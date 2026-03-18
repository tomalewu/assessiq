import React, { useState, useEffect } from 'react'
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
  const headers = ['Rank','Name','Email','Phone','Role','Score','Logic','Numerical','Percentile','Time (min)','Result','Status','Notes','Date']
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
      c.roleName || role?.title || '',
      c.totalScore ?? '', c.logicScore ?? '', c.numScore ?? '',
      c.percentile ? c.percentile+'th' : '',
      c.timeTaken ? (c.timeTaken/60).toFixed(1) : '',
      c.status === 'completed' ? (passed ? 'Pass' : 'Fail') : '',
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

// ── Bulk Invite Modal ─────────────────────────────────────────────────
function BulkInviteModal({ role, onClose }) {
  const [csv, setCsv]         = useState('')
  const [preview, setPreview] = useState([])
  const [done, setDone]       = useState(false)
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
    const payload = btoa(JSON.stringify({ id: role.id, linkId: role.linkId, title: role.title, dept: role.dept||'' }))
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
        <div className="msub">
          Paste a CSV list of candidates for <strong>{role.title}</strong>. One per line: <code style={{fontFamily:'JetBrains Mono',fontSize:11}}>Name, Email</code>
        </div>
        <textarea value={csv} onChange={e=>setCsv(e.target.value)}
          placeholder={'John Smith, john@company.com\nPriya Sharma, priya@company.com\njane@company.com'}
          style={{width:'100%',minHeight:120,padding:'11px 14px',border:'1.5px solid var(--line)',borderRadius:'var(--r-sm)',
            fontFamily:'JetBrains Mono',fontSize:12,resize:'vertical',outline:'none',lineHeight:1.7,color:'var(--ink)',marginBottom:12}}/>

        {preview.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--ink3)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>
              {preview.length} candidate{preview.length!==1?'s':''} detected
            </div>
            <div style={{maxHeight:120,overflowY:'auto',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',padding:'8px 12px',background:'var(--paper2)'}}>
              {preview.map((r,i)=>(
                <div key={i} style={{fontSize:12,padding:'3px 0',borderBottom:i<preview.length-1?'1px solid var(--line)':'none',display:'flex',gap:8}}>
                  <span style={{fontWeight:600,minWidth:120}}>{r.name||'—'}</span>
                  <span style={{color:'var(--ink3)'}}>{r.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {preview.length > 0 && (
          <div style={{background:'var(--accent-dim)',border:'1px solid var(--accent-mid)',borderRadius:9,padding:'12px 14px',fontSize:12,color:'var(--ink2)',lineHeight:1.7,marginBottom:16}}>
            <strong>Assessment link:</strong><br/>
            <span style={{fontFamily:'JetBrains Mono',fontSize:11,wordBreak:'break-all'}}>{getLink()}</span>
          </div>
        )}

        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-s" style={{flex:1,justifyContent:'center'}} onClick={onClose}>Close</button>
          {preview.length > 0 && (
            <button className="btn btn-p" style={{flex:1,justifyContent:'center'}} onClick={copyAll}>
              {copied ? '✓ Copied all links!' : 'Copy Link for All'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const nav = useNavigate()
  const [roles, setRoles]                 = useState([])
  const [allCandidates, setAllCandidates] = useState([])
  const [loading, setLoading]             = useState(true)
  const [newRoleModal, setNewRoleModal]   = useState(false)
  const [linkModal, setLinkModal]         = useState(null)
  const [bulkModal, setBulkModal]         = useState(null)
  const [selRoleId, setSelRoleId]         = useState(null)
  const [viewResult, setViewResult]       = useState(null)
  const [noteModal, setNoteModal]         = useState(null)
  const [noteText, setNoteText]           = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editThreshold, setEditThreshold] = useState(null)
  const [form, setForm]                   = useState({ title:'', dept:'', threshold:12 })
  const [creating, setCreating]           = useState(false)
  const [copied, setCopied]               = useState(false)
  const [sortBy, setSortBy]               = useState('rank')
  const [sortDir, setSortDir]             = useState('asc')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [showCharts, setShowCharts]       = useState(true)
  const [activeTab, setActiveTab]         = useState('candidates') // candidates | ranking

  const refresh = async () => {
    try {
      const [r, c] = await Promise.all([dbRoles(), dbAllCandidates()])
      setRoles(r||[]); setAllCandidates(c||[])
    } catch(e) { console.error('refresh failed',e) }
    finally { setLoading(false) }
  }

  useEffect(() => { refresh(); const t=setInterval(refresh,5000); return()=>clearInterval(t) },[])
  useEffect(() => {
    const fn=()=>{ if(document.visibilityState==='visible') refresh() }
    document.addEventListener('visibilitychange',fn)
    return()=>document.removeEventListener('visibilitychange',fn)
  },[])

  const selRole = selRoleId ? roles.find(r=>r.id===selRoleId) : null
  let cands = selRole ? allCandidates.filter(c=>c.roleId===selRole.id) : allCandidates
  if (filterStatus !== 'all') cands = cands.filter(c=>c.status===filterStatus)

  // Ranking — completed only, sorted by score desc
  const rankingCands = (selRole ? allCandidates.filter(c=>c.roleId===selRole.id) : allCandidates)
    .filter(c=>c.status==='completed')
    .map((c,_,arr) => {
      const role = roles.find(r=>r.id===c.roleId)
      const threshold = role?.threshold||12
      return {...c, passed:(c.totalScore||0)>=threshold, profile:buildProfile(c.totalScore,c.logicScore,c.numScore,c.timeTaken)}
    })
    .sort((a,b)=>{
      if(b.totalScore!==a.totalScore) return (b.totalScore||0)-(a.totalScore||0)
      return (a.timeTaken||9999)-(b.timeTaken||9999) // tiebreak: faster is better
    })

  // Sort candidates table
  cands = [...cands].sort((a,b)=>{
    let va,vb
    if(sortBy==='rank')       { va=(b.totalScore??-1); vb=(a.totalScore??-1) } // high score first
    else if(sortBy==='score') { va=a.totalScore??-1; vb=b.totalScore??-1 }
    else if(sortBy==='name')  { va=(a.name||'').toLowerCase(); vb=(b.name||'').toLowerCase() }
    else                      { va=a.completedAt||a.startedAt||''; vb=b.completedAt||b.startedAt||'' }
    if(va<vb) return sortDir==='asc'?-1:1
    if(va>vb) return sortDir==='asc'?1:-1
    return 0
  })

  const done = allCandidates.filter(c=>c.status==='completed')
  const avg  = done.length ? Math.round(done.reduce((a,c)=>a+(c.totalScore||0),0)/done.length) : 0

  const makeRole = () => {
    if(!form.title.trim()) return
    setCreating(true)
    const r = dbAddRole({title:form.title,dept:form.dept,threshold:Number(form.threshold)||12,createdBy:me?.id||'admin',createdByName:me?.name||'Admin'})
    setForm({title:'',dept:'',threshold:12})
    setNewRoleModal(false); setCreating(false); setLinkModal(r); refresh()
  }

  const getLink = r => {
    const payload = btoa(JSON.stringify({id:r.id,linkId:r.linkId,title:r.title,dept:r.dept||''}))
    return window.location.origin+'/assess/'+payload
  }

  const copyLink = r => {
    navigator.clipboard.writeText(getLink(r)).catch(()=>{})
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  const handleDelete = async () => {
    if(!deleteConfirm) return
    if(deleteConfirm.type==='role') { dbDeleteRole(deleteConfirm.id); if(selRoleId===deleteConfirm.id)setSelRoleId(null) }
    else dbDeleteCandidate(deleteConfirm.id)
    setDeleteConfirm(null); await refresh()
  }

  const saveNote = () => {
    if(!noteModal) return
    dbSaveCandidate(noteModal.id,{notes:noteText}); setNoteModal(null); refresh()
  }

  const saveThreshold = (roleId,val) => {
    dbUpdateRole(roleId,{threshold:Number(val)}); setEditThreshold(null); refresh()
  }

  const fmtDate  = d=>!d?'—':new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})
  const sortIcon = col=>sortBy===col?(sortDir==='asc'?'↑':'↓'):''
  const logout   = ()=>{ setAdminAuth(false); nav('/') }

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
          {me && <span style={{fontSize:12,color:'var(--ink3)',marginRight:4}}>{me.name} <span style={{color:me.role==='admin'?'var(--ok)':'var(--accent)',fontWeight:600,textTransform:'capitalize'}}>({me.role})</span></span>}
          <button className="btn btn-g btn-sm" onClick={refresh} title="Refresh">↻</button>
          {userIsAdmin && <button className="btn btn-g btn-sm" onClick={()=>nav('/admin/users')}>👥 Users</button>}
          {userIsAdmin && <button className="btn btn-g btn-sm" onClick={()=>nav('/admin/settings')}>⚙ Settings</button>}
          <button className="btn btn-g btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="page">
        <div style={{marginBottom:24}}>
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

        {/* Charts toggle */}
        {allCandidates.length > 0 && (
          <div style={{marginBottom:20}}>
            <button className="btn btn-g btn-sm" onClick={()=>setShowCharts(v=>!v)}
              style={{fontSize:12,marginBottom:showCharts?12:0}}>
              {showCharts?'▲ Hide':'📊 Show'} Analytics
            </button>
            {showCharts && <DashboardCharts candidates={allCandidates} roles={roles}/>}
          </div>
        )}

        <div className="g2" style={{alignItems:'start'}}>
          {/* Roles */}
          <div>
            <div className="shdr">
              <div><div className="stitle">Roles</div><div className="ssub">Click to filter · Set pass mark</div></div>
              <button className="btn btn-p btn-sm" onClick={()=>setNewRoleModal(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Role
              </button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {roles.map(role=>{
                const rc    = allCandidates.filter(c=>c.roleId===role.id)
                const rdone = rc.filter(c=>c.status==='completed')
                const passed = rdone.filter(c=>(c.totalScore||0)>=(role.threshold||12))
                const isSel = selRoleId===role.id
                return(
                  <div key={role.id} className="card" style={{padding:'16px 18px',cursor:'pointer',
                    borderColor:isSel?'var(--accent)':'var(--line)',background:isSel?'var(--accent-dim)':'var(--paper)',transition:'all .15s'}}
                    onClick={()=>setSelRoleId(isSel?null:role.id)}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{role.title}</div>
                        <div style={{fontSize:12,color:'var(--ink3)'}}>{role.dept}{role.createdByName && role.createdByName!=='Admin' && <span style={{marginLeft:8,color:'var(--ink3)',fontSize:11}}>by {role.createdByName}</span>}</div>
                      </div>
                      <div style={{display:'flex',gap:5,alignItems:'center',flexShrink:0,flexWrap:'wrap'}}>
                        <span className="badge bb">{rc.length}</span>
                        <button className="btn btn-s btn-sm" style={{fontSize:11}}
                          onClick={e=>{e.stopPropagation();setLinkModal(role);setCopied(false)}}>🔗</button>
                        <button className="btn btn-s btn-sm" style={{fontSize:11}}
                          onClick={e=>{e.stopPropagation();setBulkModal(role)}}>📧</button>
                        {(userIsAdmin || role.createdBy===me?.id) && <button className="btn btn-g btn-sm" style={{fontSize:11,padding:'5px 7px',color:'var(--bad)'}}
                          onClick={e=>{e.stopPropagation();setDeleteConfirm({type:'role',id:role.id,name:role.title})}}>🗑</button>}
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:10,fontSize:12}}>
                      <span style={{color:'var(--ink3)'}}>Pass mark:</span>
                      {editThreshold===role.id?(
                        <span onClick={e=>e.stopPropagation()} style={{display:'flex',gap:6,alignItems:'center'}}>
                          <input type="number" min="1" max="20" defaultValue={role.threshold||12} id={'t-'+role.id}
                            style={{width:52,padding:'3px 7px',border:'1.5px solid var(--accent)',borderRadius:6,fontFamily:'inherit',fontSize:12,outline:'none'}}/>
                          <button className="btn btn-p btn-sm" style={{fontSize:11,padding:'4px 10px'}}
                            onClick={e=>{e.stopPropagation();saveThreshold(role.id,document.getElementById('t-'+role.id).value)}}>Save</button>
                          <button className="btn btn-s btn-sm" style={{fontSize:11,padding:'4px 8px'}}
                            onClick={e=>{e.stopPropagation();setEditThreshold(null)}}>✕</button>
                        </span>
                      ):(
                        <span style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{fontWeight:700,color:'var(--accent)'}}>{role.threshold||12}/20</span>
                          <button className="btn btn-g btn-sm" style={{fontSize:11,padding:'2px 8px'}}
                            onClick={e=>{e.stopPropagation();setEditThreshold(role.id)}}>Edit</button>
                        </span>
                      )}
                      {rdone.length>0&&<span style={{marginLeft:'auto',color:'var(--ok)',fontWeight:600}}>{passed.length}/{rdone.length} passed</span>}
                    </div>
                    {rc.length>0&&(
                      <div style={{marginTop:8}}>
                        <div className="pb-wrap">
                          <div className="pb-fill" style={{width:(rc.length?rdone.length/rc.length*100:0)+'%'}}/>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              {roles.length===0&&<div style={{textAlign:'center',padding:'40px 0',color:'var(--ink3)'}}>No roles yet. Create one above.</div>}
            </div>
          </div>

          {/* Right panel */}
          <div>
            {/* Tabs */}
            <div style={{display:'flex',gap:0,marginBottom:16,background:'var(--paper2)',borderRadius:'var(--r-sm)',padding:3,border:'1px solid var(--line)',width:'fit-content'}}>
              {[['candidates','📋 Candidates'],['ranking','🏆 Ranking']].map(([id,label])=>(
                <button key={id} onClick={()=>setActiveTab(id)}
                  style={{padding:'7px 16px',borderRadius:6,border:'none',fontFamily:'inherit',fontSize:12,fontWeight:600,cursor:'pointer',
                    background:activeTab===id?'var(--paper)':'transparent',color:activeTab===id?'var(--ink)':'var(--ink3)',
                    boxShadow:activeTab===id?'var(--sh)':'none',transition:'all .15s'}}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab==='candidates'&&(
              <>
                <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:12}}>
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                    style={{padding:'6px 10px',border:'1.5px solid var(--line)',borderRadius:'var(--r-sm)',fontFamily:'inherit',fontSize:12,background:'var(--paper)',cursor:'pointer',outline:'none'}}>
                    <option value="all">All status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select value={sortBy} onChange={e=>{setSortBy(e.target.value);setSortDir('desc')}}
                    style={{padding:'6px 10px',border:'1.5px solid var(--line)',borderRadius:'var(--r-sm)',fontFamily:'inherit',fontSize:12,background:'var(--paper)',cursor:'pointer',outline:'none'}}>
                    <option value="rank">Sort: Score ↓</option>
                    <option value="date">Sort: Date</option>
                    <option value="name">Sort: Name</option>
                  </select>
                  <button className="btn btn-s btn-sm" onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')}>{sortDir==='asc'?'↑':'↓'}</button>
                  <button className="btn btn-s btn-sm" onClick={()=>exportCSV(cands,roles)}>📥 CSV</button>
                </div>
                <div className="tw">
                  <table>
                    <thead><tr><th>#</th><th>Candidate</th><th>Score</th><th>Time</th><th>Result</th><th>Date</th><th></th></tr></thead>
                    <tbody>
                      {cands.map((c,i)=>{
                        const role      = roles.find(r=>r.id===c.roleId)
                        const threshold = role?.threshold||12
                        const passed    = c.status==='completed'&&(c.totalScore||0)>=threshold
                        const profile   = c.status==='completed'?buildProfile(c.totalScore,c.logicScore,c.numScore,c.timeTaken):null
                        return(
                          <tr key={c.id} style={{cursor:c.status==='completed'?'pointer':'default'}}
                            onClick={()=>c.status==='completed'&&setViewResult({cand:c,profile})}>
                            <td style={{color:'var(--ink3)',fontSize:12,width:30}}>{c.status==='completed'?i+1:'—'}</td>
                            <td>
                              <div style={{fontWeight:600}}>{c.name}</div>
                              <div style={{fontSize:11,color:'var(--ink3)'}}>{c.email}</div>
                              {c.notes&&<div style={{fontSize:11,color:'var(--accent)',marginTop:2}}>📝 {c.notes.slice(0,35)}{c.notes.length>35?'…':''}</div>}
                            </td>
                            <td>{c.status==='completed'?<b>{c.totalScore}<span style={{color:'var(--ink3)',fontWeight:400}}>/20</span></b>:'—'}</td>
                            <td style={{fontFamily:'JetBrains Mono',fontSize:12}}>{c.status==='completed'?Math.floor(c.timeTaken/60)+'m':'—'}</td>
                            <td>
                              {c.status==='completed'
                                ?<span className={'badge '+(passed?'bg':'br')}><span className="dot"/>{passed?'Pass':'Fail'}</span>
                                :<span className="badge ba"><span className="dot"/>Pending</span>}
                            </td>
                            <td style={{fontSize:11,color:'var(--ink3)'}}>{fmtDate(c.completedAt)}</td>
                            <td onClick={e=>e.stopPropagation()}>
                              <div style={{display:'flex',gap:4}}>
                                <button className="btn btn-g btn-sm" style={{fontSize:11,padding:'4px 7px'}}
                                  onClick={()=>{setNoteModal(c);setNoteText(c.notes||'')}}>📝</button>
                                {userIsAdmin && <button className="btn btn-g btn-sm" style={{fontSize:11,padding:'4px 7px',color:'var(--bad)'}}
                                  onClick={()=>setDeleteConfirm({type:'candidate',id:c.id,name:c.name})}>🗑</button>}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {cands.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--ink3)'}}>No candidates yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab==='ranking'&&(
              <>
                <div style={{marginBottom:12,fontSize:13,color:'var(--ink3)'}}>
                  {selRole?'Ranking for '+selRole.title:'All roles combined'} · {rankingCands.length} completed
                </div>
                <div className="tw">
                  <table>
                    <thead><tr><th>Rank</th><th>Candidate</th><th>Score</th><th>Logic</th><th>Num</th><th>Percentile</th><th>Time</th><th>Result</th></tr></thead>
                    <tbody>
                      {rankingCands.map((c,i)=>{
                        const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':''
                        const role  = roles.find(r=>r.id===c.roleId)
                        const threshold = role?.threshold||12
                        const passed = (c.totalScore||0)>=threshold
                        return(
                          <tr key={c.id} style={{cursor:'pointer',background:i<3?'var(--paper2)':'',fontWeight:i===0?700:400}}
                            onClick={()=>setViewResult({cand:c,profile:c.profile})}>
                            <td style={{textAlign:'center',fontSize:18}}>{medal||'#'+(i+1)}</td>
                            <td>
                              <div style={{fontWeight:600}}>{c.name}</div>
                              <div style={{fontSize:11,color:'var(--ink3)'}}>{c.roleName||role?.title||''}</div>
                            </td>
                            <td><b style={{color:i===0?'var(--ok)':'inherit'}}>{c.totalScore}<span style={{color:'var(--ink3)',fontWeight:400}}>/20</span></b></td>
                            <td style={{color:'var(--ink2)'}}>{c.logicScore}/10</td>
                            <td style={{color:'var(--ink2)'}}>{c.numScore}/10</td>
                            <td><span style={{fontWeight:600,color:'var(--accent)'}}>{c.percentile}th</span></td>
                            <td style={{fontFamily:'JetBrains Mono',fontSize:12}}>{Math.floor(c.timeTaken/60)}m {c.timeTaken%60}s</td>
                            <td><span className={'badge '+(passed?'bg':'br')}><span className="dot"/>{passed?'Pass':'Fail'}</span></td>
                          </tr>
                        )
                      })}
                      {rankingCands.length===0&&<tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'var(--ink3)'}}>No completed assessments yet</td></tr>}
                    </tbody>
                  </table>
                </div>
                {rankingCands.length>0&&(
                  <div style={{marginTop:8,fontSize:12,color:'var(--ink3)'}}>
                    Tiebreaker: faster completion time ranks higher · Click a row for full cognitive profile
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
            <div className="copybox">
              <input className="copytext" readOnly value={getLink(linkModal)}/>
              <button className="btn btn-p btn-sm" onClick={()=>copyLink(linkModal)}>{copied?'✓ Copied!':'Copy Link'}</button>
            </div>
            <div style={{background:'var(--ok-dim)',border:'1px solid #6ee7b7',borderRadius:9,padding:'12px 14px',fontSize:12,color:'#065f46',lineHeight:1.7,marginBottom:16}}>
              <strong>Pass mark: {linkModal.threshold||12}/20.</strong> For bulk invites click 📧 on the role card.
            </div>
            <div style={{display:'flex',gap:10}}>
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
            <div className="msub">Private notes visible only to admins.</div>
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
            <div className="msub">Delete <strong>{deleteConfirm.name}</strong>?{deleteConfirm.type==='role'&&' Candidates will remain.'} This cannot be undone.</div>
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
          onClose={()=>setViewResult(null)}
        />
      )}
    </div>
  )
}
