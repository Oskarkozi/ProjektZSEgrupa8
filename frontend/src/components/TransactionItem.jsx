import { getCategoryLabel, getCategoryColor, categories as allCategories } from "../utils/categories"; // Poprawiono import

// Komponent wyświetlający pojedynczą pozycję na liście
export default function TransactionItem({ category, amount, type, date, onClick }) {
  // Wykorzystujemy funkcje pomocnicze, które szukają w obu grupach (income i expense)
  const label = getCategoryLabel(category);
  const color = getCategoryColor(category);

    return (
      <div 
        onClick={onClick}
        className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: color }}></div>
    
         <div className="flex flex-col">
            <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{label}</span>
            <span className="text-gray-500 text-xs">{date}</span>
         </div>
         </div>
         <span className={`font-bold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
           {type === 'income' ? '+' : '-'}${parseFloat(amount).toFixed(2)}
         </span>
      </div>
    );
  }
