import { useState } from 'react';
import { categories } from '../utils/categories';
import { set } from 'firebase/database';

export default function TransactionForm({ userId, onSaveTransaction, onCloseForm, initialData = null, isEditing = false, isDarkTheme = true }){
    const [selectedType, setSelectedType] = useState(initialData?.type || 'income');
    const [category, setCategory] = useState(initialData?.category || '');
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(initialData?.description || '');

    // Dostępne kategorie w zależności od wybranego typu (income/expense)
    const availableCategories = categories[selectedType] || {};

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setCategory(''); // Czyścimy kategorię przy zmianie typu
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Proszę wprowadź poprawną kwotę');
      return;
    }

    onSaveTransaction(userId, category.trim(), parsedAmount, selectedType, date, description.trim());

    if (!isEditing) {
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
        <h2 className={`text-xl font-bold mb-4 ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>{isEditing ? 'Edytuj transakcję' : 'Nowa transakcja'}</h2>
        <div className={`rounded-xl p-6 border ${isDarkTheme ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-300'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-end pb-3 space-x-6"> 
                    <label className={`inline-flex items-center cursor-pointer transition-colors ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                      <input
                        type="radio"
                        name="expenseOrIncome"
                        value="income"
                        checked={selectedType === 'income'}
                        onChange={handleTypeChange}
                        className={`w-4 h-4 text-emerald-500 ${isDarkTheme ? 'bg-gray-700 border-gray-600 focus:ring-offset-gray-800' : 'bg-white border-gray-300 focus:ring-offset-white'} focus:ring-emerald-500`} 
                      />
                      <span className="ml-2 text-sm">Dochód</span>
                    </label>
                    <label className={`inline-flex items-center cursor-pointer transition-colors ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                      <input
                        type="radio"
                        name="expenseOrIncome"
                        value="expense"
                        checked={selectedType === 'expense'}
                        onChange={handleTypeChange}
                        className={`w-4 h-4 text-red-500 ${isDarkTheme ? 'bg-gray-700 border-gray-600 focus:ring-offset-gray-800' : 'bg-white border-gray-300 focus:ring-offset-white'} focus:ring-red-500`}
                      />
                      <span className="ml-2 text-sm">Wydatek</span>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="category" className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Kategoria</label>
                    <select id="category"
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                     className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-900/50 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    >
                      <option value="" disabled hidden>Wybierz kategorię</option>
                      {Object.values(availableCategories).map((cat)=>(
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                      </select>
                  </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label htmlFor="date" className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Data</label>
                     <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-900/50 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                     />
                  </div>
                   <div>
                      <label htmlFor="amount" className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Kwota</label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-900/50 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
               </div>

                <div>
                    <label htmlFor="description" className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Opis (opcjonalnie)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors min-h-20 ${isDarkTheme ? 'bg-gray-900/50 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Dodatkowe informacje..."
                    />
                </div>

              <div className="pt-4 flex justify-end gap-3">
                 <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/20"
                 >
                    {isEditing ? 'Zapisz zmiany' : 'Dodaj transakcję'}
                  </button>
              </div>
            </form>
            </div>
        </div> 
    );
}