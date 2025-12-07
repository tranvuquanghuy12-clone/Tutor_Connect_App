import React from 'react';
import { Tutor } from '../types';

interface TutorCardProps {
  tutor: Tutor;
  onClick: (tutor: Tutor) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onClick }) => {
  return (
    <div 
      onClick={() => onClick(tutor)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 active:scale-95 transition-transform cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img 
            src={tutor.avatar} 
            alt={tutor.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
          />
          {tutor.available && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800 text-lg">{tutor.name}</h3>
            <span className="bg-green-100 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              {tutor.rating} ★
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mb-1">{tutor.school}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {tutor.subjects.map(sub => (
              <span key={sub} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {sub}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-end mt-2">
            <div className="text-xs text-gray-400">
              Cách đây {tutor.distance} km
            </div>
            <div className="text-primary font-bold text-base">
              {tutor.hourlyRate.toLocaleString('vi-VN')}đ<span className="text-xs font-normal text-gray-500">/giờ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;