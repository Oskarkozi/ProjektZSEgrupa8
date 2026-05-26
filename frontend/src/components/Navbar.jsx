import {FaHome, FaChartPie, FaList, FaUser, FaCalendar} from 'react-icons/fa';
export default function Navbar({activeTab, onTabChange}) {
  const NavButton = ({ id ,label, icon: Icon}) => {
    const isActive = activeTab === id;
    return(
      <button 
      onClick={() => onTabChange(id)}
      className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
          isActive ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
        }`}
        >
          <Icon className={`text-xl ${isActive ? 'scale-110' : ''}transition-transform`}/>
          <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
  };
return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-6 py-4 pb-6">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <NavButton id="home" label="Pulpit" icon={FaHome}/>
          <NavButton id="analytics" label="Statystyki" icon={FaChartPie}/>
          <NavButton id="calendar" label="Kalendarz" icon={FaCalendar}/>
          <NavButton id="history" label="Historia" icon={FaList}/>
          <NavButton id="profile" label="Profil" icon={FaUser}/>
        </div>
      </nav>
  );
}