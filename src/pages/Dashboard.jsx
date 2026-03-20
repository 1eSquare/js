import { Briefcase, CheckCircle, MessageSquare, Trophy, XCircle, Star, ArrowRight } from 'lucide-react'
import { useLang, useAppStore } from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const STAT_CONFIG = [
  { key: 'wishlist',  icon: Star,          color: 'text-slate-300',  bg: 'bg-slate-800/60',   border: 'border-slate-600/40' },
  { key: 'applied',   icon: CheckCircle,   color: 'text-blue-300',   bg: 'bg-blue-950/60',    border: 'border-blue-500/30' },
  { key: 'interview', icon: MessageSquare, color: 'text-violet-300', bg: 'bg-violet-950/60',  border: 'border-violet-500/30' },
  { key: 'offer',     icon: Trophy,        color: 'text-green-300',  bg: 'bg-green-950/60',   border: 'border-green-500/30' },
]

function StatCard({ labelKey, count, icon: Icon, color, bg, border }) {
  const { t } = useLang()
  return (
    <div className={`${bg} border ${border} rounded-xl p-5 flex items-center justify-between`}>
      <div>
        <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">{t(labelKey)}</p>
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  )
}

export default function Dashboard({ setPage }) {
  const { t } = useLang()
  const { jobs } = useAppStore()

  const counts = {
    wishlist:  jobs.filter(j => j.status === 'wishlist').length,
    applied:   jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer:     jobs.filter(j => j.status === 'offer').length,
    rejected:  jobs.filter(j => j.status === 'rejected').length,
  }

  const recent = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{t('dashboardTitle')}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{t('dashboardSubtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CONFIG.map(cfg => (
          <StatCard key={cfg.key} labelKey={cfg.key} count={counts[cfg.key]} {...cfg} />
        ))}
      </div>

      {/* Total bar */}
      {jobs.length > 0 && (
        <div className="bg-surface-800/50 border border-surface-700 rounded-xl px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-400">{t('totalApplications')}</span>
          <span className="text-lg font-bold text-slate-100">{jobs.length}</span>
        </div>
      )}

      {/* Recent applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200">{t('recentApplications')}</h2>
          <button
            onClick={() => setPage('jobTracker')}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {t('jobTracker')} <ArrowRight size={12} />
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={t('noJobsYet')}
            desc={t('noJobsDesc')}
            action={
              <button
                onClick={() => setPage('jobTracker')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors"
              >
                {t('goToTracker')}
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {recent.map(job => (
              <div
                key={job.id}
                className="flex items-center gap-4 p-4 bg-surface-900 border border-surface-700 rounded-xl hover:border-surface-600 transition-colors"
              >
                {/* Company initial */}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
                  {job.company?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{job.company}</p>
                  <p className="text-xs text-slate-500 truncate">{job.role}</p>
                </div>
                <StatusBadge status={job.status} />
                <span className="text-xs text-slate-600 shrink-0">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
