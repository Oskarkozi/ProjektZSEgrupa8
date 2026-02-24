export default function Header({ userName = "Użytkowniku" }) {
  return (
    <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
      <div>
        <p className="text-gray-400 text-sm">Witaj</p>
        <h1 className="text-xl font-bold">{userName}</h1>
      </div>
    </header>
  );
}