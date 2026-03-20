import { useState } from 'react'
import { Plus, Eye, EyeOff, Copy, Pencil, Trash2, KeyRound, Check } from 'lucide-react'
import { useLang, useAppStore } from '../store/useStore'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'

const EMPTY_FORM = { company: '', username: '', password: '', notes: '' }

function AccountForm({ initial, onSave, onCancel }) {
  const { t } = useLang()
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const [showPw, setShowPw] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.company.trim() && form.username.trim()

  return (
    <div className="space-y-4">
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
        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('username')} *</label>
        <input
          value={form.username}
          onChange={e => set('username', e.target.value)}
          placeholder={t('usernamePlaceholder')}
          autoComplete="off"
          className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('password')}</label>
        <div className="relative">
          <input
            value={form.password}
            onChange={e => set('password', e.target.value)}
            type={showPw ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            autoComplete="new-password"
            className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 pr-10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t('notes')}</label>
        <input
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder={t('notesPlaceholder')}
          className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
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

function CopyButton({ text }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      onClick={handle}
      className={`p-1.5 rounded-md transition-colors ${copied ? 'text-green-400' : 'text-slate-600 hover:text-slate-300'}`}
      title={copied ? t('copied') : t('copy')}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

function PasswordCell({ password }) {
  const { t } = useLang()
  const [show, setShow] = useState(false)
  if (!password) return <span className="text-slate-600 text-xs">—</span>
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-slate-300 font-mono">
        {show ? password : '●'.repeat(Math.min(password.length, 10))}
      </span>
      <button
        onClick={() => setShow(v => !v)}
        className="p-1 text-slate-600 hover:text-slate-400 transition-colors"
        title={show ? t('hidePassword') : t('showPassword')}
      >
        {show ? <EyeOff size={12} /> : <Eye size={12} />}
      </button>
      <CopyButton text={password} />
    </div>
  )
}

export default function AccountVault() {
  const { t } = useLang()
  const { accounts, addAccount, updateAccount, deleteAccount } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{t('accountVaultTitle')}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{t('accountVaultSubtitle')}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus size={16} />
          {t('addAccount')}
        </button>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-2 bg-amber-950/40 border border-amber-800/40 rounded-lg px-4 py-3">
        <KeyRound size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/80">{t('securityNote')}</p>
      </div>

      {/* Table */}
      {accounts.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title={t('noAccountsYet')}
          desc={t('noAccountsDesc')}
          action={
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors"
            >
              {t('addAccount')}
            </button>
          }
        />
      ) : (
        <div className="bg-surface-900 border border-surface-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700">
                  {[t('company'), t('username'), t('password'), t('notes'), t('actions')].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {accounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-surface-800/40 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-xs shrink-0">
                          {acc.company?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="text-sm font-medium text-slate-200 whitespace-nowrap">{acc.company}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-300 font-mono">{acc.username}</span>
                        <CopyButton text={acc.username} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PasswordCell password={acc.password} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500 max-w-xs truncate block">{acc.notes || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditing(acc)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(t('confirmDelete'))) deleteAccount(acc.id) }}
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

      {showAdd && (
        <Modal title={t('addAccount')} onClose={() => setShowAdd(false)}>
          <AccountForm
            initial={{}}
            onSave={(form) => { addAccount(form); setShowAdd(false) }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title={t('editAccount')} onClose={() => setEditing(null)}>
          <AccountForm
            initial={editing}
            onSave={(form) => { updateAccount(editing.id, form); setEditing(null) }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  )
}
