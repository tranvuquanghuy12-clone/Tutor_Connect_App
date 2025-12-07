import React, { useState } from 'react';
import { Tutor, ViewState, Booking, BookingStatus, UserProfile } from './types';
import { MOCK_TUTORS } from './services/mockData';
import TutorCard from './components/TutorCard';
import BookingModal from './components/BookingModal';
import ChatBot from './components/ChatBot';
import AuthScreen from './components/AuthScreen';
import ActivityList from './components/ActivityList';
import TutorProfileModal from './components/TutorProfileModal';
import AccountScreen from './components/AccountScreen'; // Import AccountScreen
import { matchTutors } from './services/geminiService';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  
  // Data State
  const [tutors, setTutors] = useState<Tutor[]>(MOCK_TUTORS);
  const [bookings, setBookings] = useState<Booking[]>([]); // Store bookings locally
  
  // User Profile State (Lifted from AccountScreen to persist)
  const [userProfile, setUserProfile] = useState<UserProfile>({
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
    ]
  });

  // Selection State
  const [selectedTutorForProfile, setSelectedTutorForProfile] = useState<Tutor | null>(null);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<Tutor | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // UI State
  const [showChat, setShowChat] = useState(false);

  // --- Actions ---

  const handleLogin = () => {
    setView(ViewState.HOME);
  };

  const handleLogout = () => {
    setView(ViewState.AUTH);
  };

  const handleSearch = async () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setTutors(MOCK_TUTORS);
      return;
    }

    setIsSearching(true);
    
    try {
      // 1. First, try simple client-side filtering (Robust Fallback)
      // Checks names, subjects, school, and even transcript subjects
      const localMatches = MOCK_TUTORS.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.subjects.some(s => s.toLowerCase().includes(query)) ||
        t.school.toLowerCase().includes(query) ||
        t.transcript.some(gr => gr.subject.toLowerCase().includes(query))
      );

      // 2. Use AI to understand semantic matches (e.g., "Math" -> "Đại số", "Giải tích")
      const rankedIds = await matchTutors(query, MOCK_TUTORS);
      
      let finalTutors: Tutor[] = [];

      if (rankedIds && rankedIds.length > 0) {
         // If AI returns results, prioritize them
         const aiMatches = MOCK_TUTORS.filter(t => rankedIds.includes(t.id));
         
         // Sort AI matches by rank order
         aiMatches.sort((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id));

         // Combine AI matches with local matches that AI might have missed (deduplicate)
         const aiIds = new Set(aiMatches.map(t => t.id));
         const uniqueLocalMatches = localMatches.filter(t => !aiIds.has(t.id));
         
         finalTutors = [...aiMatches, ...uniqueLocalMatches];
      } else {
         // If AI fails or finds nothing, use local matches
         finalTutors = localMatches;
      }

      setTutors(finalTutors);

    } catch (e) {
      console.error("Search failed", e);
      // Fallback to local
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
    setSelectedTutorForProfile(null); // Close profile
    setSelectedTutorForBooking(tutor); // Open booking
  };

  const handleBookingConfirm = (bookingData: {subject: string, time: string, note: string}) => {
    if (!selectedTutorForBooking) return;

    // Create new booking object
    const newBooking: Booking = {
      id: Date.now().toString(),
      tutor: selectedTutorForBooking,
      subject: bookingData.subject,
      time: bookingData.time,
      note: bookingData.note,
      status: BookingStatus.PENDING,
      timestamp: Date.now()
    };

    // Simulate API delay
    setTimeout(() => {
      setBookings(prev => [...prev, newBooking]);
      
      // Auto confirm for demo after 3 seconds
      setTimeout(() => {
        setBookings(current => current.map(b => 
          b.id === newBooking.id ? {...b, status: BookingStatus.CONFIRMED} : b
        ));
      }, 5000);

      setSelectedTutorForBooking(null);
      setView(ViewState.BOOKING_SUCCESS);
    }, 1000);
  };

  // --- RENDER HELPERS ---

  if (view === ViewState.AUTH) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* === HEADER (Only on Home) === */}
        {view === ViewState.HOME && (
          <div className="bg-primary pt-12 pb-6 px-6 rounded-b-3xl shadow-lg z-10 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">TutorConnect</h1>
                <p className="text-green-100 text-sm">Gia sư Đại Học uy tín</p>
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
          
          {/* HOME VIEW */}
          {view === ViewState.HOME && (
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

          {/* ACTIVITY VIEW */}
          {view === ViewState.ACTIVITY && (
            <div className="pt-12">
               <div className="px-4 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                 <h1 className="text-2xl font-bold text-gray-800 pt-4">Lịch sử</h1>
               </div>
               <ActivityList bookings={bookings} />
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
        {view !== ViewState.BOOKING_SUCCESS && (
          <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => setView(ViewState.HOME)}
              className={`flex flex-col items-center w-16 transition-colors ${view === ViewState.HOME ? 'text-primary' : 'text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-[10px] font-bold">Trang chủ</span>
            </button>
            
            <button 
              onClick={() => setView(ViewState.ACTIVITY)}
              className={`flex flex-col items-center w-16 transition-colors ${view === ViewState.ACTIVITY ? 'text-primary' : 'text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-[10px] font-bold">Hoạt động</span>
            </button>
            
            <button 
              onClick={() => setView(ViewState.ACCOUNT)}
              className={`flex flex-col items-center w-16 transition-colors ${view === ViewState.ACCOUNT ? 'text-primary' : 'text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-bold">Tài khoản</span>
            </button>
          </div>
        )}

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
                onClose={() => setSelectedTutorForBooking(null)}
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