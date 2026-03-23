import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home        from './pages/Home'
import AdminLogin  from './pages/AdminLogin'
import Dashboard   from './pages/Dashboard'
import Assessment  from './pages/Assessment'
import ResultsPage from './pages/ResultsPage'
import Settings    from './pages/Settings'
import Users       from './pages/Users'
import Help        from './pages/Help'

// ─── Session storage for current user ─────────────────────────────────────────
export function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('aiq_user') || 'null') } catch { return null }
}
export function setCurrentUser(u) {
  if (u) sessionStorage.setItem('aiq_user', JSON.stringify(u))
  else    sessionStorage.removeItem('aiq_user')
}
export function isAdmin()     { const u = getCurrentUser(); return u && u.role === 'admin' }
export function isRecruiter() { const u = getCurrentUser(); return u && u.role === 'recruiter' }
export function isLoggedIn()  { return !!getCurrentUser() }

function RequireAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to="/admin/login" replace />
}
function RequireAdmin({ children }) {
  return isAdmin() ? children : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<Home />} />
      <Route path="/admin/login"     element={<AdminLogin />} />
      <Route path="/admin"           element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/admin/settings"  element={<RequireAdmin><Settings /></RequireAdmin>} />
      <Route path="/admin/users"     element={<RequireAdmin><Users /></RequireAdmin>} />
      <Route path="/assess/:linkId"  element={<Assessment />} />
      <Route path="/results"         element={<ResultsPage />} />
      <Route path="/admin/help"       element={<RequireAuth><Help /></RequireAuth>} />
      <Route path="*"                element={<Navigate to="/" replace />} />
    </Routes>
  )
}
