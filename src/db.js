// ─── Database: localStorage + Firebase Firestore sync ─────────────────────────
const LS = {
  roles:      'aiq_roles',
  candidates: 'aiq_candidates',
  settings:   'aiq_settings',
}
function lsLoad(k)    { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSave(k, d) { try { localStorage.setItem(k, JSON.stringify(d)) } catch {} }
function lsArr(k)     { const v = lsLoad(k); return Array.isArray(v) ? v : [] }
function genId(p)     { return p + Date.now().toString(36) + Math.random().toString(36).slice(2,5) }

// ─── Firebase ─────────────────────────────────────────────────────────────────
const FB_CFG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}
const HAS_FIREBASE = !!FB_CFG.projectId
let _db = null

async function getDB() {
  if (!HAS_FIREBASE) return null
  if (_db) return _db
  try {
    const { initializeApp, getApps, getApp } = await import('firebase/app')
    const { getFirestore } = await import('firebase/firestore')
    const app = getApps().length ? getApp() : initializeApp(FB_CFG)
    _db = getFirestore(app)
    return _db
  } catch { return null }
}

async function fbSet(col, id, data) {
  try {
    const db = await getDB(); if (!db) return
    const { doc, setDoc } = await import('firebase/firestore')
    await setDoc(doc(db, col, id), data)
  } catch(e) { console.warn('fbSet', e.message) }
}
async function fbMerge(col, id, data) {
  try {
    const db = await getDB(); if (!db) return
    const { doc, setDoc } = await import('firebase/firestore')
    await setDoc(doc(db, col, id), data, { merge: true })
  } catch(e) { console.warn('fbMerge', e.message) }
}
async function fbDelete(col, id) {
  try {
    const db = await getDB(); if (!db) return
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc(db, col, id))
  } catch(e) { console.warn('fbDelete', e.message) }
}
async function fbGetAll(col) {
  try {
    const db = await getDB(); if (!db) return null
    const { collection, getDocs } = await import('firebase/firestore')
    const snap = await getDocs(collection(db, col))
    if (snap.empty) return null
    return snap.docs.map(d => d.data())
  } catch(e) { console.warn('fbGetAll', e.message); return null }
}

// ─── SETTINGS (password, API key) ─────────────────────────────────────────────
export function dbGetSettings() {
  return lsLoad(LS.settings) || { password: 'admin123', anthropicKey: '' }
}
export function dbSaveSettings(d) {
  const s = { ...dbGetSettings(), ...d }
  lsSave(LS.settings, s)
  fbSet('settings', 'main', s)
}
export async function dbLoadSettings() {
  try {
    const db = await getDB(); if (!db) return dbGetSettings()
    const { doc, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(doc(db, 'settings', 'main'))
    if (snap.exists()) { const s = snap.data(); lsSave(LS.settings, s); return s }
  } catch {}
  return dbGetSettings()
}

// ─── ROLES ─────────────────────────────────────────────────────────────────────
export function dbAddRole(d) {
  const roles = lsArr(LS.roles)
  const o = {
    ...d,
    id:         genId('r'),
    linkId:     Math.random().toString(36).slice(2, 10),
    threshold:  d.threshold || 12,   // default pass mark out of 20
    createdAt:  new Date().toISOString()
  }
  roles.push(o)
  lsSave(LS.roles, roles)
  fbSet('roles', o.id, o)
  return o
}
export function dbUpdateRole(id, d) {
  const roles = lsArr(LS.roles)
  const i = roles.findIndex(r => r.id === id)
  if (i !== -1) { roles[i] = { ...roles[i], ...d }; lsSave(LS.roles, roles) }
  fbMerge('roles', id, d)
}
export function dbDeleteRole(id) {
  lsSave(LS.roles, lsArr(LS.roles).filter(r => r.id !== id))
  fbDelete('roles', id)
}
export async function dbRoles() {
  const remote = await fbGetAll('roles')
  if (remote) { lsSave(LS.roles, remote); return remote }
  return lsArr(LS.roles)
}
export async function dbRoleByLink(linkId) {
  const roles = await dbRoles()
  return roles.find(r => r.linkId === linkId) || null
}

// ─── CANDIDATES ────────────────────────────────────────────────────────────────
export function dbAddCandidate(d) {
  const cands = lsArr(LS.candidates)
  const o = { ...d, id: genId('c'), startedAt: new Date().toISOString(), status: 'pending', notes: '' }
  cands.push(o)
  lsSave(LS.candidates, cands)
  fbSet('candidates', o.id, o)
  return o
}
export function dbSaveCandidate(id, d) {
  const cands = lsArr(LS.candidates)
  const i = cands.findIndex(c => c.id === id)
  if (i !== -1) { cands[i] = { ...cands[i], ...d }; lsSave(LS.candidates, cands) }
  fbMerge('candidates', id, d)
}
export function dbDeleteCandidate(id) {
  lsSave(LS.candidates, lsArr(LS.candidates).filter(c => c.id !== id))
  fbDelete('candidates', id)
}
export async function dbAllCandidates() {
  const remote = await fbGetAll('candidates')
  if (remote) { lsSave(LS.candidates, remote); return remote }
  return lsArr(LS.candidates)
}
export async function dbCandidatesByRole(roleId) {
  const all = await dbAllCandidates()
  return all.filter(c => c.roleId === roleId)
}
