import React, { useState, useEffect } from 'react';
import { ClassSession, UserProfile } from '../types';
import { X, Calendar, Clock, MapPin, User, CheckCircle2, Ticket, AlertCircle, LogIn, Sparkles, Check, Users } from 'lucide-react';

interface BookingModalProps {
  session: ClassSession | null;
  user: UserProfile | null;
  isLoggedIn?: boolean;
  onClose: () => void;
  onConfirmBooking: (session: ClassSession, bookedFor: string) => void;
  onOpenAddCredits: () => void;
  onRequireLogIn?: () => void;
}

interface TimeSlot {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  spotsLeft: number;
  instructor?: string;
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

  // Available Dates List
  const availableDates = [
    { label: 'Today', fullDate: session.date || 'Today', dayName: 'Today' },
    { label: 'Thu, 20 Aug', fullDate: 'Thu, 20 Aug', dayName: 'Tomorrow' },
    { label: 'Fri, 21 Aug', fullDate: 'Fri, 21 Aug', dayName: 'Friday' },
    { label: 'Sat, 22 Aug', fullDate: 'Sat, 22 Aug', dayName: 'Saturday' },
    { label: 'Sun, 23 Aug', fullDate: 'Sun, 23 Aug', dayName: 'Sunday' },
    { label: 'Mon, 24 Aug', fullDate: 'Mon, 24 Aug', dayName: 'Monday' },
  ];

  // Timings Schedule Map
  const availableTimingsByDate: Record<string, TimeSlot[]> = {
    default: [
      { id: 't1', time: '10:00 AM - 11:15 AM', period: 'Morning', spotsLeft: 5, instructor: session.instructor },
      { id: 't2', time: '11:30 AM - 12:45 PM', period: 'Morning', spotsLeft: 2, instructor: session.instructor },
      { id: 't3', time: '2:00 PM - 3:15 PM', period: 'Afternoon', spotsLeft: 6, instructor: session.instructor },
      { id: 't4', time: session.time || '4:30 PM - 5:45 PM', period: 'Afternoon', spotsLeft: 4, instructor: session.instructor },
      { id: 't5', time: '5:30 PM - 6:45 PM', period: 'Evening', spotsLeft: 3, instructor: session.instructor },
      { id: 't6', time: '7:00 PM - 8:15 PM', period: 'Evening', spotsLeft: 1, instructor: session.instructor },
    ],
  };

