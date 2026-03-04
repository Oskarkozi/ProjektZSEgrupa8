import { useState } from 'react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


function RegisterForm() {
    // Stan formularza - tym razem z 3 polami
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');


        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne');
            return;
        }


        if (formData.password.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków');
            return;
        }

        setLoading(true);

        try {

            await createUserWithEmailAndPassword(auth, formData.email, formData.password);

            console.log('Konto utworzone pomyślnie!');


        } catch (err) {
            console.error('Błąd rejestracji:', err);


            if (err.code === 'auth/email-already-in-use') {
                setError('Ten adres email jest już używany');
            } else if (err.code === 'auth/invalid-email') {
                setError('Nieprawidłowy format adresu email');
            } else if (err.code === 'auth/weak-password') {
                setError('Hasło jest zbyt słabe');
            } else {
                setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">


                <div>
                    <label htmlFor="register-email" className="block text-sm text-gray-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                        <input
                            type="email"
                            id="register-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:bg-gray-800 transition-all"
                            placeholder="you@email.com"
                        />
                    </div>
                </div>


                <div>
                    <label htmlFor="register-password" className="block text-sm text-gray-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                        <input
                            type="password"
                            id="register-password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:bg-gray-800 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                </div>


                <div>
                    <label htmlFor="register-confirm-password" className="block text-sm text-gray-300 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                        <input
                            type="password"
                            id="register-confirm-password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:bg-gray-800 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>


                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 flex items-center justify-center gap-2"
                >
                    {loading ? 'Creating account...' : (
                        <>
                            Register <span>→</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;
