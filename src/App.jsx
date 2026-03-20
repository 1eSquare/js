import { useState } from 'react'
import { LangContext, StoreContext, useLangStore, useJobs, useCVs, useAccounts } from './store/useStore'
import Sidebar from './components/Sidebar'
import ExtensionModal from './components/ExtensionModal'
import Dashboard from './pages/Dashboard'
import JobTracker from './pages/JobTracker'
import CVManager from './pages/CVManager'
import AccountVault from './pages/AccountVault'

function AppInner() {
  const [page, setPage] = useState('dashboard')
  const [showExt, setShowExt] = useState(false)

  const PAGES = {
    dashboard:    <Dashboard setPage={setPage} />,
    jobTracker:   <JobTracker />,
    cvManager:    <CVManager />,
    accountVault: <AccountVault />,
  }

  return (
    <div className="min-h-screen bg-surface-950 text-slate-200 font-sans">
      <Sidebar page={page} setPage={setPage} onExtension={() => setShowExt(true)} />

      {/* Main content */}
      <main className="ml-60 min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          {PAGES[page] ?? PAGES.dashboard}
        </div>
      </main>

      {showExt && <ExtensionModal onClose={() => setShowExt(false)} />}
    </div>
  )
}

export default function App() {
  const langStore = useLangStore()
  const jobsStore = useJobs()
  const cvsStore  = useCVs()
  const accStore  = useAccounts()

  const store = { ...jobsStore, ...cvsStore, ...accStore }

  return (
    <LangContext.Provider value={langStore}>
      <StoreContext.Provider value={store}>
        <AppInner />
      </StoreContext.Provider>
    </LangContext.Provider>
  )
}
