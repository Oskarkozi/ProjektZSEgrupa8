export default function Header({userName, isDarkTheme}) {
  return (
    <header className={`px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 z-10 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-200'}`}>
      <div>
        <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Witaj,</p>
        <h1 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{userName}</h1>
      </div>
      
      
    </header>
  );
}