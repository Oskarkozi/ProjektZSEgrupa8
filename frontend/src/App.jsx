import Header from './components/Header';
import BalanceCard from './components/Balance';
import TransactionList from './components/TransactionList';
import BottomNav from './components/Navbar';
import { auth, db } from './services/firebase';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans pb-24">
      <Header userName="Użytkowniku" />
      
      <main className="px-4 space-y-6">
        <BalanceCard total={1000} income={100} expenses={50} />
        <TransactionList />
      </main>

      <BottomNav />
    </div>
  );
}

export default App;