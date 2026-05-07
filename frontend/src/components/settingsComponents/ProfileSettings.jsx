import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/transactionService";
export const ProfileTab = () => {
  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        setUsername(data.username || '');
      } catch (error) {
        console.error("Nie udało się pobrać profilu:", error);
      }
    }
    fetchUser();
  }, []);
  return (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Edytuj profil</h2>
    <input className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" placeholder="Nowe hasło" type="password" />
    <input className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
     placeholder="Nazwa użytkownika"
      type="text"
      value = {username}
      onChange={(e) => setUsername(e.target.value)} />
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        Zapisz zmiany
      </button>
  </div>
);
};