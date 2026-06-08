import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../services/firebase";
import { categories } from "../utils/categories.js";
import { writeUserData, updateUserData, removeUserData, isTransactionPlanned } from "../services/transactionService";

import Form from "./Add_transaction_form.jsx";
import TransactionItem from "./TransactionItem.jsx";
import TransactionDetailsModal from "./TransactionDetailsModal.jsx";


// Functions moved to services/transactionService.js

// Components moved to their own files


export default function TransactionHistory({ scrollToTransactionId = null, isDarkTheme = true }) {
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

  useEffect(() => {
    if (!scrollToTransactionId) return;

    const element = document.getElementById(`transaction-${scrollToTransactionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("ring-2", "ring-emerald-400", "ring-offset-2", isDarkTheme ? "ring-offset-gray-900" : "ring-offset-gray-200");

      const timeoutId = window.setTimeout(() => {
        element.classList.remove("ring-2", "ring-emerald-400", "ring-offset-2", isDarkTheme ? "ring-offset-gray-900" : "ring-offset-gray-200");
      }, 2000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [scrollToTransactionId, transactions, isDarkTheme]);

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
    setEditingTransaction(transaction); // Ustawia transakcję, którą edytujemy
    setRepeatTransaction(null);
    setIsFormVisible(true); // Otwiera format
    setSelectedTransaction(null); // Zamyka podgląd
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

  const handleExportToCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("Brak transakcji do wyeksportowania.");
      return;
    }

    // Przygotuj nagłówki CSV
    const headers = ["Data", "Typ", "Kategoria", "Kwota", "Opis"];
    
    // Przygotuj dane
    const rows = filteredTransactions.map((transaction) => {
      const categoryLabel = categories[transaction.type]?.[transaction.category]?.label || transaction.category;
      return [
        transaction.date || "",
        transaction.type === "income" ? "Przychód" : "Wydatek",
        categoryLabel,
        transaction.amount || "",
        transaction.description || ""
      ];
    });

    // Utwórz zawartość CSV
    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => 
        row.map((cell) => {
          // Obsłuż wartości zawierające przecinki lub cudzysłowy
          const cellString = String(cell);
          if (cellString.includes(";") || cellString.includes('"') || cellString.includes("\n")) {
            return `"${cellString.replace(/"/g, '""')}"`;
          }
          return cellString;
        }).join(";")
      )
    ].join("\n");

    // Utwórz blob i pobierz plik
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `transakcje_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        {/* Filtr po typie transakcji */}
        <div className="flex flex-col">
          <label className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-700'}`}>Typ:</label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1); // Reset do pierwszej strony
            }}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'}`}
          >
            <option value="all">Wszystko</option>
            <option value="expense">Wydatki</option>
            <option value="income">Dochody</option>
          </select>
        </div>

        {/* Filtr po kategorii */}
        <div className="flex flex-col">
          <label className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-700'}`}>Kategoria:</label>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1); // Reset do pierwszej strony
            }}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'}`}
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

        {/* Przycisk eksportu CSV */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleExportToCSV}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkTheme ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
          >
            📥 Eksport CSV
          </button>
        </div>
      </div>

      {/* Modal Formularza (Dodawanie / Edycja) */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in duration-200 border ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
            <button
              onClick={() => {
                setIsFormVisible(false);
                setEditingTransaction(null);
                setRepeatTransaction(null);
              }}
              className={`absolute top-4 right-4 transition-colors ${isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              ✕
            </button>
            <Form
              userId={currentUserId}
              onSaveTransaction={editingTransaction ? handleTransactionUpdated : writeUserData}
              onCloseForm={handleTransactionAdded}
              initialData={editingTransaction || repeatTransaction}
              isEditing={!!editingTransaction}
              isDarkTheme={isDarkTheme}
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
          isDarkTheme={isDarkTheme}
        />
      )}

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          currentItems.map((transaction) => (
            <div key={transaction.id} id={`transaction-${transaction.id}`}>
              <TransactionItem
                category={transaction.category}
                amount={transaction.amount}
                type={transaction.type}
                date={transaction.date}
                isPlanned={isTransactionPlanned(transaction.date)}
                isDarkTheme={isDarkTheme}
                onClick={() => setSelectedTransaction(transaction)}
              />
            </div>))
        ) : (
          <div className={`text-center py-8 rounded-xl border border-dashed ${isDarkTheme ? 'text-gray-500 bg-gray-800/30 border-gray-700' : 'text-gray-600 bg-gray-100 border-gray-300'}`}>
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
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-emerald-600 text-white' : (isDarkTheme ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>

  );
}