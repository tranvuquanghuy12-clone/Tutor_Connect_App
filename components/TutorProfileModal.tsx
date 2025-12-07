import React, { useState } from 'react';
import { Tutor } from '../types';

interface TutorProfileModalProps {
  tutor: Tutor;
  onClose: () => void;
  onBook: () => void;
}

const TutorProfileModal: React.FC<TutorProfileModalProps> = ({ tutor, onClose, onBook }) => {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-md h-[85vh] sm:h-auto rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up flex flex-col relative z-50">
        
        {/* Header Image/Banner */}
        <div className="h-32 bg-gradient-to-r from-green-400 to-primary rounded-t-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 flex-1 overflow-y-auto no-scrollbar -mt-12 relative">
          {/* Avatar & Basic Info */}
          <div className="flex justify-between items-end mb-4">
             <img 
              src={tutor.avatar} 
              alt={tutor.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="mb-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
               <span className="text-primary font-bold">{tutor.hourlyRate.toLocaleString('vi-VN')}đ</span>
               <span className="text-gray-500 text-xs">/giờ</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">{tutor.name}</h2>
          <p className="text-gray-500 font-medium mb-4">{tutor.school}</p>

          {/* Stats */}
          <div className="flex gap-4 mb-6">
            <div 
              className="flex-1 bg-green-50 p-3 rounded-xl text-center cursor-pointer border border-green-100 hover:bg-green-100 transition-colors relative group"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              <div className="text-xl font-bold text-primary">{tutor.gpa}<span className="text-sm text-green-600/60">/4.0</span></div>
              <div className="text-xs text-green-600 uppercase tracking-wide font-semibold">GPA (Xem)</div>
              {/* Tooltip hint */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Bấm để xem điểm
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
              <div className="text-xl font-bold text-gray-800">{tutor.rating} ★</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Đánh giá</div>
            </div>
            <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
              <div className="text-xl font-bold text-gray-800">{tutor.reviews}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Lượt dạy</div>
            </div>
          </div>

          {/* Transcript Dropdown */}
          {showTranscript && (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-fade-in">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">📜</span> Bảng điểm chi tiết
              </h4>
              <div className="space-y-2">
                {tutor.transcript.map((grade, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                    <span className="text-gray-600">{grade.subject}</span>
                    <span className={`font-bold ${
                      grade.score.includes('A') ? 'text-green-600' : 
                      grade.score.includes('B') ? 'text-blue-600' : 'text-gray-600'
                    }`}>{grade.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Giới thiệu</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{tutor.bio}</p>
          </div>

          {/* Subjects */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-2">Môn giảng dạy</h3>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.map(sub => (
                <span key={sub} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <button 
            onClick={onBook}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all"
          >
            Đặt lịch ngay
          </button>
        </div>

      </div>
    </div>
  );
};

export default TutorProfileModal;