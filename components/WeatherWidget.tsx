
import React, { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  forecast: Array<{
    day: string;
    temp: number;
    icon: string;
  }>;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData: WeatherData = {
        temp: 18,
        condition: '多雲時晴',
        icon: 'fa-cloud-sun',
        forecast: [
          { day: '明天', temp: 20, icon: 'fa-sun' },
          { day: '週四', temp: 17, icon: 'fa-cloud-showers-heavy' },
          { day: '週五', temp: 19, icon: 'fa-cloud' },
        ]
      };
      setWeather(mockData);
      setLoading(false);
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/50 animate-pulse rounded-2xl h-32 flex items-center justify-center border border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <i className="fas fa-spinner fa-spin text-blue-400"></i>
          <span className="text-gray-400 text-sm font-bold">讀取釜山天氣中...</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-5 shadow-sm overflow-hidden mb-6 relative group transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500 text-2xl">
            <i className={`fas ${weather.icon}`}></i>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <i className="fas fa-location-dot text-[10px] text-blue-500"></i>
              <h3 className="text-sm font-bold text-gray-800">南韓，釜山</h3>
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">{weather.condition}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline justify-end">
            <span className="text-3xl font-black text-blue-600">{weather.temp}</span>
            <span className="text-lg font-bold text-blue-400 ml-0.5">°C</span>
          </div>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-tighter">當前氣溫</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-100/60">
        {weather.forecast.map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-blue-50/50 transition-colors">
            <span className="text-[10px] text-gray-400 font-bold uppercase">{f.day}</span>
            <i className={`fas ${f.icon} ${f.icon.includes('sun') ? 'text-orange-400' : 'text-blue-400'} text-sm`}></i>
            <span className="text-xs font-black text-gray-700">{f.temp}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