  const [selectedDate, setSelectedDate] = useState<string>(session.date || availableDates[0].fullDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(session.time || '4:30 PM - 5:45 PM');
  const [selectedAttendee, setSelectedAttendee] = useState<string>(
    session.forKids && user.familyMembers && user.familyMembers.length > 0
      ? user.familyMembers[0].name
      : user.name
  );

  useEffect(() => {
    if (session) {
      setSelectedDate(session.date || availableDates[0].fullDate);
      setSelectedTimeSlot(session.time || '4:30 PM - 5:45 PM');
    }
  }, [session]);

  const currentSlots = availableTimingsByDate.default;
  const hasEnoughCredits = user.credits >= session.credits;
  const remainingCredits = user.credits - session.credits;

  const handleConfirm = () => {
    const updatedSession: ClassSession = {
      ...session,
      date: selectedDate,
      time: selectedTimeSlot,
    };
    onConfirmBooking(updatedSession, selectedAttendee);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200 max-h-[92vh] overflow-y-auto my-auto border border-[#c3c5d9]/30">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#c3c5d9]/30 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#191c1e] tracking-tight">Select Date & Time</h3>
            <p className="text-xs text-[#434656]">Choose your preferred session slot</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#434656] hover:text-black rounded-full hover:bg-[#f3f4f6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio & Class Banner */}
        <div className="bg-[#f8f9fb] rounded-xl p-3.5 border border-[#c3c5d9]/30 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0042c8] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {session.credits}cr
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#0042c8] uppercase tracking-wider bg-blue-100/70 px-2 py-0.5 rounded-full inline-block mb-0.5">
              {session.studioName}
            </span>
            <h4 className="text-sm font-extrabold text-[#191c1e] truncate">{session.title}</h4>
            <p className="text-xs text-[#434656] flex items-center gap-2 mt-0.5">
              <span>{session.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0042c8]" />
                {session.location}
              </span>
            </p>
          </div>
        </div>

        {/* 1. SELECT AVAILABLE DATE */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#191c1e] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0042c8]" />
              1. Available Dates
            </span>
            <span className="text-[11px] font-semibold text-[#0042c8]">{selectedDate}</span>
          </label>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.fullDate;
              return (
                <button
                  type="button"
                  key={item.fullDate}
                  onClick={() => setSelectedDate(item.fullDate)}
                  className={`flex-1 min-w-[95px] p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0042c8] text-white border-[#0042c8] shadow-sm font-bold scale-102'
                      : 'bg-[#f8f9fb] text-[#191c1e] border-[#c3c5d9]/40 hover:bg-[#edeef0] font-medium'
                  }`}
                >
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">{item.dayName}</p>
                  <p className="text-xs font-extrabold mt-0.5">{item.fullDate}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SELECT AVAILABLE TIMING */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#191c1e] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0042c8]" />
              2. Available Timings
            </span>
            <span className="text-[11px] text-[#434656]">Live seat updates</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {currentSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;
              return (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot.time)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#0042c8] text-[#0042c8] shadow-2xs ring-2 ring-[#0042c8]/20'
                      : 'bg-[#f8f9fb] border-[#c3c5d9]/40 text-[#191c1e] hover:bg-white hover:border-[#0042c8]/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-[#434656] uppercase tracking-wider">
                      {slot.period}
                    </span>
                    {isSelected && (
                      <span className="bg-[#0042c8] text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-extrabold text-[#191c1e] my-1">{slot.time}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{slot.spotsLeft} spots available</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. ATTENDEE SELECTION */}
        <div className="space-y-1.5 pt-1 border-t border-[#c3c5d9]/20">
          <label className="text-xs font-extrabold text-[#191c1e] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#0042c8]" />
            <span>3. Who is taking this class?</span>
          </label>
          <select
            value={selectedAttendee}
            onChange={(e) => setSelectedAttendee(e.target.value)}
            className="w-full text-xs font-bold p-2.5 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl focus:ring-2 focus:ring-[#0042c8] outline-hidden text-[#191c1e]"
          >
            <option value={user.name}>{user.name} (Primary Account)</option>
            {user.familyMembers.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name} ({member.relation}, Age {member.age})
              </option>
            ))}
          </select>
        </div>

        {/* CREDIT BREAKDOWN */}
        <div className="bg-[#f8f9fb] rounded-xl p-3.5 border border-[#c3c5d9]/30 space-y-2 text-xs">
          <div className="flex justify-between items-center text-[#434656]">
            <span>Your Credit Balance</span>
            <span className="font-bold text-[#191c1e]">{user.credits} credits</span>
          </div>
          <div className="flex justify-between items-center text-[#434656]">
            <span>Class Booking Fee</span>
            <span className="font-bold text-[#0042c8]">- {session.credits} credits</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#c3c5d9]/30 font-bold">
            <span className="text-[#191c1e]">Remaining Balance After Booking</span>
            <span className={remainingCredits >= 0 ? 'text-emerald-600 font-extrabold' : 'text-red-600 font-extrabold'}>
              {remainingCredits} credits
            </span>
          </div>
        </div>

        {/* Insufficient Credits Alert */}
        {!hasEnoughCredits && (
          <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <div>
              You need {session.credits - user.credits} more credits to reserve this class.
            </div>
          </div>
        )}

        {/* CONFIRM BUTTON */}
        <div className="pt-1">
          {hasEnoughCredits ? (
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full bg-[#0042c8] text-white text-xs font-extrabold py-3.5 rounded-full hover:bg-[#003ab2] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Confirm Booking ({selectedDate} @ {selectedTimeSlot})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddCredits();
              }}
              className="w-full bg-emerald-600 text-white text-xs font-extrabold py-3.5 rounded-full hover:bg-emerald-700 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Top Up Credits Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

