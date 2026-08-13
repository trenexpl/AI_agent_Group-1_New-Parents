import React from 'react';
import { Booking } from '../types';
import { CheckCircle2, Calendar, Clock, MapPin, User, Ticket, ArrowRight, Sparkles, X } from 'lucide-react';

interface BookingSuccessModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToBookings: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  isOpen,
  onClose,
  onGoToBookings,
}) => {
  if (!isOpen || !booking) return null;

  const { classSession, bookedFor } = booking;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl overflow-hidden border border-[#c3c5d9]/30 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Success Header Icon */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Booking Confirmed
          </span>
          <h3 className="text-2xl font-black text-[#191c1e] tracking-tight">You're All Set!</h3>
          <p className="text-xs text-[#434656] max-w-xs mx-auto">
            Your spot has been reserved. A confirmation email and calendar invite have been generated.
          </p>
        </div>

        {/* Booking Ticket Summary Card */}
        <div className="bg-[#f8f9fb] rounded-2xl p-4 border border-[#c3c5d9]/40 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start border-b border-[#c3c5d9]/30 pb-2.5">
            <div>
              <span className="text-[10px] font-bold text-[#0042c8] uppercase tracking-wider bg-blue-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                {classSession.studioName}
              </span>
              <h4 className="text-base font-extrabold text-[#191c1e] leading-snug">{classSession.title}</h4>
            </div>
            <span className="text-xs font-black text-[#0042c8] bg-white px-2.5 py-1 rounded-lg border border-[#c3c5d9]/30 shrink-0 shadow-2xs">
              {classSession.credits} cr
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs text-[#434656] pt-0.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0042c8] shrink-0" />
              <span className="font-bold text-[#191c1e]">{classSession.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0042c8] shrink-0" />
              <span className="font-bold text-[#191c1e]">{classSession.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#0042c8] shrink-0" />
              <span>
                Attendee: <strong className="text-[#191c1e]">{bookedFor || 'Primary Account'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0042c8] shrink-0" />
              <span className="truncate">{classSession.location}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-[#c3c5d9]/50 pt-2 flex justify-between items-center text-[11px] text-[#434656]">
            <span>Booking ID: <strong className="font-mono text-[#191c1e]">{booking.id}</strong></span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" /> Pass Ready
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onGoToBookings}
            className="w-full bg-[#0042c8] hover:bg-[#0036a3] text-white font-extrabold text-xs py-3.5 rounded-full shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Go to My Bookings Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#f8f9fb] hover:bg-[#edeef0] text-[#191c1e] font-bold text-xs py-3 rounded-full border border-[#c3c5d9]/30 transition-colors cursor-pointer"
          >
            Browse More Classes
          </button>
        </div>

      </div>
    </div>
  );
};
