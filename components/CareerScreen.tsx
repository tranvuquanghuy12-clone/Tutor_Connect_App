import React, { useState } from 'react';
import { UserProfile } from '../types';

interface CareerScreenProps {
  userProfile: UserProfile;
}

const CareerScreen: React.FC<CareerScreenProps> = ({ userProfile }) => {
  // Lock Screen if not Pro
  if (!userProfile.isPro) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <span className="text-4xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tính năng Pro</h2>
        <p className="text-gray-500 mb-8">Nâng cấp tài khoản để mở khóa Hướng nghiệp AI và nhận lộ trình phát triển bản thân chi tiết.</p>
        <button className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-xl cursor-not-allowed">
          Cần nâng cấp Pro
        </button>
      </div>
    );
  }

  // Pro Content
  const [answers, setAnswers] = useState({
    hobbies: '',
    stressSubjects: '',
    workPreference: '',
    futureGoals: ''
  });

  const handleSend = () => {
    // Mock sending to API
    const payload = {
        profile: userProfile,
        answers: answers
    };
    console.log("SENDING TO CAREER API:", payload);
    alert("Đã gửi thông tin! Hệ thống AI đang phân tích và sẽ gửi kết quả về email của bạn trong 24h.");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 pb-24 overflow-y-auto no-scrollbar">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">Hướng nghiệp AI ✨</h1>
        <p className="opacity-90 text-sm">Phân tích hồ sơ và tính cách để tìm ra con đường phù hợp nhất.</p>
      </div>

      <div className="space-y-6">
        {/* Read-only Profile Summary */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Hồ sơ học tập</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <span className="block text-gray-400 text-xs">Trường</span>
                    <span className="font-medium">{userProfile.school}</span>
                </div>
                <div>
                    <span className="block text-gray-400 text-xs">GPA hiện tại</span>
                    <span className="font-medium text-primary">3.2/4.0 (Giả định)</span>
                </div>
            </div>
            <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500">Điểm các môn:</span>
                <div className="flex flex-wrap gap-2">
                    {userProfile.grades.map(g => (
                        <span key={g.id} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                            {g.subjectName}: <span className="font-bold">{g.scoreNumber}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Questionnaire */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Khảo sát cá nhân</h3>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Một mình bạn thường làm gì?</label>
                <textarea 
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-purple-500"
                    rows={3}
                    placeholder="Đọc sách, chơi game, vẽ..."
                    value={answers.hobbies}
                    onChange={e => setAnswers({...answers, hobbies: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Môn học nào khiến bạn áp lực nhất?</label>
                <input 
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-purple-500"
                    type="text"
                    placeholder="Toán, Lý..."
                    value={answers.stressSubjects}
                    onChange={e => setAnswers({...answers, stressSubjects: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bạn thích làm việc với máy tính/giao diện không?</label>
                <select 
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-purple-500"
                    value={answers.workPreference}
                    onChange={e => setAnswers({...answers, workPreference: e.target.value})}
                >
                    <option value="">Chọn...</option>
                    <option value="yes">Rất thích</option>
                    <option value="normal">Bình thường</option>
                    <option value="no">Không thích, thích vận động</option>
                </select>
            </div>
            
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu 5 năm tới?</label>
                <textarea 
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-purple-500"
                    rows={2}
                    placeholder="Trở thành..."
                    value={answers.futureGoals}
                    onChange={e => setAnswers({...answers, futureGoals: e.target.value})}
                />
            </div>
        </div>

        <button 
            onClick={handleSend}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-700 active:scale-95 transition-all"
        >
            Gửi yêu cầu Hướng nghiệp
        </button>
      </div>
    </div>
  );
};

export default CareerScreen;