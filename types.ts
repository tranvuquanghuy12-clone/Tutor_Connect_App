export interface Grade {
  subject: string;
  score: string; // e.g. "A", "B+", "9.5"
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  rating: number;
  reviews: number;
  hourlyRate: number; // In VND
  distance: number; // In km
  bio: string;
  school: string; // University/College
  gpa: number; // New: GPA on a 4.0 scale
  transcript: Grade[]; // Detailed grades
  available: boolean;
}

export enum ViewState {
  AUTH = 'AUTH',
  HOME = 'HOME', // New Dashboard
  SEARCH = 'SEARCH', // Old Home (Tutor Search)
  CAREER = 'CAREER', // New AI Career Guidance
  ACTIVITY = 'ACTIVITY',
  ACCOUNT = 'ACCOUNT',
  BOOKING_SUCCESS = 'BOOKING_SUCCESS'
}

export enum BookingStatus {
  PENDING = 'Đang tìm xe', // Using "Xe" metaphor or just "Đang xử lý"
  CONFIRMED = 'Đã nhận',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã hủy'
}

export interface Booking {
  id: string;
  tutor: Tutor;
  subject: string;
  time: string; // ISO string
  note: string;
  status: BookingStatus;
  timestamp: number;
  cost: number;
  meetLink?: string;
}

export interface UserGrade {
  id: string;
  subjectName: string;
  scoreNumber: string; // e.g. "8.5"
  scoreLetter: string; // e.g. "A"
}

export interface SchoolScheduleItem {
  id: string;
  subject: string;
  day: string; // "Thứ 2", "Thứ 3", etc.
  startTime: string; // "07:00"
  endTime: string; // "09:00"
  room: string;
  startDate?: string;
  endDate?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  school: string;
  year: string; // e.g. "Sinh viên năm 3"
  studentId: string;
  dob: string;
  balance: number;
  isPro: boolean;
  uniqueCode: string; // For deposit
  grades: UserGrade[];
  schoolSchedule: SchoolScheduleItem[];
}