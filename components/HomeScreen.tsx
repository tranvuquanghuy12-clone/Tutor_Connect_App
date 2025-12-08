import React, { useState, useRef } from 'react';
import { Booking, UserProfile, SchoolScheduleItem } from '../types';

interface HomeScreenProps {
  userProfile: UserProfile;
  bookings: Booking[];
  currentTime: Date;
  onChangeTab: (tabIndex: number) => void;
  onUpdateSchedule: (newSchedule: SchoolScheduleItem[]) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userProfile, bookings, currentTime, onChangeTab, onUpdateSchedule }) => {
  // Sort bookings to find upcoming ones
  const upcomingBookings = bookings
    .filter(b => new Date(b.time) > new Date())
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const today = currentTime;
  const dateStr = today.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

  // Schedule Logic
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  // Initialize with defaults to prevent validation errors if user doesn't change dropdowns
  const [editingItem, setEditingItem] = useState<Partial<SchoolScheduleItem>>({
    day: 'Thứ 2',
    startTime: '07:00',
    endTime: '09:00'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

  const handleAddSchedule = () => {
    // Validate Subject
    if(!editingItem.subject || editingItem.subject.trim() === '') {
        alert("Vui lòng nhập tên môn học!");
        return;
    }

    const newItem: SchoolScheduleItem = {
        id: Date.now().toString(),
        subject: editingItem.subject,
        // Use defaults if undefined
        day: editingItem.day || 'Thứ 2',
        startTime: editingItem.startTime || '07:00',
        endTime: editingItem.endTime || '09:00',
        room: editingItem.room || '',
        startDate: editingItem.startDate,
        endDate: editingItem.endDate
    };
    
    onUpdateSchedule([...userProfile.schoolSchedule, newItem]);
    
    // Reset form
    setEditingItem({
        day: 'Thứ 2',
        startTime: '07:00',
        endTime: '09:00'
    });
    setShowScheduleModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      // Simulate OCR Processing delay
      setTimeout(() => {
        setIsProcessing(false);
        alert("Đã quét thành công! Thêm 2 môn học mới từ lịch.");
        
        // Mock extracted data (Use timestamp to ensure unique IDs, and different subjects)
        const timestamp = Date.now();
        const mockExtracted: SchoolScheduleItem[] = [
            { 
              id: `ocr_${timestamp}_1`, 
              subject: 'Pháp luật đại cương', 
              day: 'Thứ 4', 
              startTime: '09:00', 
              endTime: '11:00', 
              room: 'D6-105',
              startDate: '20/09/2024'
            },
            { 
              id: `ocr_${timestamp}_2`, 
              subject: 'Vật lý đại cương 1', 
              day: 'Thứ 6', 
              startTime: '13:00', 
              endTime: '16:00', 
              room: 'TC-201',
              startDate: '20/09/2024'
            }
        ];
        
        // Ensure we append to existing schedule, not overwrite
        onUpdateSchedule([...userProfile.schoolSchedule, ...mockExtracted]);
        
        // Reset input
        if(fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Hidden File Input for OCR */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chào {userProfile.name.split(' ').pop()}! 👋</h1>
          <p className="text-gray-500 text-sm">{dateStr}</p>
        </div>
        <img src={userProfile.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt="Avatar" />
      </div>

      {/* Weather Widget */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-4 text-white shadow-lg flex justify-between items-center">
        <div>
          <div className="text-3xl font-bold mb-1">28°C</div>
          <div className="font-medium opacity-90">Hà Nội • Nắng nhẹ</div>
        </div>
        <div className="text-5xl">⛅</div>
      </div>

      {/* Upcoming Tutor Class Schedule */}
      <div>
        <div className="flex justify-between items-end mb-3">
           <h2 className="text-lg font-bold text-gray-800">Gia sư sắp tới</h2>
           <button onClick={() => onChangeTab(3)} className="text-primary text-sm font-semibold">Xem hoạt động</button>
        </div>
        
        {upcomingBookings.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             {upcomingBookings.slice(0, 2).map((b, idx) => (
                <div key={b.id} className={`p-4 flex gap-4 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                   <div className="flex flex-col items-center justify-center bg-green-50 w-14 h-14 rounded-xl text-primary font-bold shrink-0">
                      <span className="text-xl">{new Date(b.time).getDate()}</span>
                      <span className="text-[10px] uppercase">Th {new Date(b.time).getMonth() + 1}</span>
                   </div>
                   <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{b.subject}</h3>
                      <p className="text-sm text-gray-500">GV: {b.tutor.name}</p>
                      <p className="text-xs text-primary font-medium mt-1">
                        {new Date(b.time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                      </p>
                   </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-400">
            <p>Không có lịch gia sư nào.</p>
            <button onClick={() => onChangeTab(1)} className="mt-2 text-primary font-bold text-sm">Đặt lịch ngay</button>
          </div>
        )}
      </div>

      {/* School Schedule */}
      <div>
        <div className="flex justify-between items-center mb-3">
           <h2 className="text-lg font-bold text-gray-800">Lịch học trên trường</h2>
           <div className="flex gap-2">
             <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isProcessing}
                className="bg-blue-50 text-blue-600 p-2 rounded-lg text-xs font-bold flex items-center gap-1"
             >
               {isProcessing ? 'Đang quét...' : '📷 OCR'}
             </button>
             <button 
                onClick={() => {
                    setEditingItem({ day: 'Thứ 2', startTime: '07:00', endTime: '09:00' }); // Ensure defaults when opening
                    setShowScheduleModal(true);
                }} 
                className="bg-gray-100 text-gray-600 p-2 rounded-lg text-xs font-bold"
             >
                ✎ Thêm
             </button>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            {userProfile.schoolSchedule.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-4">Chưa có lịch học. Hãy thêm mới hoặc quét ảnh.</div>
            ) : (
                <div className="space-y-4">
                    {days.filter(d => userProfile.schoolSchedule.some(s => s.day === d)).map(day => (
                        <div key={day}>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">{day}</h4>
                            <div className="space-y-2">
                                {userProfile.schoolSchedule.filter(s => s.day === day).map(item => (
                                    <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                                        <div className="text-xs font-bold text-gray-500 w-16 shrink-0 flex flex-col">
                                            <span>{item.startTime}</span>
                                            <span>|</span>
                                            <span>{item.endTime}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm">{item.subject}</div>
                                            <div className="text-xs text-gray-500">Phòng: {item.room}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Mock Exam Schedule */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">Lịch thi (Dự kiến)</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
           <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 min-w-[140px]">
              <div className="text-xs text-orange-600 font-bold mb-1">20/11/2024</div>
              <div className="font-bold text-gray-800">Triết học Mác</div>
              <div className="text-xs text-gray-500 mt-2">Phòng 304-D9</div>
           </div>
           <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 min-w-[140px]">
              <div className="text-xs text-purple-600 font-bold mb-1">25/11/2024</div>
              <div className="font-bold text-gray-800">Giải tích 2</div>
              <div className="text-xs text-gray-500 mt-2">Phòng 101-D3</div>
           </div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl animate-scale-up">
                  <h3 className="font-bold text-lg mb-4">Thêm lịch học</h3>
                  <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Tên môn học <span className="text-red-500">*</span></label>
                        <input 
                          placeholder="Ví dụ: Giải tích 1" 
                          className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-primary"
                          value={editingItem.subject || ''}
                          onChange={e => setEditingItem({...editingItem, subject: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Thứ</label>
                        <select 
                          className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-primary"
                          value={editingItem.day || 'Thứ 2'}
                          onChange={e => setEditingItem({...editingItem, day: e.target.value})}
                        >
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      <div className="flex gap-2">
                          <div className="w-1/2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Bắt đầu</label>
                            <input 
                              type="time" 
                              className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-primary" 
                              value={editingItem.startTime || '07:00'}
                              onChange={e => setEditingItem({...editingItem, startTime: e.target.value})}
                            />
                          </div>
                          <div className="w-1/2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Kết thúc</label>
                            <input 
                              type="time" 
                              className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-primary" 
                              value={editingItem.endTime || '09:00'}
                              onChange={e => setEditingItem({...editingItem, endTime: e.target.value})}
                            />
                          </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Phòng học</label>
                        <input 
                          placeholder="Phòng học" 
                          className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-primary"
                          value={editingItem.room || ''}
                          onChange={e => setEditingItem({...editingItem, room: e.target.value})}
                        />
                      </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                      <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl">Hủy</button>
                      <button onClick={handleAddSchedule} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">Lưu</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default HomeScreen;