import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, setCurrentUser } from '../App'

const SECTIONS = [
  {
    icon: '🚀',
    title: 'Getting Started',
    content: [
      { q: 'How do I create an assessment role?', a: 'Go to the Dashboard → click "New Role" → enter the role title, department, pass mark, and difficulty level. Click "Create Role" and your shareable link is generated instantly.' },
      { q: 'How do I share the assessment link with candidates?', a: 'After creating a role, click the 🔗 Link button on the role card. Copy the link and send it to candidates via email, WhatsApp, or any messaging tool. The link works on any device and browser.' },
      { q: 'What is the difference between Standard and MTO mode?', a: 'Standard mode is a straightforward cognitive assessment. MTO Recruitment mode adds an age gate (candidates over the limit are politely rejected), and a CV upload box appears for candidates who pass the test.' },
    ]
  },
  {
    icon: '📋',
    title: 'Managing Roles',
    content: [
      { q: 'How do I set a pass mark?', a: 'When creating a role, set the "Pass Mark" field (out of 20). You can also edit it later by clicking "Edit" next to the pass mark on the role card. Candidates at or above this score are marked as Pass.' },
      { q: 'How do I archive a role?', a: 'Click the 🗄 button on the role card to archive it. Archived roles disappear from the active list but all candidate data is preserved. Click "🗄 Archived" in the header to view and reactivate them.' },
      { q: 'How do I set an expiry date for a role?', a: 'When creating a role, set an optional expiry date. After this date, candidates who open the link will see a polite "link expired" message. You can reactivate or extend the date at any time from the role card.' },
      { q: 'What difficulty levels are available?', a: '🟢 Easy (45s per question, simpler patterns), 🟡 Medium (60s per question, standard — default), 🔴 Hard (45s per question, complex multi-step problems). Set this when creating a role.' },
      { q: 'What is Bulk Invite?', a: 'Click 📧 on a role card to open bulk invite. Paste a CSV list of names and emails (one per line: Name, Email). The app generates the link for all of them so you can copy and send easily.' },
    ]
  },
  {
    icon: '👥',
    title: 'Managing Candidates',
    content: [
      { q: 'How do I view a candidate\'s full profile?', a: 'Click on any completed candidate row in the dashboard to open their full cognitive profile — score breakdown, trait bars, percentile rank, benchmark comparison, and recruiter insight.' },
      { q: 'How do I add notes to a candidate?', a: 'Click the 📝 button next to any candidate. Notes are private and only visible to admins and recruiters. They appear as a preview in the candidate list.' },
      { q: 'How do I export results?', a: 'Click "📥 CSV" inside any expanded role card to download results for that role, or use the CSV button in the Ranking tab for all candidates. Excel export is also available.' },
      { q: 'What does the benchmark comparison show?', a: 'When viewing a candidate profile, the benchmark section shows their score rank among all candidates for that role, what percentage of applicants they beat, the role average score, and a score distribution chart.' },
      { q: 'Can a candidate take the same test twice?', a: 'No — the app checks the candidate\'s email against the role. If they already completed it, they see a message showing their previous score instead of retaking the test.' },
    ]
  },
  {
    icon: '⚙',
    title: 'Settings & Users',
    content: [
      { q: 'How do I change the admin password?', a: 'Go to ⚙ Settings → Admin Password section → enter your new password → click Save Settings.' },
      { q: 'How do I add a recruiter?', a: 'Go to 👥 Users → click "Add User" → enter name, email, password → select "Recruiter" role → click "Create User". They can then log in at your assessment URL.' },
      { q: 'What can Recruiters do vs Admins?', a: 'Recruiters can create roles, generate links, view results, export CSV, and add notes. They cannot delete Admin-created roles, delete candidates, access Settings, or manage users.' },
      { q: 'How do I enable AI question generation?', a: 'Go to ⚙ Settings → AI Question Generation → paste your Google Gemini API key (free at aistudio.google.com) or Anthropic API key → Save. Every candidate will then get uniquely generated questions.' },
      { q: 'How do I log in as Super Admin?', a: 'Use email "admin" and your admin password on the login screen. The Super Admin account cannot be deleted and has full access to everything.' },
    ]
  },
  {
    icon: '🧠',
    title: 'About the Assessment',
    content: [
      { q: 'What does the test measure?', a: 'The cognitive assessment measures Logical Reasoning (pattern recognition in 3x3 grids) and Numerical Reasoning (mathematical and data interpretation problems). These are strong predictors of job performance.' },
      { q: 'How long is the test?', a: '20 questions with a 20-minute overall timer, plus a per-question timer (45s for Easy/Hard, 60s for Medium). If a candidate runs out of time on a question it auto-advances.' },
      { q: 'How is the score calculated?', a: 'Each correct answer scores 1 point. Total is out of 20 (10 logic + 10 numerical). The percentile rank is calculated based on score distribution against a benchmark population.' },
      { q: 'What is the Cognitive Trait Profile?', a: 'The profile shows 5 traits derived from the results: Logical Reasoning, Numerical Reasoning, Processing Speed, Problem Solving, and Analytical Thinking. Each is scored 0-100.' },
      { q: 'How are questions selected?', a: 'The app uses a 100-question bank (50 logic + 50 numerical) and selects 20 randomly for each candidate using a unique seed based on their ID. This ensures every candidate gets a different set of questions.' },
    ]
  },
]

