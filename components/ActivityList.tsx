import React from 'react';
import { Booking, BookingStatus } from '../types';

interface ActivityListProps {
  bookings: Booking[];
}

const ActivityList: React.FC<ActivityListProps> = ({ bookings }) => {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <p>Bạn chưa có lịch học nào.</p>
        <p className="text-sm mt-1">Hãy đặt lịch với gia sư ngay nhé!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="font-bold text-gray-800 text-xl mb-4">Hoạt động của bạn</h2>
      {bookings.slice().reverse().map((booking) => (
        <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <img src={booking.tutor.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-800">{booking.tutor.name}</h3>
                <p className="text-xs text-gray-500">{booking.tutor.school}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
              booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {booking.status}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 border-t border-gray-50 pt-3">
             <div className="flex items-center gap-2">
               <span className="w-20 text-gray-400">Môn học:</span>
               <span className="font-medium text-gray-800">{booking.subject}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-20 text-gray-400">Thời gian:</span>
               <span className="font-medium text-gray-800">
                  {new Date(booking.time).toLocaleString('vi-VN', {
                    hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit'
                  })}
               </span>
             </div>
             {booking.note && (
               <div className="flex items-start gap-2">
                <span className="w-20 text-gray-400 shrink-0">Ghi chú:</span>
                <span className="italic">{booking.note}</span>
               </div>
             )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button className="text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg">Chi tiết</button>
            {booking.status === BookingStatus.CONFIRMED && (
              <button className="text-xs font-medium text-white bg-primary px-3 py-1.5 rounded-lg shadow-sm">Vào lớp</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;