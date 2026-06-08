import { useState, useEffect } from 'react';
import Header from './components/Header';
import { LanguageProvider } from './LanguageContext';
import { translations } from './i18n';
import BalanceCard from './components/Balance';
import AnalyticsPage from './components/AnalyticsPage';
import TransactionList from './components/TransactionList';
import TransactionHistory from './components/TransactionHistory';
import BottomNav from './components/Navbar';
import Login from './Login';
import CalendarPage from './components/CalendarPage';
import Sett from './components/SettingsPage';
import { auth, db, realtimeDB } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, onValue } from "firebase/database";
import { isTransactionPlanned } from './services/transactionService';


function App() {

  const [user, setUser] = useState(null);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expenses: 0 });
  const [activeTab, setActiveTab] = useState('home'); // Stan nawigacji
  const [historyTargetTransactionId, setHistoryTargetTransactionId] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [language, setLanguage] = useState('pl');

  const [loading, setLoading] = useState(true);
  const text = translations[language] || translations.pl;


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Stan użytkownika:', currentUser ? 'Zalogowany' : 'Wylogowany');

      if (currentUser) {
        try {
          const userRef = ref(realtimeDB, "users/" + currentUser.uid);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser({ ...currentUser, ...userData });
            setIsDarkTheme(userData.isDarkTheme ?? true);
            setLanguage(userData.language ?? 'pl');
            console.log("Zaktualizowany user:", { ...currentUser, ...userData });
          } else {
            setUser(currentUser); // fallback jeśli brak danych w bazie
            setIsDarkTheme(true);
          }
        } catch (err) {
          console.error("Błąd pobierania danych użytkownika:", err);
          setUser(currentUser);
          setIsDarkTheme(true);
        }
      } else {
        setUser(null);
        setIsDarkTheme(true);
      }
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);

  // Nasłuchiwanie zmian w transakcjach dla aktualnego użytkownika
  useEffect(() => {
    if (user?.uid) {
      const expensesRef = ref(realtimeDB, 'users/' + user.uid + '/expenses');

      const unsubscribe = onValue(expensesRef, (snapshot) => {
        const data = snapshot.val();
        let currentIncome = 0;
        let currentExpenses = 0;

        if (data) {
          Object.values(data).forEach(transaction => {
            if (isTransactionPlanned(transaction.date)) {
              return;
            }

            const amount = parseFloat(transaction.amount);
            if (!isNaN(amount)) {
              if (transaction.type === 'income') {
                currentIncome += amount;
              } else {
                currentExpenses += amount;
              }
            }
          });
        }

        setTotals({
          balance: currentIncome - currentExpenses,
          income: currentIncome,
          expenses: currentExpenses
        });
      });

      return () => unsubscribe();
    } else {
      setTotals({ balance: 0, income: 0, expenses: 0 });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Wylogowano pomyślnie');
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-400">{text.loading}</div>
      </div>
    );
  }


  return (
    <LanguageProvider initialLanguage={language}>
      <div className={`min-h-screen font-sans pb-24 transition-colors ${isDarkTheme ? 'bg-gray-900 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>

        {!user ? (
          <Login />
        ) : (
          <>

            <Header userName={user?.userName || user?.displayName || "Użytkownikowi"}
              isDarkTheme={isDarkTheme}
            />

            <main className="px-4 space-y-6">

              {activeTab === 'home' && (
                <>
                  <BalanceCard
                    total={totals.balance.toFixed(2)}
                    income={totals.income.toFixed(2)}
                    expenses={totals.expenses.toFixed(2)}
                    isDarkTheme={isDarkTheme}
                  />
                  <TransactionList onShowHistory={() => setActiveTab('history')}
                    isDarkTheme={isDarkTheme}
                  />
                </>
              )}

              {/* Placeholder na przyszłe widoki */}
              {activeTab === 'analytics' && (
                <AnalyticsPage
                  isDarkTheme={isDarkTheme}
                />
              )}
              {activeTab === 'calendar' && (
                <div className="text-center py-20 text-gray-500">

                  <CalendarPage
                    onOpenTransactionInHistory={(transactionId) => {
                      setActiveTab('history');
                      setHistoryTargetTransactionId(null);
                      window.setTimeout(() => {
                        setHistoryTargetTransactionId(transactionId);
                      }, 0);
                    }}
                    isDarkTheme={isDarkTheme}
                  />
                </div>
              )}

              {activeTab === 'history' && (
                <div className="text-center py-20 text-gray-500">
                  
                  <TransactionHistory
                    scrollToTransactionId={historyTargetTransactionId}
                    isDarkTheme={isDarkTheme}
                  />
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="text-center py-20 text-gray-500">
                  <Sett
                    isDarkTheme={isDarkTheme}
                    setIsDarkTheme={setIsDarkTheme}
                    userId={user?.uid}
                  />
                </div>
              )}

            </main>

            <BottomNav activeTab={activeTab}
              onTabChange={setActiveTab}
              isDarkTheme={isDarkTheme} />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;