export default function Help() {
  const nav = useNavigate()
  const me  = getCurrentUser()
  const [openSection, setOpenSection] = useState(0)
  const [openQ, setOpenQ]             = useState(null)
  const logout = () => { setCurrentUser(null); nav('/') }

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={() => nav('/admin')} style={{ cursor:'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
          <span style={{ fontSize:11, color:'var(--ink3)', fontWeight:400, marginLeft:3 }}>Help</span>
        </div>
        <div className="nav-r">
          <button className="btn btn-g btn-sm" onClick={() => nav('/admin')}>← Dashboard</button>
          <button className="btn btn-g btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth:760 }}>
        <div style={{ marginBottom:32, textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📖</div>
          <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:'-.5px', marginBottom:8 }}>User Manual</h1>
          <p style={{ color:'var(--ink3)', fontSize:14, lineHeight:1.7 }}>
            Everything you need to know about using AssessIQ as an admin or recruiter.
          </p>
        </div>

        {/* Quick links */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:10, marginBottom:32 }}>
          {SECTIONS.map((s, i) => (
            <button key={i} onClick={() => setOpenSection(i)}
              style={{ padding:'14px 12px', background: openSection===i ? 'var(--accent-dim)' : 'var(--paper2)',
                border:'1.5px solid ' + (openSection===i ? 'var(--accent)' : 'var(--line)'),
                borderRadius:10, cursor:'pointer', fontFamily:'inherit', textAlign:'center', transition:'all .15s' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontSize:12, fontWeight:600, color: openSection===i ? 'var(--accent)' : 'var(--ink)' }}>{s.title}</div>
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="card card-xl" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--line)', background:'var(--paper2)' }}>
            <div style={{ fontSize:18, fontWeight:800 }}>{SECTIONS[openSection].icon} {SECTIONS[openSection].title}</div>
          </div>
          {SECTIONS[openSection].content.map((item, i) => (
            <div key={i} style={{ borderBottom: i < SECTIONS[openSection].content.length-1 ? '1px solid var(--line)' : 'none' }}>
              <button onClick={() => setOpenQ(openQ === i ? null : i)}
                style={{ width:'100%', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center',
                  background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', textAlign:'left', gap:12 }}>
                <span style={{ fontWeight:600, fontSize:14, color:'var(--ink)' }}>{item.q}</span>
                <span style={{ fontSize:16, color:'var(--ink3)', flexShrink:0, transition:'transform .2s',
                  transform: openQ===i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
              </button>
              {openQ === i && (
                <div style={{ padding:'0 24px 18px', fontSize:13, color:'var(--ink2)', lineHeight:1.8 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact box */}
        <div style={{ marginTop:24, padding:'20px 24px', background:'var(--accent-dim)', border:'1.5px solid var(--accent-mid)', borderRadius:14, textAlign:'center' }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>Need more help?</div>
          <p style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7 }}>
            If you have a question not covered here, contact your system administrator or refer to the technical documentation.
          </p>
        </div>
      </div>
    </div>
  )
}
