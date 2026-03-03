import { useState } from 'react';

export default function TransactionForm({ userId, onSaveTransaction, onCloseForm }){
    const [selectedType, setSelectedType] = useState('income');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');

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

    onSaveTransaction(userId, category.trim(), parsedAmount, selectedType);

    
    setCategory('');
    setAmount('');
    setSelectedType('income'); 
    onCloseForm();
  };
    return(
        <div>
            <p className="text-gray-400 text-sm mb-1">Dodaj transakcję</p>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50">
            <form onSubmit={handleSubmit}>
  <div className="mb-3">
            <label htmlFor="category" className="block text-gray-400 text-sm font-medium mb-1">Kategoria</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
              placeholder="Np. Zakupy spożywcze"
              required
            />
          </div>

          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-400 text-sm font-medium mb-1">Kwota</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
              placeholder="Np. 50"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          
          <div className="mb-6 space-x-4"> 
            <label className="inline-flex items-center text-gray-200">
              <input
                type="radio"
                name="expenseOrIncome"
                value="income"
                checked={selectedType === 'income'}
                onChange={handleTypeChange}
                className="form-radio text-emerald-500" 
              />
              <span className="ml-2">Dochód</span>
            </label>
            <label className="inline-flex items-center text-gray-200">
              <input
                type="radio"
                name="expenseOrIncome"
                value="expense"
                checked={selectedType === 'expense'}
                onChange={handleTypeChange}
                className="form-radio text-red-500"
              />
              <span className="ml-2">Wydatek</span>
            </label>
          </div>

         
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Dodaj transakcję
          </button>
        </form>
            </div>
        </div> 
    );
}