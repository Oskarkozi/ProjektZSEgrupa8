import { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FaRegEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa";


function LoginForm() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });


    const [error, setError] = useState('');

    // useState do pokazywania, że trwa ładowanie (podczas logowania)
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
        setLoading(true);

        try {

            await signInWithEmailAndPassword(auth, formData.email, formData.password);


            console.log('Zalogowano pomyślnie!');

        } catch (err) {

            console.error('Błąd logowania:', err);


            if (err.code === 'auth/user-not-found') {
                setError('Nie znaleziono użytkownika o tym adresie email');
            } else if (err.code === 'auth/wrong-password') {
                setError('Nieprawidłowe hasło');
            } else if (err.code === 'auth/invalid-email') {
                setError('Nieprawidłowy format adresu email');
            } else {
                setError('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
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
                    <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaRegEnvelope /></span>
                        <input
                            type="email"
                            id="email"
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
                    <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaLock /></span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
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

                    {loading ? 'Signing in...' : (
                        <>
                            Sign In <span>→</span>
                        </>
                    )}
                </button>
            </form>


            <div className="text-center mt-4">
                <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                    Forgot password?
                </a>
            </div>
        </div>
    );
}

export default LoginForm;
