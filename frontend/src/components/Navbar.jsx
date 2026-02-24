export default function Navbar() {
return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-6 py-4 pb-6">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-emerald-400">
            <span className="text-[10px] font-medium">Home</span>
          </button>
        </div>
      </nav>
  );
}