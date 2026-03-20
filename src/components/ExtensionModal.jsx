import { Puzzle, Zap, Shield, Globe, Bell } from 'lucide-react'
import { useLang } from '../store/useStore'
import Modal from './Modal'

export default function ExtensionModal({ onClose }) {
  const { t } = useLang()

  return (
    <Modal title={t('extensionTitle')} onClose={onClose} size="md">
      <div className="space-y-5">
        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-xl p-5 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <Puzzle size={28} className="text-white" />
          </div>
          <span className="inline-block px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-full mb-3">
            {t('comingSoon')}
          </span>
          <p className="text-sm text-slate-300 leading-relaxed">{t('extensionDesc')}</p>
        </div>

        {/* Features */}
        <div className="space-y-2.5">
          {[
            { icon: Zap,    text: t('extensionFeature1') },
            { icon: Shield, text: t('extensionFeature2') },
            { icon: Globe,  text: t('extensionFeature3') },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-3 py-2.5 bg-surface-800/60 rounded-lg">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-indigo-400" />
              </div>
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/40"
        >
          <Bell size={15} />
          {t('notifyMe')}
        </button>
      </div>
    </Modal>
  )
}
