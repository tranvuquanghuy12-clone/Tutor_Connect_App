import React, { useState, useEffect } from 'react';
import { Tutor, ViewState, Booking, BookingStatus, UserProfile, SchoolScheduleItem } from './types';
import { MOCK_TUTORS } from './services/mockData';
import TutorCard from './components/TutorCard';
import BookingModal from './components/BookingModal';
import ChatBot from './components/ChatBot';
import AuthScreen from './components/AuthScreen';
import ActivityList from './components/ActivityList';
import TutorProfileModal from './components/TutorProfileModal';
import AccountScreen from './components/AccountScreen';
import HomeScreen from './components/HomeScreen'; 
import CareerScreen from './components/CareerScreen';
import { matchTutors } from './services/geminiService';

// Default initial state if no local storage exists
const DEFAULT_PROFILE: UserProfile = {
  name: 'Nguyễn Văn Học',
  avatar: 'https://picsum.photos/200/200?random=99',
  school: 'Đại học Bách Khoa HN',
  year: 'Sinh viên năm 3',
  studentId: '20215566',
  dob: '01/01/2003',
  balance: 2500000,
  isPro: false,
  uniqueCode: 'TC' + Math.floor(100000 + Math.random() * 900000),
  grades: [
    { id: '1', subjectName: 'Giải tích 1', scoreNumber: '9.0', scoreLetter: 'A+' }
  ],
  schoolSchedule: [
      { id: 'sc1', subject: 'Giải tích 3', day: 'Thứ 2', startTime: '06:45', endTime: '09:20', room: 'D9-501', startDate: '15/09/2024', endDate: '15/01/2025' }
  ]
};

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  
  // Data State - Initialize from LocalStorage
  const [tutors, setTutors] = useState<Tutor[]>(MOCK_TUTORS);
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('tutorConnect_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading bookings", e);
      return [];
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('tutorConnect_user');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch (e) {
      console.error("Error loading profile", e);
      return DEFAULT_PROFILE;
    }
  });
  
  // Simulation State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDemoControls, setShowDemoControls] = useState(true);

  // Selection State
  const [selectedTutorForProfile, setSelectedTutorForProfile] = useState<Tutor | null>(null);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<Tutor | null>(null);
  
  // Booking Edit State
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // UI State
  const [showChat, setShowChat] = useState(false);

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('tutorConnect_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('tutorConnect_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // --- Clock Effect ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Actions ---

  const handleLogin = () => {
    setView(ViewState.HOME);
  };

  const handleLogout = () => {
    setView(ViewState.AUTH);
  };

  // Demo: Jump time to next booking
  const jumpToNextClass = () => {
    const nextBooking = bookings
      .filter(b => new Date(b.time) > currentTime)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())[0];
    
    if (nextBooking) {
      const start = new Date(nextBooking.time);
      setCurrentTime(start); // Jump exactly to start time
      alert(`Đã chỉnh thời gian đến giờ học môn ${nextBooking.subject}!`);
    } else {
      alert("Không có lịch học sắp tới để nhảy đến.");
    }
  };

  const handleSearch = async () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setTutors(MOCK_TUTORS);
      return;
    }

    setIsSearching(true);
    try {
      const localMatches = MOCK_TUTORS.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.subjects.some(s => s.toLowerCase().includes(query)) ||
        t.school.toLowerCase().includes(query) ||
        t.transcript.some(gr => gr.subject.toLowerCase().includes(query))
      );
      const rankedIds = await matchTutors(query, MOCK_TUTORS);
      let finalTutors: Tutor[] = [];
      if (rankedIds && rankedIds.length > 0) {
         const aiMatches = MOCK_TUTORS.filter(t => rankedIds.includes(t.id));
         aiMatches.sort((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id));
         const aiIds = new Set(aiMatches.map(t => t.id));
         const uniqueLocalMatches = localMatches.filter(t => !aiIds.has(t.id));
         finalTutors = [...aiMatches, ...uniqueLocalMatches];
      } else {
         finalTutors = localMatches;
      }
      setTutors(finalTutors);
    } catch (e) {
      console.error("Search failed", e);
      const localMatches = MOCK_TUTORS.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setTutors(localMatches);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const openTutorProfile = (tutor: Tutor) => {
    setSelectedTutorForProfile(tutor);
  };

  const openBookingFromProfile = () => {
    const tutor = selectedTutorForProfile;
    setSelectedTutorForProfile(null);
    setSelectedTutorForBooking(tutor);
  };

  const handleBookingConfirm = (bookingData: {subject: string, time: string, note: string}) => {
    // If editing existing booking
    if (bookingToEdit) {
        setBookings(prev => prev.map(b => 
            b.id === bookingToEdit.id ? { ...b, ...bookingData } : b
        ));
        setBookingToEdit(null);
        alert("Đã cập nhật lịch học!");
        return;
    }

    if (!selectedTutorForBooking) return;

    // Calculate Cost (Assuming 1 hour session for simplicity)
    const cost = selectedTutorForBooking.hourlyRate;

    // Check Balance
    if (userProfile.balance < cost) {
      alert("Số dư tài khoản không đủ. Vui lòng nạp thêm tiền!");
      setSelectedTutorForBooking(null);
      setView(ViewState.ACCOUNT); // Should ideally go straight to DEPOSIT view inside Account, but this switches tab
      return;
    }

    // Deduct Money
    setUserProfile(prev => ({
      ...prev,
      balance: prev.balance - cost
    }));

    const newBooking: Booking = {
      id: Date.now().toString(),
      tutor: selectedTutorForBooking,
      subject: bookingData.subject,
      time: bookingData.time,
      note: bookingData.note,
      status: BookingStatus.PENDING,
      timestamp: Date.now(),
      cost: cost,
      meetLink: "https://meet.google.com/abc-defg-hij" // Mock link
    };

    setTimeout(() => {
      setBookings(prev => [...prev, newBooking]);
      setTimeout(() => {
        setBookings(current => current.map(b => 
          b.id === newBooking.id ? {...b, status: BookingStatus.CONFIRMED} : b
        ));
      }, 2000);
      setSelectedTutorForBooking(null);
      setView(ViewState.BOOKING_SUCCESS);
    }, 1000);
  };

  const handleCancelBooking = (bookingId: string) => {
      if(!window.confirm("Bạn có chắc muốn hủy lịch học này? Tiền sẽ được hoàn lại.")) return;
      
      const booking = bookings.find(b => b.id === bookingId);
      if(booking) {
          // Refund
          setUserProfile(prev => ({ ...prev, balance: prev.balance + booking.cost }));
          // Update status
          setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b));
      }
  };

  const handleEditBooking = (booking: Booking) => {
      setBookingToEdit(booking);
      // We need to 'fake' select a tutor so the modal opens, but logic will handle it as an edit
      setSelectedTutorForBooking(booking.tutor);
  };

  const handleUpdateSchoolSchedule = (newSchedule: SchoolScheduleItem[]) => {
      setUserProfile(prev => ({...prev, schoolSchedule: newSchedule}));
  };

  // --- RENDER HELPERS ---

  if (view === ViewState.AUTH) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderBottomNav = () => (
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 py-2 px-1 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => setView(ViewState.HOME)}
        className={`flex flex-col items-center w-1/5 transition-colors ${view === ViewState.HOME ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className="text-xl mb-0.5">🏠</span>
        <span className="text-[9px] font-bold">Trang chủ</span>
      </button>

      <button 
        onClick={() => setView(ViewState.SEARCH)}
        className={`flex flex-col items-center w-1/5 transition-colors ${view === ViewState.SEARCH ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className="text-xl mb-0.5">🔍</span>
        <span className="text-[9px] font-bold">Tìm gia sư</span>
      </button>

      <button 
        onClick={() => setView(ViewState.CAREER)}
        className={`flex flex-col items-center w-1/5 transition-colors ${view === ViewState.CAREER ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className="text-xl mb-0.5">✨</span>
        <span className="text-[9px] font-bold">Hướng nghiệp</span>
      </button>
      
      <button 
        onClick={() => setView(ViewState.ACTIVITY)}
        className={`flex flex-col items-center w-1/5 transition-colors ${view === ViewState.ACTIVITY ? 'text-primary' : 'text-gray-400'}`}
      >
         <span className="text-xl mb-0.5">📅</span>
        <span className="text-[9px] font-bold">Hoạt động</span>
      </button>
      
      <button 
        onClick={() => setView(ViewState.ACCOUNT)}
        className={`flex flex-col items-center w-1/5 transition-colors ${view === ViewState.ACCOUNT ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className="text-xl mb-0.5">👤</span>
        <span className="text-[9px] font-bold">Tài khoản</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Floating Demo Time Control */}
        {showDemoControls && (
          <div className="absolute top-24 right-4 z-30 bg-black/70 text-white p-2 rounded-lg text-xs backdrop-blur-sm">
            <div className="font-mono mb-1">{currentTime.toLocaleTimeString()}</div>
            <button onClick={jumpToNextClass} className="bg-primary px-2 py-1 rounded hover:bg-green-600">
              ⏩ Đến giờ học
            </button>
          </div>
        )}

        {/* === HEADER (For Search Tab) === */}
        {view === ViewState.SEARCH && (
          <div className="bg-primary pt-12 pb-6 px-6 rounded-b-3xl shadow-lg z-10 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">Tìm Gia Sư</h1>
                <p className="text-green-100 text-sm">Kết nối tri thức</p>
              </div>
              <div 
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => setShowChat(true)}
              >
                <span className="text-xl">🤖</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-2 shadow-lg flex items-center">
              <span className="pl-3 text-gray-400">🔍</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm môn: Giải tích, Triết..."
                className="flex-1 p-2 outline-none text-gray-700 bg-transparent"
              />
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-primary text-white p-2 rounded-xl hover:bg-green-600 transition-colors font-medium text-sm px-4"
              >
                {isSearching ? '...' : 'Tìm'}
              </button>
            </div>
          </div>
        )}

        {/* === MAIN CONTENT AREA === */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50">
          
          {/* NEW HOME DASHBOARD */}
          {view === ViewState.HOME && (
             <HomeScreen 
               userProfile={userProfile} 
               bookings={bookings} 
               currentTime={currentTime}
               onChangeTab={(idx) => {
                 if(idx === 1) setView(ViewState.SEARCH);
                 if(idx === 2) setView(ViewState.CAREER); // Not used currently in home, but logic holds
                 if(idx === 3) setView(ViewState.ACTIVITY);
               }} 
               onUpdateSchedule={handleUpdateSchoolSchedule}
             />
          )}

          {/* SEARCH VIEW (Old Home) */}
          {view === ViewState.SEARCH && (
            <div className="p-4 pb-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 text-lg">Gia sư gợi ý</h2>
                <span 
                  className="text-primary text-sm font-semibold cursor-pointer"
                  onClick={() => {
                     setSearchQuery('');
                     setTutors(MOCK_TUTORS);
                  }}
                >
                  {tutors.length < MOCK_TUTORS.length ? 'Hiện tất cả' : 'Lọc'}
                </span>
              </div>
              
              <div className="space-y-4">
                {tutors.map(tutor => (
                  <TutorCard 
                    key={tutor.id} 
                    tutor={tutor} 
                    onClick={openTutorProfile} 
                  />
                ))}
                {tutors.length === 0 && (
                   <div className="text-center py-10 text-gray-400">
                     <p>Không tìm thấy kết quả.</p>
                     <button 
                       onClick={() => {
                          setSearchQuery('');
                          setTutors(MOCK_TUTORS);
                       }}
                       className="text-primary text-sm mt-2 font-bold"
                      >
                        Quay lại danh sách
                      </button>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* CAREER VIEW */}
          {view === ViewState.CAREER && (
              <CareerScreen userProfile={userProfile} />
          )}

          {/* ACTIVITY VIEW */}
          {view === ViewState.ACTIVITY && (
            <div className="pt-12">
               <div className="px-4 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                 <h1 className="text-2xl font-bold text-gray-800 pt-4">Lịch sử & Lớp học</h1>
               </div>
               <ActivityList 
                 bookings={bookings} 
                 currentTime={currentTime} 
                 onCancelBooking={handleCancelBooking}
                 onEditBooking={handleEditBooking}
               />
            </div>
          )}

          {/* ACCOUNT VIEW */}
          {view === ViewState.ACCOUNT && (
            <AccountScreen 
              userProfile={userProfile} 
              onUpdateProfile={setUserProfile}
              onLogout={handleLogout} 
            />
          )}

          {/* BOOKING SUCCESS VIEW */}
          {view === ViewState.BOOKING_SUCCESS && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt gia sư thành công!</h2>
              <p className="text-gray-500 mb-8">Yêu cầu của bạn đang được xử lý. Bạn có thể theo dõi trong mục Hoạt động.</p>
              <div className="w-full space-y-3">
                <button 
                  onClick={() => setView(ViewState.ACTIVITY)}
                  className="w-full bg-white border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  Xem Hoạt động
                </button>
                <button 
                  onClick={() => setView(ViewState.HOME)}
                  className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 transition-colors"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* === BOTTOM NAVIGATION === */}
        {view !== ViewState.BOOKING_SUCCESS && renderBottomNav()}

        {/* === MODALS === */}
        {selectedTutorForProfile && (
          <TutorProfileModal
            tutor={selectedTutorForProfile}
            onClose={() => setSelectedTutorForProfile(null)}
            onBook={openBookingFromProfile}
          />
        )}

        {selectedTutorForBooking && (
            <BookingModal
                tutor={selectedTutorForBooking}
                onClose={() => {
                    setSelectedTutorForBooking(null);
                    setBookingToEdit(null);
                }}
                onConfirmData={(data) => handleBookingConfirm(data)} 
            />
        )}

        {showChat && (
          <ChatBot onClose={() => setShowChat(false)} />
        )}

      </div>
    </div>
  );
};

export default App;