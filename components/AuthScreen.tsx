import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation and API call here
    if (phone.length < 9) {
      alert("Số điện thoại không hợp lệ");
      return;
    }
    onLogin();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎓</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {isRegister ? 'Đăng ký tài khoản' : 'Chào mừng trở lại!'}
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          {isRegister ? 'Tìm gia sư đại học dễ dàng hơn bao giờ hết' : 'Đăng nhập để tiếp tục'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
             <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
             <input
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
               placeholder="Nguyễn Văn A"
               required
             />
           </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0912xxx..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all mt-4"
          >
            {isRegister ? 'Đăng Ký' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-primary font-bold hover:underline"
            >
              {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;