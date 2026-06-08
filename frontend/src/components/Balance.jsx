import { useT } from '../i18n';

export default function BalanceCard({ total, income, expenses, isDarkTheme }) {
  const t = useT();

  return (
    <div className={`rounded-2xl p-6 shadow-lg border ${isDarkTheme ? 'bg-gray-800 border-gray-700/50' : 'bg-gray-200 border-gray-300'}`}>
      <div className="mb-2">
        <p className={`text-sm mb-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{t('dashboardBalance')}</p>
        <h2 className={`text-3xl font-bold tracking-tight ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>${total}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-gray-700/50 pt-4">
        <div>
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{t('income')}</p>
          <p className={`text-emerald-400 font-semibold ${isDarkTheme ? 'text-emerald-400' : 'text-emerald-600'}`}>${income}</p>
        </div>
        <div className="text-right">
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{t('expenses')}</p>
          <p className={`text-red-400 font-semibold ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>${expenses}</p>
        </div>
      </div>
    </div>
  );
}