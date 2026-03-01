export default function Header({ userName = "Użytkowniku" }) {
  return (
    <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
      <div>
        <p className="text-gray-400 text-sm">Witaj,</p>
        <h1 className="text-xl font-bold text-white">{userName}</h1>
      </div>
      
      <button 
        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
        aria-label="Profile"
      >
        <span className="text-lg">U</span>
      </button>
    </header>
  );
}