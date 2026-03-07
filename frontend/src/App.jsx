import { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/Balance';
import TransactionList from './components/TransactionList';
import BottomNav from './components/Navbar';
import Login from './Login';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';


function App() {

  const [user, setUser] = useState(null);


  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Stan użytkownika:', currentUser ? 'Zalogowany' : 'Wylogowany');
      setUser(currentUser);
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);


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

      <Header userName={user.email || "Użytkowniku"} />

      <main className="px-4 space-y-6">
        <BalanceCard total={1000} income={100} expenses={50} />
        <TransactionList />


        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Wyloguj się
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;