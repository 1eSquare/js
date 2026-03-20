import { STATUS_STYLES } from '../i18n'
import { useLang } from '../store/useStore'

export default function StatusBadge({ status }) {
  const { t } = useLang()
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.wishlist

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {t(status)}
    </span>
  )
}
