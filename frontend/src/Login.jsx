import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';


function Login() {

    const [isLogin, setIsLogin] = useState(true);


    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex">

            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">


                <div className="w-full max-w-md">

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            bank<span className="text-teal-400">x</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {isLogin
                                ? "Welcome back. Let's check your finances."
                                : "Zacznij kontrolować swoje finanse."}
                        </p>
                    </div>


                    <div className="flex gap-2 mb-6 bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin
                                ? 'bg-white text-gray-900'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin
                                ? 'bg-white text-gray-900'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Register
                        </button>
                    </div>


                    {isLogin ? (
                        <LoginForm />
                    ) : (
                        <RegisterForm />
                    )}


                    <p className="text-xs text-gray-500 text-center mt-6">
                        By continuing, you agree to BankX's{' '}
                        <a href="#" className="text-teal-400 hover:text-teal-300">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-teal-400 hover:text-teal-300">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>


            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-teal-900 via-gray-900 to-gray-900 items-center justify-center p-12 relative overflow-hidden">



                <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>


                <div className="relative z-10 text-center max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Take control of your <span className="text-teal-400">finances</span>.
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Track spending, set budgets, and grow your wealth — all in one place.
                    </p>


                    <div className="mt-12 flex justify-center">

                        <img
                            src="/finanse.jpg"
                            alt="Finance illustration"
                            className="w-full max-w-md rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
