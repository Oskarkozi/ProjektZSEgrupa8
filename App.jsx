import { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/Balance';
import TransactionList from './components/TransactionList';
import TransactionHistory from './components/TransactionHistory';
import BottomNav from './components/Navbar';
import Login from './Login';
import CalendarPage from './components/CalendarPage';
import Sett from './components/SettingsPage';
import { auth, db, realtimeDB } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, onValue } from "firebase/database";


function App() {

  const [user, setUser] = useState(null);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expenses: 0 }); 
  const [activeTab, setActiveTab] = useState('home'); // Stan nawigacji

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Stan użytkownika:', currentUser ? 'Zalogowany' : 'Wylogowany');

      if (currentUser) {
      try {
        const userRef = ref(realtimeDB, "users/" + currentUser.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser({ ...currentUser, ...snapshot.val() });
          console.log("Zaktualizowany user:", { ...currentUser, ...snapshot.val() });
        } else {
          setUser(currentUser); // fallback jeśli brak danych w bazie
        }
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
        setUser(currentUser); 
      }
    } else {
      setUser(null);
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
        <div className="text-xl text-gray-400">Ładowanie...</div>
      </div>
    );
  }


  if (!user) {
    return <Login />;
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans pb-24">

      <Header userName={user?.userName || user?.displayName || "Użytkownikowi"} />

      <main className="px-4 space-y-6">
        
        {activeTab === 'home' && (
          <>
            <BalanceCard 
              total={totals.balance.toFixed(2)} 
              income={totals.income.toFixed(2)} 
              expenses={totals.expenses.toFixed(2)} 
            />
            <TransactionList onShowHistory={() => setActiveTab('history')} />
          </>
        )}

        {/* Placeholder na przyszłe widoki */}
        {activeTab === 'analysis' && (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-bold mb-2">Analiza</h2>
            <p>Tutaj pojawią się wykresy wydatków.</p>
          </div>
        )}
        {activeTab === 'calendar' && (
          <div className="text-center py-20 text-gray-500">
              
              <CalendarPage />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-20 text-gray-500">
             <h2 className="text-xl font-bold mb-2">Pełna Historia</h2>
             <p>Lista wszystkich transakcji.</p>
             <TransactionHistory />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center py-20 text-gray-500">
             <Sett />
          </div>
        )}


      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;