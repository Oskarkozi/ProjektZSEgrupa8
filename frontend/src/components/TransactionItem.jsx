import { getCategoryLabel, getCategoryColor, categories as allCategories } from "../utils/categories";
import { useT } from '../i18n';

// Komponent wyświetlający pojedynczą pozycję na liście
export default function TransactionItem({ category, amount, type, date, onClick, isPlanned = false, isDarkTheme = true }) {
  const t = useT();
  // Wykorzystujemy funkcje pomocnicze, które szukają w obu grupach (income i expense)
  const label = getCategoryLabel(category, t);
  const color = getCategoryColor(category);

  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center p-3 rounded-xl transition-colors cursor-pointer group ${isDarkTheme ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: color }}></div>

        <div className="flex flex-col">
          <span className={`font-medium transition-colors ${isDarkTheme ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>{label}</span>
          <span className={`text-xs ${isPlanned ? 'text-amber-500' : (isDarkTheme ? 'text-gray-500' : 'text-gray-600')}`}>{date}</span>
          {isPlanned && <span className="text-[11px] uppercase tracking-wider text-amber-400">{t('planned')}</span>}
        </div>
      </div>
      <span className={`font-bold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'} ${isPlanned ? 'opacity-80' : ''}`}>
        {type === 'income' ? '+' : '-'}${parseFloat(amount).toFixed(2)}
      </span>
    </div>
  );
}
