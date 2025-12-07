import { Tutor } from '../types';

export const MOCK_TUTORS: Tutor[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    avatar: 'https://picsum.photos/200/200?random=1',
    subjects: ['Đại số tuyến tính', 'Giải tích 1', 'Toán Cao Cấp'],
    rating: 4.8,
    reviews: 120,
    hourlyRate: 150000,
    distance: 1.2,
    bio: 'Sinh viên năm 3 ĐH Bách Khoa, GPA 3.6/4.0. Chuyên trị các môn Toán đại cương cho sinh viên năm nhất.',
    school: 'ĐH Bách Khoa HN',
    gpa: 3.6,
    available: true,
    transcript: [
      { subject: 'Giải tích 1', score: 'A' },
      { subject: 'Giải tích 2', score: 'A' },
      { subject: 'Đại số tuyến tính', score: 'A+' },
      { subject: 'Vật lý đại cương', score: 'B+' },
      { subject: 'Nhập môn CNTT', score: 'A' }
    ]
  },
  {
    id: '2',
    name: 'Trần Thị Thu Hà',
    avatar: 'https://picsum.photos/200/200?random=2',
    subjects: ['Tiếng Anh', 'IELTS', 'Triết học Mác-Lênin'],
    rating: 4.9,
    reviews: 85,
    hourlyRate: 200000,
    distance: 2.5,
    bio: 'IELTS 8.0. Hỗ trợ qua môn Triết học và Kinh tế chính trị với phương pháp sơ đồ tư duy dễ nhớ.',
    school: 'ĐH Ngoại Thương',
    gpa: 3.9,
    available: true,
    transcript: [
      { subject: 'Triết học Mác-Lênin', score: 'A' },
      { subject: 'Kinh tế chính trị', score: 'A' },
      { subject: 'Tiếng Anh thương mại', score: 'A+' },
      { subject: 'Marketing căn bản', score: 'A' }
    ]
  },
  {
    id: '3',
    name: 'Lê Minh Tuấn',
    avatar: 'https://picsum.photos/200/200?random=3',
    subjects: ['Cấu trúc dữ liệu', 'Lập trình C++', 'Java'],
    rating: 4.6,
    reviews: 45,
    hourlyRate: 180000,
    distance: 0.8,
    bio: 'Thành thạo thuật toán, hỗ trợ đồ án môn học CNTT.',
    school: 'ĐH Công Nghệ - ĐHQGHN',
    gpa: 3.2,
    available: true,
    transcript: [
      { subject: 'Nhập môn lập trình', score: 'A' },
      { subject: 'Cấu trúc dữ liệu & GT', score: 'B+' },
      { subject: 'Lập trình hướng đối tượng', score: 'A' },
      { subject: 'Kiến trúc máy tính', score: 'B' }
    ]
  },
  {
    id: '4',
    name: 'Phạm Ngọc Mai',
    avatar: 'https://picsum.photos/200/200?random=4',
    subjects: ['Pháp luật đại cương', 'Tư tưởng HCM', 'Văn'],
    rating: 5.0,
    reviews: 200,
    hourlyRate: 120000,
    distance: 3.0,
    bio: 'Giọng nói truyền cảm, phương pháp dạy sáng tạo, giúp các bạn khối kỹ thuật không còn sợ môn lý luận.',
    school: 'ĐH Luật HN',
    gpa: 3.7,
    available: false,
    transcript: [
      { subject: 'Lý luận nhà nước & pháp luật', score: 'A' },
      { subject: 'Luật Hiến pháp', score: 'A-' },
      { subject: 'Tư tưởng Hồ Chí Minh', score: 'A' },
      { subject: 'Lịch sử Đảng', score: 'B+' }
    ]
  },
  {
    id: '5',
    name: 'Hoàng Quốc Bảo',
    avatar: 'https://picsum.photos/200/200?random=5',
    subjects: ['Xác suất thống kê', 'Kinh tế vi mô'],
    rating: 4.7,
    reviews: 30,
    hourlyRate: 250000,
    distance: 5.0,
    bio: 'Sinh viên giỏi, hỗ trợ giải bài tập xác suất và kinh tế lượng.',
    school: 'ĐH Kinh Tế Quốc Dân',
    gpa: 3.5,
    available: true,
    transcript: [
      { subject: 'Toán cao cấp cho KT', score: 'B+' },
      { subject: 'Xác suất thống kê', score: 'A' },
      { subject: 'Kinh tế lượng', score: 'A-' },
      { subject: 'Kinh tế Vi mô', score: 'A' }
    ]
  },
  {
    id: '6',
    name: 'Vũ Thanh Hằng',
    avatar: 'https://picsum.photos/200/200?random=6',
    subjects: ['Tiếng Trung', 'HSK 3-4-5'],
    rating: 4.8,
    reviews: 60,
    hourlyRate: 160000,
    distance: 1.5,
    bio: 'HSK 6, Topik 5. Vui vẻ, nhiệt tình, dạy giao tiếp và luyện thi.',
    school: 'ĐH Hà Nội',
    gpa: 3.8,
    available: true,
    transcript: [
      { subject: 'Tiếng Trung tổng hợp 1', score: 'A+' },
      { subject: 'Tiếng Trung tổng hợp 2', score: 'A' },
      { subject: 'Văn hóa Trung Quốc', score: 'A' },
      { subject: 'Dịch thuật', score: 'B+' }
    ]
  }
];