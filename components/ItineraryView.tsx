
import React, { useState } from 'react';
import { DailyItinerary, Location } from '../types';
import WeatherWidget from './WeatherWidget';

interface ItineraryViewProps {
  itinerary: DailyItinerary[];
  setItinerary: React.Dispatch<React.SetStateAction<DailyItinerary[]>>;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, setItinerary }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const addLocation = (dayIndex: number) => {
    const name = prompt("地點名稱？");
    const time = prompt("時間 (小時:分鐘)？");
    if (!name || !time) return;

    const newLocation: Location = {
      id: Date.now().toString(),
      name,
      time,
      lat: 35.1795, // 預設釜山市中心
      lng: 129.0756
    };

    const newItinerary = [...itinerary];
    newItinerary[dayIndex].locations.push(newLocation);
    newItinerary[dayIndex].locations.sort((a, b) => a.time.localeCompare(b.time));
    setItinerary(newItinerary);
  };

  const removeLocation = (dayIndex: number, locId: string) => {
    if (!confirm("確定要刪除此行程嗎？")) return;
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].locations = newItinerary[dayIndex].locations.filter(l => l.id !== locId);
    setItinerary(newItinerary);
  };

  return (
    <div className="p-4 space-y-2">
      {/* 釜山天氣預報小工具 */}
      <WeatherWidget />

      {/* 天數切換器 */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mt-2">
        {itinerary.map((day, idx) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(idx)}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap text-sm font-bold transition-all ${
              selectedDay === idx 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105' 
                : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            第 {day.dayNumber} 天
            <span className={`block text-[10px] opacity-70 ${selectedDay === idx ? 'text-white' : 'text-gray-400'}`}>
              {new Date(day.date).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}
            </span>
          </button>
        ))}
        <button 
          onClick={() => {
            const lastDay = itinerary[itinerary.length - 1];
            const nextDate = new Date(lastDay.date);
            nextDate.setDate(nextDate.getDate() + 1);
            setItinerary([...itinerary, {
              id: Date.now().toString(),
              dayNumber: lastDay.dayNumber + 1,
              date: nextDate.toISOString().split('T')[0],
              locations: []
            }]);
          }}
          className="px-5 py-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 text-sm font-bold flex items-center justify-center"
        >
          <i className="fas fa-plus text-xs mr-1"></i> 新增天數
        </button>
      </div>

      {/* 選定天數的內容 */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">第 {itinerary[selectedDay]?.dayNumber} 天行程</h2>
            <p className="text-xs text-gray-400 font-medium">
              {new Date(itinerary[selectedDay]?.date).toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={() => addLocation(selectedDay)}
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
          >
            <i className="fas fa-plus text-lg"></i>
          </button>
        </div>

        {itinerary[selectedDay]?.locations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-map-location-dot text-2xl text-gray-200"></i>
            </div>
            <p className="text-gray-400 font-bold text-sm">目前尚無行程</p>
            <p className="text-gray-300 text-xs mt-1">點擊 + 按鈕開始規劃目的地</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-50">
            {itinerary[selectedDay]?.locations.map((loc) => (
              <div key={loc.id} className="relative">
                <div className="absolute -left-[1.35rem] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-4 border-blue-500 shadow-sm z-10"></div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex justify-between items-start group hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase">{loc.time}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-800 leading-tight">{loc.name}</h3>
                    {loc.description && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{loc.description}</p>}
                  </div>
                  <div className="flex gap-1 ml-3">
                    <button 
                       onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(loc.name)}`, '_blank')}
                       className="w-9 h-9 flex items-center justify-center text-green-500 bg-green-50 rounded-xl transition-colors hover:bg-green-100"
                       title="Naver Map 搜尋"
                    >
                      <i className="fas fa-location-arrow text-sm"></i>
                    </button>
                    <button 
                      onClick={() => removeLocation(selectedDay, loc.id)}
                      className="w-9 h-9 flex items-center justify-center text-red-200 hover:text-red-500 bg-transparent hover:bg-red-50 rounded-xl transition-all"
                    >
                      <i className="fas fa-trash-can text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;
