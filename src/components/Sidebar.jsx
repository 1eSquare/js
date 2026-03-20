import { LayoutDashboard, Briefcase, FileText, KeyRound, Puzzle, Globe } from 'lucide-react'
import { useLang } from '../store/useStore'

const NAV = [
  { key: 'dashboard',    icon: LayoutDashboard, labelKey: 'dashboard'    },
  { key: 'jobTracker',   icon: Briefcase,        labelKey: 'jobTracker'   },
  { key: 'cvManager',    icon: FileText,         labelKey: 'cvManager'    },
  { key: 'accountVault', icon: KeyRound,         labelKey: 'accountVault' },
]

export default function Sidebar({ page, setPage, onExtension }) {
  const { t, lang, setLang } = useLang()

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-surface-900 border-r border-surface-700 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-900/40">
            AP
          </div>
          <span className="text-base font-semibold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
            ApplyPilot
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ key, icon: Icon, labelKey }) => {
          const active = page === key
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left
                ${active
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800'
                }`}
            >
              <Icon size={16} className={active ? 'text-indigo-400' : 'text-slate-500'} />
              {t(labelKey)}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2 border-t border-surface-700 pt-3">
        {/* Language toggle */}
        <div className="flex items-center gap-2 px-3 py-2">
          <Globe size={14} className="text-slate-500 shrink-0" />
          <span className="text-xs text-slate-500 flex-1">{t('language')}</span>
          <div className="flex rounded-md overflow-hidden border border-surface-700">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('zh')}
              className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                lang === 'zh' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              中文
            </button>
          </div>
        </div>

        {/* Get Extension */}
        <button
          onClick={onExtension}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border border-indigo-500/30 text-indigo-300 hover:from-indigo-600/40 hover:to-violet-600/40 transition-all duration-150 text-sm font-medium"
        >
          <Puzzle size={16} className="text-violet-400 shrink-0" />
          {t('getExtension')}
        </button>
      </div>
    </aside>
  )
}
