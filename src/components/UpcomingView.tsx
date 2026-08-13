import React, { useState } from 'react';
import { Booking } from '../types';
import { Calendar as CalendarIcon, MapPin, Clock, User, XCircle, Share2, CheckCircle2 } from 'lucide-react';

interface UpcomingViewProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onNavigateSearch: () => void;
}

export const UpcomingView: React.FC<UpcomingViewProps> = ({
  bookings,
  onCancelBooking,
  onNavigateSearch,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const displayed = activeTab === 'upcoming' ? activeBookings : pastBookings;

  const handleCancelClick = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? Credits will be refunded to your balance.')) {
      onCancelBooking(bookingId);
    }
  };

  const handleAddToCalendar = (booking: Booking) => {
    const text = encodeURIComponent(`Class: ${booking.classSession.title} at ${booking.classSession.studioName}`);
    const details = encodeURIComponent(`Instructor: ${booking.classSession.instructor}\nLocation: ${booking.classSession.location}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-2xl mx-auto">
      {/* FILTER TAB TOGGLE */}
      <div className="flex bg-[#e7e8ea] p-1 rounded-full border border-[#c3c5d9]/30">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
            activeTab === 'upcoming' ? 'bg-white text-[#0042c8] shadow-xs' : 'text-[#434656] hover:text-[#191c1e]'
          }`}
        >
          Upcoming ({activeBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
            activeTab === 'past' ? 'bg-white text-[#0042c8] shadow-xs' : 'text-[#434656] hover:text-[#191c1e]'
          }`}
        >
          Past History
        </button>
      </div>

      {/* BOOKINGS LIST */}
      {displayed.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#c3c5d9]/30 p-6 space-y-3">
          <CalendarIcon className="w-12 h-12 text-[#c3c5d9] mx-auto" />
          <h3 className="text-base font-bold text-[#191c1e]">No {activeTab} bookings</h3>
          <p className="text-xs text-[#434656] max-w-xs mx-auto">
            {activeTab === 'upcoming'
              ? "You haven't reserved any upcoming classes yet. Explore Pilates, Yoga, or Kids Enrichment!"
              : 'Your past completed and cancelled class history will appear here.'}
          </p>
          {activeTab === 'upcoming' && (
            <button
              onClick={onNavigateSearch}
              className="mt-2 bg-[#0042c8] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#003ab2] transition-colors"
            >
              Discover & Book Classes
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((booking) => {
            const session = booking.classSession;
            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-[#c3c5d9]/30 p-4 sm:p-5 shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="inline-block bg-[#e8f1ff] text-[#0042c8] text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                      {session.date} · {session.time}
                    </span>
                    <h3 className="text-base font-bold text-[#191c1e]">{session.title}</h3>
                    <p className="text-xs font-semibold text-[#0042c8]">{session.studioName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-[#0042c8]">{session.credits} cr</span>
                    <span className="text-[10px] text-[#434656] block">
                      For: {booking.bookedFor}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#434656] bg-[#f8f9fb] p-3 rounded-lg border border-[#c3c5d9]/20">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0042c8]" />
                    <span className="truncate">{session.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0042c8]" />
                    <span className="truncate">{session.location}</span>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#c3c5d9]/20">
                    <button
                      onClick={() => handleAddToCalendar(booking)}
                      className="text-xs font-semibold text-[#0042c8] hover:underline flex items-center gap-1"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" /> Add to Calendar
                    </button>

                    <button
                      onClick={() => handleCancelClick(booking.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                    </button>
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pt-1">
                    <XCircle className="w-4 h-4" /> Cancelled (Credits Refunded)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
