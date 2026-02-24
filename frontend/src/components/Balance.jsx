export default function BalanceCard({ total, income, expenses }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50">
      <div className="mb-2">
        <p className="text-gray-400 text-sm mb-1">Bilans</p>
        <h2 className="text-3xl font-bold tracking-tight">${total}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-gray-700/50 pt-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Przychód</p>
          <p className="text-emerald-400 font-semibold">${income}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">Wydatki</p>
          <p className="text-red-400 font-semibold">${expenses}</p>
        </div>
      </div>
    </div>
  );
}