import { useT } from '../i18n';
import { getCategoryLabel } from '../utils/categories';

export default function TransactionDetailsModal({ transaction, onClose, onEdit, onDelete, onRepeat, isDarkTheme = true }) {
  if (!transaction) return null;
  const t = useT();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200 border ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute top-4 right-4 transition-colors ${isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>✕</button>

        <div className="mb-6">
          <h3 className={`text-2xl font-bold mb-1 ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>{getCategoryLabel(transaction.category, t)}</h3>
          <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{transaction.date}</p>
        </div>

        <div className="space-y-6">
          <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{t('amountLabel')}</p>
            <p className={`text-3xl font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
              {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
            </p>
          </div>

          {transaction.description && (
            <div>
              <p className={`text-xs uppercase tracking-wider mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{t('descriptionOptional')}</p>
              <p className={`text-sm leading-relaxed p-3 rounded-lg border ${isDarkTheme ? 'text-gray-300 bg-gray-800/30 border-gray-700/30' : 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                {transaction.description}
              </p>
            </div>
          )}
        </div>

        <div className="pt-8 flex gap-3">
          <button
            onClick={() => onEdit(transaction)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {t('editTransaction')}
          </button>
          <button
            onClick={() => onDelete(transaction)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {t('deleteTransaction')}
          </button>
        </div>
        <button
          className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm float-left mt-4"
          onClick={() => onRepeat({ ...transaction, date: new Date().toISOString().split('T')[0] })}
        >
          {t('repeatTransaction')}
        </button>
      </div>
    </div>
  );
}
