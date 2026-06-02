import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../services/firebase";
import { writeUserData, updateUserData, removeUserData } from "../services/transactionService";
import { categories } from "../utils/categories.js";

import Form from "./Add_transaction_form.jsx";
import TransactionItem from "./TransactionItem.jsx";
import TransactionDetailsModal from "./TransactionDetailsModal.jsx";


// Functions moved to services/transactionService.js

// Components moved to their own files


export default function TransactionHistory() {
  const [isFormVisible, setIsFormVisible] = useState(false); // Do widoczności formularza
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Do podglądu szczegółów
  const [editingTransaction, setEditingTransaction] = useState(null); // Do edycji
  const [repeatTransaction, setRepeatTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all"); // Filtr po typie
  const [filterCategory, setFilterCategory] = useState("all"); // Filtr po kategorii



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
    setRepeatTransaction(null);
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
      setRepeatTransaction(null);
      setIsFormVisible(true); // Otwieramy format
      setSelectedTransaction(null); // Zamykamy podgląd
  };

    const handleRepeatClick = (transaction) => {
      setEditingTransaction(null);
      setRepeatTransaction(transaction);
      setIsFormVisible(true);
      setSelectedTransaction(null);
    };

  const handleDeleteClick = (transaction) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę transakcję?")) {
      removeUserData(currentUserId, transaction.id);
      setSelectedTransaction(null);
    }
  };

  
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filtrowanie transakcji
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchType = filterType === "all" || transaction.type === filterType;
      const matchCategory = filterCategory === "all" || transaction.category === filterCategory;
      return matchType && matchCategory;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sortowanie malejąco po dacie

  // Paginacja
  const indexOfLastItem = currentPage * itemsPerPage; 
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-4 gap-4">
        {/* Filtr po typie transakcji */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-2">Typ:</label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1); // Reset do pierwszej strony
            }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="all">Wszystko</option>
            <option value="expense">Wydatki</option>
            <option value="income">Dochody</option>
          </select>
        </div>

        {/* Filtr po kategorii */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-2">Kategoria:</label>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1); // Reset do pierwszej strony
            }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="all">Wszystko</option>
            {filterType !== "all" && filterType === "income" && (
              Object.values(categories.income).map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))
            )}
            {filterType !== "all" && filterType === "expense" && (
              Object.values(categories.expense).map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))
            )}
            {filterType === "all" && (
              <>
                <optgroup label="Dochody">
                  {Object.values(categories.income).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Wydatki">
                  {Object.values(categories.expense).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </optgroup>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Modal Formularza (Dodawanie / Edycja) */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => {
                setIsFormVisible(false);
                setEditingTransaction(null);
                setRepeatTransaction(null);
              }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <Form 
              userId={currentUserId}
              onSaveTransaction={editingTransaction ? handleTransactionUpdated : writeUserData}
              onCloseForm={handleTransactionAdded}
              initialData={editingTransaction || repeatTransaction}
              isEditing={!!editingTransaction}
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
            onRepeat={handleRepeatClick}
        />
      )}

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          currentItems.map((transaction) => (
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

        <div className="fixed bottom-24 left-0 right-0 flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button 
              key={index + 1} 
              onClick={() => paginate(index + 1)} 
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
    </div>
    
  );
}