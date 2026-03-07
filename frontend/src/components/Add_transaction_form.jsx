import { useState } from 'react';

export default function TransactionForm({ userId, onSaveTransaction, onCloseForm, initialData = null }){
    const [selectedType, setSelectedType] = useState(initialData?.type || 'income');
    const [category, setCategory] = useState(initialData?.category || '');
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(initialData?.description || '');

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Proszę wprowadź poprawną kwotę');
      return;
    }

    onSaveTransaction(userId, category.trim(), parsedAmount, selectedType, date, description.trim());

    if (!initialData) {
      setCategory('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setSelectedType('income');
    }
    onCloseForm();
  };

    return(
        <div>
            <h2 className="text-xl font-bold text-gray-100 mb-4">{initialData ? 'Edytuj transakcję' : 'Nowa transakcja'}</h2>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Kategoria</label>
                    <input
                      type="text"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      placeholder="Np. Zakupy"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Kwota</label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label htmlFor="date" className="block text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Data</label>
                     <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        required
                     />
                  </div>
                   <div className="flex items-end pb-3 space-x-6"> 
                    <label className="inline-flex items-center text-gray-300 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="radio"
                        name="expenseOrIncome"
                        value="income"
                        checked={selectedType === 'income'}
                        onChange={handleTypeChange}
                        className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-500 focus:ring-offset-gray-800" 
                      />
                      <span className="ml-2 text-sm">Dochód</span>
                    </label>
                    <label className="inline-flex items-center text-gray-300 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="radio"
                        name="expenseOrIncome"
                        value="expense"
                        checked={selectedType === 'expense'}
                        onChange={handleTypeChange}
                        className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500 focus:ring-offset-gray-800"
                      />
                      <span className="ml-2 text-sm">Wydatek</span>
                    </label>
                  </div>
               </div>

                <div>
                    <label htmlFor="description" className="block text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Opis (opcjonalnie)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors min-h-[80px]"
                        placeholder="Dodatkowe informacje..."
                    />
                </div>

              <div className="pt-4 flex justify-end gap-3">
                 <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/20"
                 >
                    {initialData ? 'Zapisz zmiany' : 'Dodaj transakcję'}
                  </button>
              </div>
            </form>
            </div>
        </div> 
    );
}