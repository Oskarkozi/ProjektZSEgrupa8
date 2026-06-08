import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { auth, database } from "../services/firebase";
import { writeUserData, updateUserData, removeUserData, isTransactionPlanned } from "../services/transactionService";
import { useT } from '../i18n';

import Form from "./Add_transaction_form.jsx";
import TransactionItem from "./TransactionItem.jsx";
import TransactionDetailsModal from "./TransactionDetailsModal.jsx";


// Functions moved to services/transactionService.js

// Components moved to their own files


export default function TransactionList({ onShowHistory, isDarkTheme }) {
  const t = useT();
  const [isFormVisible, setIsFormVisible] = useState(false); // Do widoczności formularza
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Do podglądu szczegółów
  const [editingTransaction, setEditingTransaction] = useState(null); // Do edycji
  const [repeatTransaction, setRepeatTransaction] = useState(null);
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

        setTransactions(loadedTransactions.reverse().filter((transaction) => !isTransactionPlanned(transaction.date)));
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
    if (window.confirm(t('deleteConfirm') || "Czy na pewno chcesz usunąć tę transakcję?")) {
      removeUserData(currentUserId, transaction.id);
      setSelectedTransaction(null);
    }
  };
  const visibleTransactions = transactions.slice(0, 6);
  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-semibold text-lg ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>{t('recentTransactions')}</h3>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setRepeatTransaction(null);
            setIsFormVisible(true);
          }}
          className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
        >
          {t('addNewTransaction')}
        </button>
      </div>

      {/* Modal Formularza (Dodawanie / Edycja) */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in duration-200 border ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
            <button
              onClick={() => {
                setIsFormVisible(false);
                setRepeatTransaction(null);
                setEditingTransaction(null);

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
        {visibleTransactions.length > 0 ? (
          visibleTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              category={transaction.category}
              amount={transaction.amount}
              type={transaction.type}
              date={transaction.date}
              isDarkTheme={isDarkTheme}
              onClick={() => setSelectedTransaction(transaction)}
            />
          ))
        ) : (
          <div className={`text-center py-8 rounded-xl border border-dashed ${isDarkTheme ? 'text-gray-500 bg-gray-800/30 border-gray-700' : 'text-gray-600 bg-gray-100 border-gray-300'}`}>
            <p>{t('noTransactions')}</p>
            <p className="text-xs mt-1">{t('addFirstTransaction')}</p>
          </div>
        )}
      </div>

      <div className={`mt-4 text-right text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
        {transactions.length > 5 && (
          <button
            type="button"
            onClick={onShowHistory}
            className="text-emerald-400 text-sm hover:underline font-medium"
          >
            {t('viewHistory')}
          </button>
        )}
      </div>
    </div>
  );
}