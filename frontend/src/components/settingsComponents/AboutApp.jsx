export const AboutTab = ({ isDarkTheme = true }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">O aplikacji</h2>
            <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>Aplikacja stworzona do zarządzania wydatkami użytkownika.</p> 
            <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>Wersja 1.0.0</p>
    </div>
);   
        