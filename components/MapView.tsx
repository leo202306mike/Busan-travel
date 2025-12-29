
import React, { useEffect, useRef, useState } from 'react';
import { DailyItinerary } from '../types';
import { DAY_COLORS } from '../constants';

interface MapViewProps {
  itinerary: DailyItinerary[];
}

const MapView: React.FC<MapViewProps> = ({ itinerary }) => {
  const mapRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapRef.current && (window as any).L) {
      const L = (window as any).L;
      mapRef.current = L.map('map').setView([35.1795, 129.0756], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // 取得使用者位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#fff",
            weight: 3,
            fillOpacity: 0.8
          }).addTo(mapRef.current).bindPopup("您目前的位置").openPopup();
        });
      }
    }

    // 清除舊有的標記並重新繪製行程
    if (mapRef.current) {
      const L = (window as any).L;
      
      itinerary.forEach((day, dayIdx) => {
        const color = DAY_COLORS[dayIdx % DAY_COLORS.length];
        day.locations.forEach((loc) => {
          L.marker([loc.lat, loc.lng], {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">D${day.dayNumber}</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          })
          .addTo(mapRef.current)
          .bindPopup(`<b>第 ${day.dayNumber} 天</b><br/>${loc.name}<br/>預計時間: ${loc.time}`);
        });
      });
    }
  }, [itinerary]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      window.open(`https://map.naver.com/v5/search/${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* 搜尋列與圖例 */}
      <div className="absolute top-4 left-4 right-4 z-[1000] space-y-2">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="在 Naver Map 搜尋地點..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/95 backdrop-blur shadow-xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
            />
          </div>
          <button 
            type="submit"
            className="bg-green-500 text-white w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <i className="fas fa-location-arrow"></i>
          </button>
        </form>

        {/* 圖例 */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {itinerary.map((day, idx) => (
            <div 
              key={day.id} 
              className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold whitespace-nowrap"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: DAY_COLORS[idx % DAY_COLORS.length] }}
              ></div>
              第 {day.dayNumber} 天
            </div>
          ))}
        </div>
      </div>

      <div id="map" className="flex-1 bg-gray-200"></div>

      {/* 控制按鈕 */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-3">
        <button 
          onClick={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.flyTo(userLocation, 15);
            }
          }}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50"
          title="定位當前位置"
        >
          <i className="fas fa-crosshairs"></i>
        </button>
        <button 
          onClick={() => {
             if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() + 1);
          }}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
          title="放大地圖"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default MapView;
