import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../services/firebase";
import { writeUserData, updateUserData, removeUserData } from "../services/transactionService";

import Form from "./Add_transaction_form.jsx";
import TransactionItem from "./TransactionItem.jsx";
import TransactionDetailsModal from "./TransactionDetailsModal.jsx";


// Functions moved to services/transactionService.js

// Components moved to their own files


export default function TransactionList() {
  const [isFormVisible, setIsFormVisible] = useState(false); // Do widoczności formularza
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Do podglądu szczegółów
  const [editingTransaction, setEditingTransaction] = useState(null); // Do edycji
  const [transactions, setTransactions] = useState([]);
  
  const currentUserId = auth.currentUser?.uid;
  
  useEffect(() => {
    if (!currentUserId) return;

    const expensesRef = ref(database, 'users/' + currentUserId + '/expenses');

    const unsubscribe = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const loadedTransactions = Object.entries(data).map(([id, val]) => ({
          id,
          ...val
        }));
        
        setTransactions(loadedTransactions.reverse());
      } else {
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);
  
  const handleTransactionAdded = () => {
    setIsFormVisible(false);
    setEditingTransaction(null);
  };

  const handleTransactionUpdated = (userId, category, amount, type, date, description) => {
    if (editingTransaction) {
      updateUserData(userId, editingTransaction.id, { category, amount, type, date, description });
      setEditingTransaction(null);
      setIsFormVisible(false);
    }
  };
  
  const handleEditClick = (transaction) => {
      setEditingTransaction(transaction); // Ustawiamy transakcję, którą edytujemy
      setIsFormVisible(true); // Otwieramy format
      setSelectedTransaction(null); // Zamykamy podgląd
  };

  const handleDeleteClick = (transaction) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę transakcję?")) {
      removeUserData(currentUserId, transaction.id);
      setSelectedTransaction(null);
    }
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-200">Ostatnie transakcje</h3>
        <button 
          onClick={() => {
            setEditingTransaction(null);
            setIsFormVisible(true);
          }} 
          className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
        >
          + Dodaj nową transakcję
        </button>
      </div>

      {/* Modal Formularza (Dodawanie / Edycja) */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => {
                setIsFormVisible(false);
                setEditingTransaction(null);
              }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <Form 
              userId={currentUserId}
              onSaveTransaction={editingTransaction ? handleTransactionUpdated : writeUserData}
              onCloseForm={handleTransactionAdded}
              initialData={editingTransaction}
            />
          </div>
        </div>
      )}

      {/* Modal Szczegółów Transakcji */}
      {selectedTransaction && (
        <TransactionDetailsModal 
           transaction={selectedTransaction}
           onClose={() => setSelectedTransaction(null)}
           onEdit={handleEditClick}
           onDelete={handleDeleteClick}
        />
      )}

      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id}
              category={transaction.category} 
              amount={transaction.amount} 
              type={transaction.type}
              date={transaction.date}
              onClick={() => setSelectedTransaction(transaction)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
            <p>Brak transakcji.</p>
            <p className="text-xs mt-1">Dodaj pierwszy wydatek lub przychód!</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-right text-sm text-gray-400">
        {transactions.length > 5 && (
            <button className="text-emerald-400 text-sm hover:underline font-medium">Więcej</button>
        )}
       </div> 
    </div>
  );
}