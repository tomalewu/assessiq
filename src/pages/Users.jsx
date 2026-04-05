import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, setCurrentUser } from '../App'
import { dbAddUser, dbUpdateUser, dbDeleteUser, dbLoadUsers } from '../db'

export default function Users() {
  const nav  = useNavigate()
  const me   = getCurrentUser()
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)  // null | 'add' | {user}
  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'recruiter' })
  const [saving, setSaving]     = useState(false)
  const [err, setErr]           = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    const u = await dbLoadUsers()
    setUsers(u.filter(u => !u.isSuper))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm({ name: '', email: '', password: '', role: 'recruiter' })
    setErr('')
    setModal('add')
  }

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: user.password, role: user.role })
    setErr('')
    setModal(user)
  }

  const save = async () => {
    if (!form.name.trim())     { setErr('Name is required'); return }
    if (!form.email.trim())    { setErr('Email is required'); return }
    if (!form.password.trim()) { setErr('Password is required'); return }
    setSaving(true)
    if (modal === 'add') {
      dbAddUser({ name: form.name, email: form.email, password: form.password, role: form.role })
    } else {
      dbUpdateUser(modal.id, { name: form.name, email: form.email, password: form.password, role: form.role })
    }
    await load()
    setSaving(false)
    setModal(null)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    dbDeleteUser(deleteConfirm.id)
    await load()
    setDeleteConfirm(null)
  }

  const logout = () => { setCurrentUser(null); nav('/') }

  if (loading) return (
    <div className="shell">
      <nav className="nav"><div className="logo"><div className="logo-mark">A</div>AssessIQ</div></nav>
      <div className="center"><span className="sp sp-lg" /></div>
    </div>
  )

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo" onClick={() => nav('/admin')} style={{ cursor: 'pointer' }}>
          <div className="logo-mark">A</div>AssessIQ
          <span style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 400, marginLeft: 3 }}>User Management</span>
        </div>
        <div className="nav-r">
          <button className="btn btn-g btn-sm" onClick={() => nav('/admin')}>Dashboard</button>
          <button className="btn btn-g btn-sm" onClick={() => nav('/admin/settings')}>Settings</button>
          <button className="btn btn-g btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.5px' }}>User Management</h1>
          <p style={{ color: 'var(--ink3)', marginTop: 4, fontSize: 13 }}>
            Manage who can access the admin portal and their permissions
          </p>
        </div>

        {/* Permission summary */}
        <div className="card card-xl" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Permission Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['View results & profiles',    true,  true,  true],
              ['Export Excel & reports',     true,  true,  true],
              ['Open report URLs',           true,  true,  true],
              ['Create roles & links',       true,  true,  false],
              ['Add notes to candidates',    true,  true,  false],
              ['Delete own roles',           true,  true,  false],
              ['Delete Admin roles',         true,  false, false],
              ['Delete candidate results',   true,  false, false],
              ['Change settings & API keys', true,  false, false],
              ['Manage users',               true,  false, false],
            ].map(([feature, admin, recruiter, viewer]) => (
              <div key={feature} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--paper2)', borderRadius: 8, fontSize: 13 }}>
                <span>{feature}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className={'badge ' + (admin ? 'bg' : 'br')} style={{ fontSize: 10 }}>Admin</span>
                  <span className={'badge ' + (recruiter ? 'bg' : 'br')} style={{ fontSize: 10 }}>Recruiter</span>
                  <span className={'badge ' + (viewer ? 'bg' : 'br')} style={{ fontSize: 10, background: viewer ? '#ede9fe' : '', color: viewer ? '#5b21b6' : '' }}>Viewer</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users table */}
        <div className="shdr">
          <div>
            <div className="stitle">Users</div>
            <div className="ssub">{users.length} user{users.length !== 1 ? 's' : ''} + 1 super admin</div>
          </div>
          <button className="btn btn-p btn-sm" onClick={openAdd}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add User
          </button>
        </div>

        <div className="tw">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th><th></th></tr>
            </thead>
            <tbody>
              {/* Super admin row */}
              <tr>
                <td>
                  <div style={{ fontWeight: 600 }}>Super Admin</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>Full access</div>
                </td>
                <td style={{ color: 'var(--ink2)' }}>admin</td>
                <td><span className="badge bg"><span className="dot" />Admin</span></td>
                <td style={{ fontSize: 12, color: 'var(--ink3)' }}>—</td>
                <td><span style={{ fontSize: 12, color: 'var(--ink3)' }}>Protected</span></td>
              </tr>
              {users.map(u => (
                <tr key={u.id}>
                  <td><div style={{ fontWeight: 600 }}>{u.name}</div></td>
                  <td style={{ fontSize: 13, color: 'var(--ink2)' }}>{u.email}</td>
                  <td>
                    <span className={'badge ' + (u.role === 'admin' ? 'bg' : u.role === 'viewer' ? 'ba' : 'bb')}>
                      <span className="dot" />
                      {u.role === 'admin' ? 'Admin' : u.role === 'viewer' ? 'Viewer' : 'Recruiter'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--ink3)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-s btn-sm" onClick={() => openEdit(u)}>Edit</button>
                      <button className="btn btn-g btn-sm" style={{ color: 'var(--bad)', fontSize: 12, padding: '4px 8px' }}
                        onClick={() => setDeleteConfirm(u)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)' }}>
                  No users yet. Add your first recruiter or admin above.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{modal === 'add' ? 'Add New User' : 'Edit User'}</h3>
            <div className="msub">
              {modal === 'add' ? 'Create a new admin, recruiter or viewer account.' : 'Update this user\'s details and permissions.'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div className="fg">
                <label className="fl">Full Name *</label>
                <input className="fi" placeholder="e.g. Sarah Jones" value={form.name}
                  onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErr('') }} />
              </div>
              <div className="fg">
                <label className="fl">Email *</label>
                <input className="fi" type="email" placeholder="sarah@company.com" value={form.email}
                  onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErr('') }} />
              </div>
              <div className="fg">
                <label className="fl">Password *</label>
                <input className="fi" type="password" placeholder="Set a password" value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErr('') }} />
              </div>
              <div className="fg">
                <label className="fl">Role</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['recruiter', 'admin', 'viewer'].map(role => (
                    <div key={role} onClick={() => setForm(p => ({ ...p, role }))}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: 9, border: '1.5px solid ' + (form.role === role ? 'var(--accent)' : 'var(--line)'), background: form.role === role ? 'var(--accent-dim)' : 'var(--paper)', cursor: 'pointer', transition: 'all .15s' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, textTransform: 'capitalize' }}>{role}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink3)', lineHeight: 1.5 }}>
                        {role === 'recruiter' ? 'Can create roles, view and export results' : role === 'admin' ? 'Full access including settings and users' : 'View and export only — cannot create or delete'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {err && <span className="ferr">{err}</span>}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button className="btn btn-s" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-p" style={{ flex: 1, justifyContent: 'center' }}
                onClick={save} disabled={saving}>
                {saving ? 'Saving...' : modal === 'add' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete User?</h3>
            <div className="msub">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? They will no longer be able to sign in. This cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={{ flex: 1, justifyContent: 'center', background: 'var(--bad)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', padding: '9px 18px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
