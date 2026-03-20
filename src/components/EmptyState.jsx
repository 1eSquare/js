export default function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-500" />
      </div>
      <p className="text-slate-300 font-medium mb-1">{title}</p>
      <p className="text-slate-500 text-sm mb-5 max-w-xs">{desc}</p>
      {action}
    </div>
  )
}
