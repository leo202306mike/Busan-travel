
import React, { useState, useEffect } from 'react';
import { Tab, DailyItinerary, Expense, BookingInfo, Participant } from './types';
import { MOCK_ITINERARY, INITIAL_PARTICIPANTS, MOCK_BOOKINGS } from './constants';
import ItineraryView from './components/ItineraryView';
import ExpenseView from './components/ExpenseView';
import BookingView from './components/BookingView';
import MapView from './components/MapView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ITINERARY);
  const [itinerary, setItinerary] = useState<DailyItinerary[]>(MOCK_ITINERARY);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [bookings, setBookings] = useState<BookingInfo[]>(MOCK_BOOKINGS);

  // 持久化儲存
  useEffect(() => {
    const savedItinerary = localStorage.getItem('busango_itinerary');
    if (savedItinerary) setItinerary(JSON.parse(savedItinerary));
    
    const savedExpenses = localStorage.getItem('busango_expenses');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  useEffect(() => {
    localStorage.setItem('busango_itinerary', JSON.stringify(itinerary));
    localStorage.setItem('busango_expenses', JSON.stringify(expenses));
  }, [itinerary, expenses]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* 頁首 */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-plane-departure text-sm"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            BusanGo 釜山行
          </h1>
        </div>
        <button 
          onClick={() => alert("設定與同步功能即將推出！")}
          className="text-gray-400 hover:text-blue-600 transition-colors"
        >
          <i className="fas fa-cog text-xl"></i>
        </button>
      </header>

      {/* 內容區域 */}
      <main className="flex-1 overflow-y-auto hide-scrollbar relative">
        {activeTab === Tab.ITINERARY && (
          <ItineraryView 
            itinerary={itinerary} 
            setItinerary={setItinerary} 
          />
        )}
        {activeTab === Tab.EXPENSES && (
          <ExpenseView 
            expenses={expenses} 
            setExpenses={setExpenses} 
            participants={participants} 
          />
        )}
        {activeTab === Tab.BOOKING && (
          <BookingView 
            bookings={bookings} 
            setBookings={setBookings} 
          />
        )}
        {activeTab === Tab.MAP && (
          <MapView itinerary={itinerary} />
        )}
      </main>

      {/* 底部導覽列 */}
      <nav className="bg-white border-t px-6 py-2 pb-safe flex items-center justify-between sticky bottom-0 z-20">
        <NavButton 
          active={activeTab === Tab.ITINERARY} 
          icon="fa-calendar-alt" 
          label="行程" 
          onClick={() => setActiveTab(Tab.ITINERARY)} 
        />
        <NavButton 
          active={activeTab === Tab.EXPENSES} 
          icon="fa-wallet" 
          label="記帳" 
          onClick={() => setActiveTab(Tab.EXPENSES)} 
        />
        <NavButton 
          active={activeTab === Tab.MAP} 
          icon="fa-map-marked-alt" 
          label="地圖" 
          onClick={() => setActiveTab(Tab.MAP)} 
        />
        <NavButton 
          active={activeTab === Tab.BOOKING} 
          icon="fa-ticket-alt" 
          label="預訂" 
          onClick={() => setActiveTab(Tab.BOOKING)} 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${
      active ? 'text-blue-600 scale-110' : 'text-gray-400'
    }`}
  >
    <i className={`fas ${icon} text-lg`}></i>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    {active && <div className="w-1 h-1 bg-blue-600 rounded-full"></div>}
  </button>
);

export default App;
