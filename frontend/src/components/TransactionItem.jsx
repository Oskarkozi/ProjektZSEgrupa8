// Komponent wyświetlający pojedynczą pozycję na liście
export default function TransactionItem({ category, amount, type, date, onClick }) {
    return (
      <div 
        onClick={onClick}
        className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer group"
      >
         <div className="flex flex-col">
            <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{category}</span>
            <span className="text-gray-500 text-xs">{date}</span>
         </div>
         <span className={`font-bold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
           {type === 'income' ? '+' : '-'}${parseFloat(amount).toFixed(2)}
         </span>
      </div>
    );
  }
