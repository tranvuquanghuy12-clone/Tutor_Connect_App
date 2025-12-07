import React, { useState } from 'react';
import { Tutor } from '../types';

interface BookingModalProps {
  tutor: Tutor;
  onClose: () => void;
  onConfirm?: () => void; // Deprecated
  onConfirmData?: (data: {subject: string, time: string, note: string}) => void; // New
}

const BookingModal: React.FC<BookingModalProps> = ({ tutor, onClose, onConfirm, onConfirmData }) => {
  const [subject, setSubject] = useState(tutor.subjects[0] || '');
  const [note, setNote] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfirmData) {
        onConfirmData({ subject, time, note });
    } else if (onConfirm) {
        onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Đặt lịch học</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-bold text-gray-800">{tutor.name}</p>
            <p className="text-xs text-primary font-semibold">{tutor.hourlyRate.toLocaleString('vi-VN')}đ/giờ</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
            >
              {tutor.subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian mong muốn</label>
            <input 
              type="datetime-local" 
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho gia sư</label>
            <textarea 
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Em cần ôn gấp phần tích phân..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary outline-none resize-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all mt-4"
          >
            Xác nhận đặt lịch
          </button>
        </form>

      </div>
    </div>
  );
};

export default BookingModal;