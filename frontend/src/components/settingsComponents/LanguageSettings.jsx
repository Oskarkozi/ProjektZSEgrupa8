import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { realtimeDB } from '../../services/firebase';

export const LanguageTab = ({ isDarkTheme, setIsDarkTheme, userId }) => {
  const [loading, setLoading] = useState(false);

  const handleThemeChange = async (e) => {
    const nextTheme = e.target.value;
    const nextIsDarkTheme = nextTheme === 'dark';

    setIsDarkTheme(nextIsDarkTheme);

    if (!userId) {
      return;
    }

    setLoading(true);
    try {
      await update(ref(realtimeDB, `users/${userId}`), {
        isDarkTheme: nextIsDarkTheme
      });
    } catch (error) {
      console.error('Błąd zmiany motywu:', error);
      setIsDarkTheme(!nextIsDarkTheme);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Język aplikacji</h2>
      <select className={`block border p-2 ${isDarkTheme ? 'bg-gray-900 text-white border-none' : 'bg-gray-200 text-gray-900 border-none'}`}>
        <option>Polski</option>
        <option>Angielski</option>
      </select>
      <h2 className="text-xl font-bold">Motyw</h2>
      <select
        className={`block border p-2 ${isDarkTheme ? 'bg-gray-900 text-white border-none' : 'bg-gray-200 text-gray-900 border-none'}`}
        value={isDarkTheme ? 'dark' : 'light'}
        onChange={handleThemeChange}
        disabled={loading}
      >
        <option value="light">Jasny</option>
        <option value="dark">Ciemny</option>
      </select>
    </div>
  );
};