import { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { realtimeDB } from '../../services/firebase';
import { useLanguage } from '../../LanguageContext';
import { useT } from '../../i18n';

export const LanguageTab = ({ isDarkTheme, setIsDarkTheme, userId }) => {
  const [loading, setLoading] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = useT();
  const [lang, setLang] = useState(language || 'pl');

  useEffect(() => {
    setLang(language || 'pl');
  }, [language]);

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

  const handleLanguageChange = async (e) => {
    const next = e.target.value;
    setLang(next);
    setLanguage(next);

    if (!userId) return;

    setLoading(true);
    try {
      await update(ref(realtimeDB, `users/${userId}`), {
        language: next
      });
    } catch (error) {
      console.error('Błąd zmiany języka:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('language')}</h2>
      <select
        className={`block border p-2 ${isDarkTheme ? 'bg-gray-900 text-white border-none' : 'bg-gray-200 text-gray-900 border-none'}`}
        value={lang}
        onChange={handleLanguageChange}
        disabled={loading}
      >
        <option value="pl">Polski</option>
        <option value="en">English</option>
      </select>
      <h2 className="text-xl font-bold">{t('theme')}</h2>
      <select
        className={`block border p-2 ${isDarkTheme ? 'bg-gray-900 text-white border-none' : 'bg-gray-200 text-gray-900 border-none'}`}
        value={isDarkTheme ? 'dark' : 'light'}
        onChange={handleThemeChange}
        disabled={loading}
      >
        <option value="light">{t('light')}</option>
        <option value="dark">{t('dark')}</option>
      </select>
    </div>
  );
};