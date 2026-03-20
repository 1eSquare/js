import { useState, useRef } from 'react'
import { Upload, FileText, Trash2, Eye, Pencil, Check, X, AlertTriangle } from 'lucide-react'
import { useLang, useAppStore } from '../store/useStore'
import EmptyState from '../components/EmptyState'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function CVCard({ cv, onDelete, onRename, onPreview }) {
  const { t } = useLang()
  const [renaming, setRenaming] = useState(false)
  const [draft, setDraft] = useState(cv.name)

  const confirmRename = () => {
    if (draft.trim()) onRename(cv.id, draft.trim())
    setRenaming(false)
  }

  const ext = cv.fileName?.split('.').pop()?.toUpperCase() ?? 'FILE'
  const isPDF = cv.fileName?.toLowerCase().endsWith('.pdf')

  return (
    <div className="bg-surface-900 border border-surface-700 rounded-xl p-4 flex items-center gap-4 hover:border-surface-600 transition-colors group">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
        <FileText size={20} className="text-indigo-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {renaming ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') setRenaming(false) }}
              className="flex-1 bg-surface-800 border border-indigo-500 rounded-md px-2 py-1 text-sm text-slate-200 focus:outline-none"
            />
            <button onClick={confirmRename} className="p-1 text-green-400 hover:text-green-300">
              <Check size={14} />
            </button>
            <button onClick={() => setRenaming(false)} className="p-1 text-slate-500 hover:text-slate-300">
              <X size={14} />
            </button>
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-200 truncate">{cv.name}</p>
        )}
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs px-1.5 py-0.5 rounded bg-surface-800 text-slate-500 font-mono">{ext}</span>
          <span className="text-xs text-slate-600">{formatBytes(cv.fileSize)}</span>
          <span className="text-xs text-slate-600">{new Date(cv.uploadedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {isPDF && (
          <button
            onClick={() => onPreview(cv)}
            title={t('preview')}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            <Eye size={15} />
          </button>
        )}
        <button
          onClick={() => { setDraft(cv.name); setRenaming(true) }}
          title={t('rename')}
          className="p-2 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(cv.id)}
          title={t('delete')}
          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

export default function CVManager() {
  const { t } = useLang()
  const { cvs, addCV, updateCV, deleteCV } = useAppStore()
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [naming, setNaming] = useState(null) // { file, dataUrl }
  const [nameInput, setNameInput] = useState('')

  const processFile = (file) => {
    setError('')
    if (file.size > MAX_SIZE) { setError(`File too large (max 10 MB)`); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      setNaming({ file, dataUrl: e.target.result })
      setNameInput(file.name.replace(/\.[^.]+$/, ''))
    }
    reader.readAsDataURL(file)
  }

  const handleFiles = (files) => {
    const file = files[0]
    if (file) processFile(file)
  }

  const confirmUpload = () => {
    if (!nameInput.trim() || !naming) return
    addCV({
      name: nameInput.trim(),
      fileName: naming.file.name,
      fileSize: naming.file.size,
      dataUrl: naming.dataUrl,
    })
    setNaming(null)
    setNameInput('')
  }

  const handlePreview = (cv) => {
    const win = window.open()
    win.document.write(`<iframe src="${cv.dataUrl}" style="width:100%;height:100vh;border:none"></iframe>`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{t('cvManagerTitle')}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{t('cvManagerSubtitle')}</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-surface-700 hover:border-indigo-500/50 hover:bg-surface-800/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <Upload size={28} className={`mx-auto mb-3 ${dragging ? 'text-indigo-400' : 'text-slate-500'}`} />
        <p className="text-sm font-medium text-slate-300">{t('dragDropCV')}</p>
        <p className="text-xs text-slate-600 mt-1">{t('cvFormats')}</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/40 border border-red-800/40 rounded-lg px-4 py-3">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {/* Name input after file selected */}
      {naming && (
        <div className="bg-surface-900 border border-indigo-500/40 rounded-xl p-4 space-y-3">
          <p className="text-xs text-slate-400 font-medium">{t('cvName')}</p>
          <div className="flex gap-3">
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmUpload() }}
              placeholder={t('cvNamePlaceholder')}
              className="flex-1 bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            />
            <button
              onClick={confirmUpload}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t('uploadCV')}
            </button>
            <button
              onClick={() => setNaming(null)}
              className="px-3 py-2 bg-surface-800 hover:bg-surface-700 text-slate-400 text-sm rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-slate-600">{naming.file.name} — {formatBytes(naming.file.size)}</p>
        </div>
      )}

      {/* CV list */}
      {cvs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t('noCVsYet')}
          desc={t('noCVsDesc')}
        />
      ) : (
        <div className="space-y-3">
          {cvs.map(cv => (
            <CVCard
              key={cv.id}
              cv={cv}
              onDelete={(id) => { if (window.confirm(t('confirmDelete'))) deleteCV(id) }}
              onRename={(id, name) => updateCV(id, { name })}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}

      {/* Storage note */}
      <p className="text-xs text-slate-600 flex items-center gap-1.5">
        <AlertTriangle size={12} />
        {t('storageTip')}
      </p>
    </div>
  )
}
