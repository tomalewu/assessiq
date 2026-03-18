import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home        from './pages/Home'
import AdminLogin  from './pages/AdminLogin'
import Dashboard   from './pages/Dashboard'
import Assessment  from './pages/Assessment'
import ResultsPage from './pages/ResultsPage'
import Settings    from './pages/Settings'

// Simple admin auth via sessionStorage
export function isAdminAuthed() { return sessionStorage.getItem('adminOk') === '1' }
export function setAdminAuth(v) { v ? sessionStorage.setItem('adminOk','1') : sessionStorage.removeItem('adminOk') }

function RequireAdmin({ children }) {
  return isAdminAuthed() ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"              element={<Home />} />
      <Route path="/admin/login"   element={<AdminLogin />} />
      <Route path="/admin"         element={<RequireAdmin><Dashboard /></RequireAdmin>} />
      {/* Candidate route — this is the link you send candidates */}
      <Route path="/assess/:linkId" element={<Assessment />} />
      <Route path="/results"        element={<ResultsPage />} />
      <Route path="/admin/settings"  element={<RequireAdmin><Settings /></RequireAdmin>} />
      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}
