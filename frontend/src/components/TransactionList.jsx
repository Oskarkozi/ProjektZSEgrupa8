import { useState } from "react";
import Form from "./Add_transaction_form.jsx";
import { getDatabase, ref, set, push } from "firebase/database";
import { auth } from "../services/firebase";



function writeUserData(userId, category, amount, type) {
  const db = getDatabase();
  
  const newExpenseRef = push(ref(db, 'users/' + userId + '/expenses')); 
  set(newExpenseRef, { 
    category: category,
    amount: amount,
    type: type,
    
  });
}

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
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  
  const currentUserId = auth.currentUser?.uid || 'user-id-placeholder';
  
  const handleTransactionAdded = () => {
    setIsFormVisible(false);
  };
  
  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-200">Ostatnie transakcje</h3>
        <button onClick={() => setIsFormVisible(true)} className=" text-emerald-400 hover:underline">+ Dodaj nową transakcję</button>
      </div>
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2x1 shadow 2x1 w-full max-w-md relative">
            <button onClick={() => setIsFormVisible(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <Form 
              userId={currentUserId}
              onSaveTransaction={writeUserData}
              onCloseForm={handleTransactionAdded}
            />
            </div>
          </div>
      )}

      <div className="space-y-3">
        {/* Przykład użycia - docelowo tutaj będzie .map() z danych z API */}
        <TransactionItem name="Zakupy spożywcze" amount={50} type="expense" />
        <TransactionItem name="Wypłata" amount={2500} type="income" />
      </div>
      <div className="mt-4 text-right text-sm text-gray-400">
        <button className="text-emerald-400 text-sm hover:underline font-medium">Więcej</button>
       </div> 
    </div>
  );
}