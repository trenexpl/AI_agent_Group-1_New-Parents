import React, { useState } from 'react';
import { ClassSession, UserProfile } from '../types';
import { X, Calendar, Clock, MapPin, User, CheckCircle2, Ticket, AlertCircle, LogIn } from 'lucide-react';

interface BookingModalProps {
  session: ClassSession | null;
  user: UserProfile | null;
  isLoggedIn?: boolean;
  onClose: () => void;
  onConfirmBooking: (session: ClassSession, bookedFor: string) => void;
  onOpenAddCredits: () => void;
  onRequireLogIn?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  session,
  user,
  isLoggedIn = true,
  onClose,
  onConfirmBooking,
  onOpenAddCredits,
  onRequireLogIn,
}) => {
  if (!session) return null;

  if (!isLoggedIn || !user) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-5 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200 text-center">
          <div className="flex justify-between items-center border-b border-[#c3c5d9]/30 pb-3 text-left">
            <h3 className="text-base font-extrabold text-[#191c1e]">Log In Required</h3>
            <button onClick={onClose} className="p-1 text-[#434656] hover:text-black cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-12 h-12 bg-[#0042c8]/10 text-[#0042c8] rounded-full flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-[#191c1e]">{session.title}</h4>
            <p className="text-xs text-[#434656] mt-1">
              Please log in or sign up for a Happy Parents account to reserve this class.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onRequireLogIn) onRequireLogIn();
            }}
            className="w-full bg-[#0042c8] text-white font-bold text-xs py-3 rounded-full hover:bg-[#0036a3] transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Go to Log In / Sign Up</span>
          </button>
        </div>
      </div>
    );
  }

  const [selectedAttendee, setSelectedAttendee] = useState<string>(
    session.forKids && user.familyMembers && user.familyMembers.length > 0
      ? user.familyMembers[0].name
      : user.name
  );

  const hasEnoughCredits = user.credits >= session.credits;
  const remainingCredits = user.credits - session.credits;


  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200">
        <div className="flex justify-between items-center border-b border-[#c3c5d9]/30 pb-3">
          <h3 className="text-lg font-extrabold text-[#191c1e]">Confirm Class Booking</h3>
          <button onClick={onClose} className="p-1 text-[#434656] hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Class Details Card */}
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-[#c3c5d9]/30 space-y-2">
          <span className="text-[11px] font-bold text-[#0042c8] uppercase tracking-wider bg-[#c2e0ff] px-2.5 py-0.5 rounded-full">
            {session.studioName}
          </span>
          <h4 className="text-base font-bold text-[#191c1e]">{session.title}</h4>

          <div className="grid grid-cols-2 gap-2 text-xs text-[#434656] pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0042c8]" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0042c8]" />
              <span>{session.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0042c8]" />
              <span className="truncate">{session.instructor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0042c8]" />
              <span className="truncate">{session.location}</span>
            </div>
          </div>
        </div>

        {/* Attendee Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#191c1e] block">Who is taking this class?</label>
          <select
            value={selectedAttendee}
            onChange={(e) => setSelectedAttendee(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-lg focus:ring-2 focus:ring-[#0042c8] outline-hidden"
          >
            <option value={user.name}>{user.name} (Primary Account)</option>
            {user.familyMembers.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name} ({member.relation}, Age {member.age})
              </option>
            ))}
          </select>
        </div>

        {/* Credit Breakdown */}
        <div className="space-y-2 pt-2 border-t border-[#c3c5d9]/30">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#434656]">Current Credit Balance:</span>
            <span className="font-bold text-[#191c1e]">{user.credits} credits</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#434656]">Class Cost:</span>
            <span className="font-bold text-[#0042c8]">- {session.credits} credits</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-[#c3c5d9]/20">
            <span className="font-bold text-[#191c1e]">Remaining Balance:</span>
            <span
              className={`font-extrabold ${
                remainingCredits >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {remainingCredits} credits
            </span>
          </div>
        </div>

        {/* Insufficient Credits Alert */}
        {!hasEnoughCredits && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <div>
              You need {session.credits - user.credits} more credits to book this class.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2">
          {hasEnoughCredits ? (
            <button
              onClick={() => onConfirmBooking(session, selectedAttendee)}
              className="w-full bg-[#0042c8] text-white text-sm font-bold py-3 rounded-full hover:bg-[#003ab2] active:scale-95 transition-all shadow-sm"
            >
              Confirm Booking ({session.credits} cr)
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAddCredits();
              }}
              className="w-full bg-emerald-600 text-white text-sm font-bold py-3 rounded-full hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
            >
              Top Up Credits Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
