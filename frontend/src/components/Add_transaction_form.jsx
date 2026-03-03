import { useState } from 'react';
import { createRoot } from 'react-dom/client';
export default function TransactionForm(){
    const [selectedState, setSelectedState] = useState('income');

  const handleChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleSubmit = (event) => {
    alert(`Zaznaczyłeś: ${selectedState}`);
    event.preventDefault();
  };
    return(
        <div>
            <p className="text-gray-400 text-sm mb-1">Dodaj transakcję</p>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50">
            <form onSubmit={handleSubmit}>
  <label>
    <input
      type="radio"
      name="expenseOrIncome"
      value="income"
      checked={selectedState === 'income'}
      onChange={handleChange}
    />
    Dochód
  </label>
        <br></br>
  <label>
    <input
      type="radio"
      name="expenseOrIncome"
      value="expense"
      checked={selectedState === 'expense'}
      onChange={handleChange}
    />
    Wydatek
  </label>
<br></br>
  <button type="submit">Dodaj</button>
</form>
            </div>
        </div> 
    );
}