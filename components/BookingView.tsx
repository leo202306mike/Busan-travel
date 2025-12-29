
import React from 'react';
import { BookingInfo } from '../types';

interface BookingViewProps {
  bookings: BookingInfo[];
  setBookings: React.Dispatch<React.SetStateAction<BookingInfo[]>>;
}

const BookingView: React.FC<BookingViewProps> = ({ bookings, setBookings }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">我的預訂</h2>
        <button 
          onClick={() => alert("新增預訂表單即將推出！")}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md"
        >
          新增預訂
        </button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${
              booking.type === 'flight' ? 'bg-blue-500' : 'bg-orange-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  booking.type === 'flight' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'
                }`}>
                  <i className={`fas ${booking.type === 'flight' ? 'fa-plane' : 'fa-hotel'} text-lg`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{booking.title}</h3>
                  <p className="text-xs text-gray-400 capitalize">{booking.type === 'flight' ? '機票' : '住宿'} 資訊</p>
                </div>
              </div>
              {booking.confirmationCode && (
                <div className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">確認碼</p>
                  <p className="text-xs font-mono font-bold text-gray-600">{booking.confirmationCode}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <i className="far fa-calendar-alt w-4 text-center"></i>
                <p className="text-sm">{new Date(booking.date).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <i className="fas fa-info-circle w-4 text-center"></i>
                <p className="text-sm">{booking.details}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-colors">
                檢視檔案
              </button>
              <button className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">
                顯示 QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        <i className="fas fa-lightbulb text-blue-400 text-2xl mb-2"></i>
        <h4 className="font-bold text-blue-900">旅行小貼士</h4>
        <p className="text-sm text-blue-700/70 mt-1">請記得隨身攜帶預訂確認代碼，或是下載離線版本，以便在通關或 Check-in 時使用。</p>
      </div>
    </div>
  );
};

export default BookingView;
