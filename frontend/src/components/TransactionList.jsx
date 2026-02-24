function TransactionItem({ name, amount, type }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
       <span className="text-gray-200">{name}</span>
       <span className={type === 'income' ? 'text-emerald-400' : 'text-red-400'}>
         {type === 'income' ? '+' : '-'}${amount}
       </span>
    </div>
  );
}

export default function TransactionList() {
  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-200">Ostatnie transakcje</h3>
        <button className="text-emerald-400 text-sm hover:underline font-medium">Więcej</button>
      </div>
      <div className="space-y-3">
        {/* Przykład użycia - docelowo tutaj będzie .map() z danych z API */}
        <TransactionItem name="Zakupy spożywcze" amount={50} type="expense" />
        <TransactionItem name="Wypłata" amount={2500} type="income" />
      </div>
    </div>
  );
}