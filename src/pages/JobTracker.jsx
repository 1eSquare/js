import { useState } from 'react'
import { Plus, ExternalLink, Pencil, Trash2, Briefcase, Search } from 'lucide-react'
import { useLang, useAppStore } from '../store/useStore'
import { STATUS_KEYS } from '../i18n'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const EMPTY_FORM = { company: '', role: '', status: 'wishlist', url: '', cvId: '', notes: '' }

function JobForm({ initial, onSave, onCancel }) {
  const { t } = useLang()
  const { cvs } = useAppStore()
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const valid = form.company.trim() && form.role.trim()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('companyName')} *</label>
          <input
            value={form.company}
            onChange={e => set('company', e.target.value)}
            placeholder={t('companyPlaceholder')}
            className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('jobTitle')} *</label>
          <input
            value={form.role}
            onChange={e => set('role', e.target.value)}
            placeholder="Software Engineer"
            className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('applicationStatus')}</label>
          <select
            value={form.status}
            onChange={e => set('status', e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
          >
            {STATUS_KEYS.map(s => (
              <option key={s} value={s}>{t(s)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('linkedCV')}</label>
          <select
            value={form.cvId}
            onChange={e => set('cvId', e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
          >
            <option value="">{t('noCV')}</option>
            {cvs.map(cv => (
              <option key={cv.id} value={cv.id}>{cv.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('applicationLink')}</label>
        <input
          value={form.url}
          onChange={e => set('url', e.target.value)}
          placeholder="https://jobs.company.com/apply/..."
          className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('notes')}</label>
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder={t('notesPlaceholder')}
          rows={3}
          className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-surface-800 disabled:text-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t('save')}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-surface-800 hover:bg-surface-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  )
}

export default function JobTracker() {
  const { t } = useLang()
  const { jobs, addJob, updateJob, deleteJob, cvs } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = jobs.filter(j => {
    const matchStatus = filterStatus === 'all' || j.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q || j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const cvMap = Object.fromEntries(cvs.map(c => [c.id, c.name]))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{t('jobTrackerTitle')}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{t('jobTrackerSubtitle')}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus size={16} />
          {t('addNewJob')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchJobs')}
            className="w-full pl-9 pr-3 py-2 bg-surface-900 border border-surface-700 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 shrink-0"
        >
          <option value="all">{t('allStatuses')}</option>
          {STATUS_KEYS.map(s => <option key={s} value={s}>{t(s)}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={jobs.length === 0 ? t('noJobsTracked') : t('noResults')}
          desc={jobs.length === 0 ? t('noJobsTrackedDesc') : ''}
          action={jobs.length === 0 && (
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors"
            >
              {t('addNewJob')}
            </button>
          )}
        />
      ) : (
        <div className="bg-surface-900 border border-surface-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700">
                  {[t('company'), t('role'), t('status'), t('linkedCV'), t('applyLink'), t('date'), t('actions')].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {filtered.map(job => (
                  <tr key={job.id} className="hover:bg-surface-800/40 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
                          {job.company?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="text-sm font-medium text-slate-200 whitespace-nowrap">{job.company}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-300 whitespace-nowrap">{job.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">{cvMap[job.cvId] || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {job.url ? (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <ExternalLink size={12} />
                          {t('visit')}
                        </a>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600 whitespace-nowrap">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditing(job)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(t('confirmDelete'))) deleteJob(job.id) }}
                          className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes tooltip area — show notes on expanded row on mobile could be added later */}

      {/* Add Modal */}
      {showAdd && (
        <Modal title={t('addNewJob')} onClose={() => setShowAdd(false)} size="lg">
          <JobForm
            initial={{}}
            onSave={(form) => { addJob(form); setShowAdd(false) }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal title={t('editJob')} onClose={() => setEditing(null)} size="lg">
          <JobForm
            initial={editing}
            onSave={(form) => { updateJob(editing.id, form); setEditing(null) }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  )
}
