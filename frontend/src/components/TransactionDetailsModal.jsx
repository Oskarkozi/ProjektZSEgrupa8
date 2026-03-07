// Modal wyświetlający szczegóły transakcji
export default function TransactionDetailsModal({ transaction, onClose, onEdit, onDelete }) {
    if (!transaction) return null;
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div 
          className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">✕</button>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-100 mb-1">{transaction.category}</h3>
            <p className="text-gray-400 text-sm">{transaction.date}</p>
          </div>
  
          <div className="space-y-6">
               <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Kwota</p>
                  <p className={`text-3xl font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                     {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                  </p>
               </div>
  
               {transaction.description && (
                 <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Opis</p>
                    <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
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
                  Edytuj
               </button>
               <button 
                  onClick={() => onDelete(transaction)} 
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors"
               >
                  Usuń
               </button>
          </div>
        </div>
      </div>
    );
  }
