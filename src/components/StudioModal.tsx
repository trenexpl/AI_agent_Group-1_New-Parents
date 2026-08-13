import React from 'react';
import { Studio, ClassSession } from '../types';
import { X, Star, MapPin, CheckCircle, Ticket, Calendar, Clock, User, Heart } from 'lucide-react';

interface StudioModalProps {
  studio: Studio | null;
  favorites: Record<string, boolean>;
  onToggleFavorite: (studioId: string) => void;
  onClose: () => void;
  onBookClass: (session: ClassSession) => void;
  onOpenReviews: (studio: Studio) => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({
  studio,
  favorites,
  onToggleFavorite,
  onClose,
  onBookClass,
  onOpenReviews,
}) => {
  if (!studio) return null;

  const isFav = favorites[studio.id];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
      <div className="bg-white w-full max-w-xl rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Modal Image Header */}
        <div className="relative h-56 sm:h-64 w-full bg-[#e1e2e4] shrink-0">
          <img src={studio.image} alt={studio.name} className="w-full h-full object-cover" />
          <button
            onClick={() => onToggleFavorite(studio.id)}
            className={`absolute top-4 right-16 p-2 rounded-full transition-all active:scale-90 shadow-md ${
              isFav
                ? 'bg-white text-red-500 ring-2 ring-red-500/20'
                : 'bg-black/50 backdrop-blur-xs text-white hover:text-red-400'
            }`}
            title={isFav ? 'Remove from priority favorites' : 'Prioritize under Search & Studios'}
          >
            <Heart className={`w-5 h-5 transition-all ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenReviews(studio);
            }}
            className="absolute bottom-4 left-4 bg-[#E8F1FF] hover:bg-white px-3 py-1.5 rounded-full border border-[#0042c8]/20 flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Click to view & write parent reviews"
          >
            <Star className="w-4 h-4 fill-[#0056FF] text-[#0056FF]" />
            <span className="text-xs font-bold text-[#0056FF]">{studio.rating}</span>
            <span className="text-xs text-[#0056FF] font-semibold underline">
              ({(studio.reviews ? studio.reviews.length : studio.reviewCount).toLocaleString()} parent reviews)
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className="text-2xl font-extrabold text-[#191c1e] tracking-tight">{studio.name}</h2>
              <span className="bg-[#f3f4f6] text-[#0042c8] font-extrabold text-xs px-3 py-1 rounded-full border border-[#c3c5d9]/30">
                {studio.credits} credits / session
              </span>
            </div>
            <p className="text-xs font-semibold text-[#434656] flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#0042c8]" />
              {studio.address}
            </p>
          </div>

          <p className="text-xs text-[#434656] leading-relaxed">{studio.description}</p>

          {/* Amenities */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">Studio Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {studio.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-[#f8f9fb] text-[#191c1e] text-xs font-medium px-3 py-1 rounded-full border border-[#c3c5d9]/30 flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3 text-[#0042c8]" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Schedule / Upcoming Sessions */}
          <div className="space-y-3 pt-2 border-t border-[#c3c5d9]/30">
            <h4 className="text-sm font-bold text-[#191c1e] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0042c8]" />
              Upcoming Class Schedule
            </h4>

            <div className="space-y-2.5">
              {studio.upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-3.5 bg-[#f8f9fb] rounded-xl border border-[#c3c5d9]/30 flex justify-between items-center hover:border-[#0042c8]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#0042c8]">{cls.time}</span>
                      <span className="text-[11px] text-[#434656]">· {cls.date}</span>
                    </div>
                    <h5 className="text-sm font-bold text-[#191c1e]">{cls.title}</h5>
                    <p className="text-xs text-[#434656] flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-[#0042c8]" />
                      {cls.instructor}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onBookClass(cls);
                    }}
                    className="bg-[#0042c8] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#003ab2] active:scale-95 transition-all shadow-xs shrink-0"
                  >
                    Book ({cls.credits} cr)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
