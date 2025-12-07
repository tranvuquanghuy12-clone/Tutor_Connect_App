import React, { useState } from 'react';
import { UserProfile, UserGrade } from '../types';

interface AccountScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onLogout: () => void;
}

type AccountView = 'MAIN' | 'INFO' | 'DEPOSIT' | 'PRO' | 'TUTOR' | 'SUPPORT';

// --- SHARED HEADER ---
const SubScreenHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-10">
    <button onClick={onBack} className="p-1 text-gray-500 hover:text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h2 className="font-bold text-lg text-gray-800">{title}</h2>
  </div>
);

// --- SUB COMPONENTS ---

const InfoView: React.FC<{ 
  userProfile: UserProfile; 
  onUpdateProfile: (p: UserProfile) => void; 
  onBack: () => void 
}> = ({ userProfile, onUpdateProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'GRADES'>('PERSONAL');
  const [newSubject, setNewSubject] = useState('');
  const [newScoreNum, setNewScoreNum] = useState('');
  const [newScoreLet, setNewScoreLet] = useState('');

  const handleAddGrade = () => {
    if (!newSubject || !newScoreNum) return;
    const newGrade: UserGrade = {
      id: Date.now().toString(),
      subjectName: newSubject,
      scoreNumber: newScoreNum,
      scoreLetter: newScoreLet || 'N/A'
    };
    onUpdateProfile({ ...userProfile, grades: [...userProfile.grades, newGrade] });
    setNewSubject('');
    setNewScoreNum('');
    setNewScoreLet('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-slide-up">
      <SubScreenHeader title="Thông tin sinh viên" onBack={onBack} />
      
      <div className="flex bg-white border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('PERSONAL')}
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'PERSONAL' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Cá nhân
        </button>
        <button 
          onClick={() => setActiveTab('GRADES')}
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'GRADES' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Học tập & Điểm
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'PERSONAL' ? (
          <div className="space-y-4">
             <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
               <div>
                 <label className="text-xs text-gray-400">Họ và tên</label>
                 <p className="font-medium text-gray-800">{userProfile.name}</p>
               </div>
               <div>
                 <label className="text-xs text-gray-400">Ngày sinh</label>
                 <p className="font-medium text-gray-800">{userProfile.dob}</p>
               </div>
               <div>
                 <label className="text-xs text-gray-400">Mã sinh viên</label>
                 <p className="font-medium text-gray-800">{userProfile.studentId}</p>
               </div>
               <div>
                 <label className="text-xs text-gray-400">Trường</label>
                 <p className="font-medium text-gray-800">{userProfile.school}</p>
               </div>
               <div>
                 <label className="text-xs text-gray-400">Niên khóa</label>
                 <p className="font-medium text-gray-800">{userProfile.year}</p>
               </div>
             </div>
             <button className="w-full text-primary font-bold text-sm bg-white p-3 rounded-xl border border-primary/20">Chỉnh sửa thông tin</button>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => alert("Tính năng trích xuất điểm từ hình ảnh đang được phát triển!")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <span>📸</span> Trích xuất điểm từ ảnh (Beta)
            </button>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">Bảng điểm đã lưu</h3>
              <div className="space-y-3 mb-4">
                 {userProfile.grades.length === 0 && <p className="text-gray-400 text-sm text-center">Chưa có dữ liệu điểm.</p>}
                 {userProfile.grades.map(g => (
                   <div key={g.id} className="flex justify-between items-center border-b border-gray-50 pb-2">
                     <span className="text-sm font-medium text-gray-700">{g.subjectName}</span>
                     <div className="flex gap-2 text-sm">
                       <span className="font-bold text-gray-800">{g.scoreNumber}</span>
                       <span className="font-bold text-primary w-6 text-center bg-green-50 rounded">{g.scoreLetter}</span>
                     </div>
                   </div>
                 ))}
              </div>

              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs text-gray-400 mb-2 uppercase font-bold">Thêm môn học mới</h4>
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <input 
                    placeholder="Tên môn" 
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="col-span-6 p-2 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200"
                  />
                  <input 
                    placeholder="Điểm số" 
                    value={newScoreNum}
                    onChange={e => setNewScoreNum(e.target.value)}
                    className="col-span-3 p-2 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200"
                  />
                  <input 
                    placeholder="Chữ" 
                    value={newScoreLet}
                    onChange={e => setNewScoreLet(e.target.value)}
                    className="col-span-3 p-2 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200"
                  />
                </div>
                <button 
                  onClick={handleAddGrade}
                  className="w-full bg-green-50 text-primary font-bold py-2 rounded-lg hover:bg-green-100"
                >
                  + Thêm môn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DepositView: React.FC<{ 
  userProfile: UserProfile; 
  onUpdateProfile: (p: UserProfile) => void; 
  onBack: () => void 
}> = ({ userProfile, onUpdateProfile, onBack }) => {
  const [amount, setAmount] = useState('');
  
  const handleDeposit = () => {
    const val = parseInt(amount.replace(/\D/g, ''));
    if (!val || val < 10000) return alert("Vui lòng nhập số tiền hợp lệ (tối thiểu 10k)");
    
    onUpdateProfile({...userProfile, balance: userProfile.balance + val});
    alert(`Đã tạo lệnh nạp ${val.toLocaleString()}đ thành công! Tiền sẽ vào ví sau ít phút.`);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-slide-up">
      <SubScreenHeader title="Nạp tiền" onBack={onBack} />
      <div className="p-4 space-y-4">
         <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg mb-4">
           <div className="flex justify-between items-start mb-8">
             <span className="font-bold text-lg">MB Bank</span>
             <span className="opacity-80">Nội địa</span>
           </div>
           <p className="text-sm opacity-80 mb-1">Số tài khoản</p>
           <p className="font-mono text-2xl font-bold tracking-wider mb-4">8326 8268 99999</p>
           <div className="flex justify-between items-end">
             <div>
               <p className="text-xs opacity-80">Chủ tài khoản</p>
               <p className="font-bold uppercase">Trần Vũ Quang Huy</p>
             </div>
           </div>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-2">Nội dung chuyển khoản</h3>
           <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
             <span className="font-mono font-bold text-lg text-primary">{userProfile.uniqueCode}</span>
             <button className="text-xs text-gray-500 font-medium hover:text-primary">Sao chép</button>
           </div>
           <p className="text-xs text-gray-400 mt-2">Vui lòng nhập chính xác mã này vào nội dung chuyển khoản.</p>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-2">Nhập số tiền đã chuyển</h3>
           <input 
             type="number"
             value={amount}
             onChange={e => setAmount(e.target.value)}
             placeholder="50000"
             className="w-full p-3 bg-gray-50 rounded-lg outline-none border border-gray-200 font-bold text-lg"
           />
           <button 
             onClick={handleDeposit}
             className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600"
           >
             Xác nhận đã chuyển
           </button>
         </div>
      </div>
    </div>
  );
};

const ProView: React.FC<{ 
  userProfile: UserProfile; 
  onUpdateProfile: (p: UserProfile) => void; 
  onBack: () => void;
  onNavigateDeposit: () => void;
}> = ({ userProfile, onUpdateProfile, onBack, onNavigateDeposit }) => {
  const handleUpgrade = () => {
    if (userProfile.isPro) return;
    if (userProfile.balance < 39000) {
      alert("Số dư không đủ. Vui lòng nạp thêm tiền!");
      onNavigateDeposit();
      return;
    }
    if (window.confirm("Xác nhận nâng cấp Pro với giá 39.000đ/tháng?")) {
      onUpdateProfile({
        ...userProfile,
        balance: userProfile.balance - 39000,
        isPro: true
      });
      alert("Chúc mừng! Bạn đã trở thành thành viên Pro.");
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-slide-up">
      <SubScreenHeader title="Nâng cấp Pro" onBack={onBack} />
      <div className="p-4 flex flex-col items-center">
         <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-4xl shadow-lg mb-6">
           👑
         </div>
         <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">TutorConnect Pro</h2>
         <p className="text-gray-500 text-center mb-8 max-w-xs">Mở khóa toàn bộ sức mạnh của ứng dụng chỉ với một khoản phí nhỏ.</p>

         <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
           <div className="flex items-center gap-3">
             <span className="text-green-500 text-xl">✓</span>
             <span className="font-medium text-gray-700">Không quảng cáo làm phiền</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-green-500 text-xl">✓</span>
             <span className="font-medium text-gray-700">Tính năng hướng nghiệp AI</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-green-500 text-xl">✓</span>
             <span className="font-medium text-gray-700">Tìm kiếm việc làm thêm</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-green-500 text-xl">✓</span>
             <span className="font-medium text-gray-700">Huy hiệu Pro nổi bật</span>
           </div>
         </div>

         <div className="text-center mb-6">
           <span className="text-3xl font-bold text-primary">39.000đ</span>
           <span className="text-gray-400"> / tháng</span>
         </div>

         {userProfile.isPro ? (
           <div className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-xl text-center">
             Bạn đang là thành viên Pro
           </div>
         ) : (
           <button 
             onClick={handleUpgrade}
             className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
           >
             Nâng cấp ngay
           </button>
         )}
      </div>
    </div>
  );
};

const TutorRegView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const subjects = ['Toán', 'Lý', 'Hóa', 'Văn', 'Anh', 'Sinh', 'Sử', 'Địa', 'Tin học', 'Triết học', 'Kinh tế vi mô'];
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const toggleSubject = (s: string) => {
    if (selectedSubjects.includes(s)) setSelectedSubjects(prev => prev.filter(i => i !== s));
    else setSelectedSubjects(prev => [...prev, s]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-slide-up">
      <SubScreenHeader title="Đăng ký làm Gia sư" onBack={onBack} />
      <div className="p-4 space-y-6 overflow-y-auto">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Giới thiệu bản thân</label>
          <textarea 
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Kinh nghiệm giảng dạy, thành tích học tập, phương pháp dạy..."
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Môn có thể dạy</label>
          <div className="flex flex-wrap gap-2">
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => toggleSubject(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                  selectedSubjects.includes(s) 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {
            alert("Hồ sơ của bạn đã được gửi đi xét duyệt!");
            onBack();
          }}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg"
        >
          Gửi hồ sơ đăng ký
        </button>
      </div>
    </div>
  );
};

const SupportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 animate-slide-up">
      <SubScreenHeader title="Khiếu nại & Hỗ trợ" onBack={onBack} />
      <div className="p-4 space-y-4">
         <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Loại khiếu nại</label>
           <select className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none">
             <option>Giao dịch gia sư</option>
             <option>Vấn đề tài khoản</option>
             <option>Nạp / Rút tiền</option>
             <option>Lỗi ứng dụng</option>
             <option>Khác</option>
           </select>
         </div>
         
         <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Chi tiết vấn đề</label>
          <textarea 
            rows={5}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <button 
          onClick={() => {
            alert("Yêu cầu hỗ trợ đã được gửi. Chúng tôi sẽ phản hồi trong 24h.");
            onBack();
          }}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg"
        >
          Gửi yêu cầu
        </button>

        <div className="text-center pt-4">
           <p className="text-sm text-gray-400">Hotline: 1900 1000</p>
           <p className="text-sm text-gray-400">Email: support@tutorconnect.vn</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN ACCOUNT SCREEN ---

const AccountScreen: React.FC<AccountScreenProps> = ({ userProfile, onUpdateProfile, onLogout }) => {
  const [currentView, setCurrentView] = useState<AccountView>('MAIN');

  if (currentView === 'INFO') {
    return <InfoView userProfile={userProfile} onUpdateProfile={onUpdateProfile} onBack={() => setCurrentView('MAIN')} />;
  }
  
  if (currentView === 'DEPOSIT') {
    return <DepositView userProfile={userProfile} onUpdateProfile={onUpdateProfile} onBack={() => setCurrentView('MAIN')} />;
  }

  if (currentView === 'PRO') {
    return (
      <ProView 
        userProfile={userProfile} 
        onUpdateProfile={onUpdateProfile} 
        onBack={() => setCurrentView('MAIN')}
        onNavigateDeposit={() => setCurrentView('DEPOSIT')} 
      />
    );
  }

  if (currentView === 'TUTOR') {
    return <TutorRegView onBack={() => setCurrentView('MAIN')} />;
  }

  if (currentView === 'SUPPORT') {
    return <SupportView onBack={() => setCurrentView('MAIN')} />;
  }

  const menuItems = [
    { id: 'INFO', icon: '🎓', label: 'Thông tin sinh viên', desc: 'Cập nhật hồ sơ học tập' },
    { id: 'DEPOSIT', icon: '💳', label: 'Nạp tiền', desc: 'Liên kết ngân hàng, ví điện tử' },
    { id: 'PRO', icon: '⭐', label: 'Nâng cấp Pro', desc: 'Nhận ưu đãi giảm giá phí' },
    { id: 'TUTOR', icon: '📝', label: 'Đăng ký làm gia sư', desc: 'Trở thành đối tác của TutorConnect' },
    { id: 'SUPPORT', icon: '📢', label: 'Khiếu nại & Hỗ trợ', desc: 'Giải quyết vấn đề nhanh chóng' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 animate-fade-in">
      {/* Header Info Card */}
      <div className="bg-primary p-6 pb-12 rounded-b-3xl shadow-lg text-white relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white rounded-full p-1 shadow-inner relative">
             <img 
               src={userProfile.avatar} 
               alt="User" 
               className="w-full h-full rounded-full object-cover"
             />
             {userProfile.isPro && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1 border-2 border-white shadow-sm" title="Pro Member">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2l2.5 6h6L14 11.5l2 6-5.5-3.5L5 17.5l2-6L2 8h6L10 2z" clipRule="evenodd" />
                  </svg>
                </div>
             )}
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {userProfile.name}
              {userProfile.isPro && <span className="bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">PRO</span>}
            </h1>
            <p className="text-green-100 text-sm">{userProfile.school}</p>
            <p className="text-green-100 text-xs mt-1 bg-white/20 inline-block px-2 py-0.5 rounded-lg">{userProfile.year}</p>
          </div>
        </div>
        
        {/* Balance Card Floating */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white text-gray-800 p-4 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Số dư ví</p>
            <p className="text-2xl font-bold text-primary">{userProfile.balance.toLocaleString('vi-VN')}đ</p>
          </div>
          <button 
            onClick={() => setCurrentView('DEPOSIT')}
            className="bg-green-50 text-primary p-2 rounded-xl hover:bg-green-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="mt-14 px-4 space-y-3 flex-1 overflow-y-auto no-scrollbar pt-2">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentView(item.id as AccountView)}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition-colors active:scale-[0.98]"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">
              {item.icon}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-gray-800 text-sm">{item.label}</h3>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}

        <button 
          onClick={onLogout}
          className="w-full bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-4 mt-6 mb-8"
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div className="text-left flex-1">
            <h3 className="font-bold text-red-600 text-sm">Đăng xuất</h3>
            <p className="text-xs text-red-400">Kết thúc phiên làm việc</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccountScreen;