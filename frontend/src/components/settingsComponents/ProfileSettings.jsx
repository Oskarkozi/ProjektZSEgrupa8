import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase";
import { getUserProfile, updateUserProfile } from "../../services/transactionService";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
export const ProfileTab = ({ isDarkTheme = true }) => {
  const [username, setUsername] = useState('');
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }
    if (password && password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Użytkownik nie jest zalogowany');
      }

      setSaving(true);
      console.log('ProfileSettings.handleSubmit: saving for uid=', user.uid, 'payload=', { userName: username });
      await updateUserProfile(user.uid, { userName: username });
      console.log('ProfileSettings.handleSubmit: updateUserProfile completed');
      await updateProfile(user, { displayName: username });

      // After username is saved, check if password was provided
      if (password) {
        try {
          // Reauthenticate first (Firebase requirement)
          const currentPassword = prompt('Enter current password to confirm password change:');
          if (!currentPassword) return; // user cancelled
          
          const cred = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(user, cred);
          
          // Now update the password
          await updatePassword(user, password);
        } catch (err) {
          throw new Error('Password change failed: ' + err.message);
        }
      }

      setSuccess('Zapisano pomyślnie!');
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas zapisu');
    } finally {
      setSaving(false);
    }
  }; 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        const currentAuthUser = auth.currentUser;
        setUsername(data.userName || data.username || (currentAuthUser && currentAuthUser.displayName) || '');
      } catch (error) {
        console.error("Nie udało się pobrać profilu:", error);
      }
    }
    fetchUser();
  }, []);
  return (
  <form className="space-y-4" onSubmit={handleSubmit}>
    <h2 className="text-xl font-bold">Edytuj profil</h2>
    <label className={`block text-left ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>Hasło</label>
    <input className={`w-full p-2.5 border rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-900/50 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
     placeholder="Nowe hasło"
     type="password"
     value={password}
     onChange={(e) => setNewPassword(e.target.value)} />
    <label className={`block text-left ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>Potwierdź hasło</label>
    <input className={`w-full p-2.5 border rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-900/50 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} ${password && password !== confirmPassword ? 'border-red-500' : ''}`}
     placeholder="Potwierdź nowe hasło"
     type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)} />
      {error && <div className="text-red-500 text-sm">{error}</div>}
    <label className={`block text-left ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>Nazwa użytkownika</label>
    <input className={`w-full p-2.5 border rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${isDarkTheme ? 'bg-gray-900/50 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
     placeholder="Nazwa użytkownika"
      type="text"
      value = {username}
      onChange={(e) => setUsername(e.target.value)} />
      {success && <div className="text-emerald-400 text-sm">{success}</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button disabled={saving} type="submit" className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors">
        {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
      </button>
  </form>
);
};