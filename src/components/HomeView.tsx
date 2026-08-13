import React from 'react';
import { Studio, ClassSession } from '../types';
import { Star, MoreHorizontal, ArrowRight, Heart, Sparkles, Users, Award } from 'lucide-react';
import { DisqusForum } from './DisqusForum';

interface HomeViewProps {
  recommendedStudios: Studio[];
  favorites: Record<string, boolean>;
  onToggleFavorite: (studioId: string) => void;
  onSelectStudio: (studio: Studio) => void;
  onBookClass: (session: ClassSession) => void;
  onOpenReferral: () => void;
  onNavigateSearch: () => void;
  onOpenReviews: (studio: Studio) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  recommendedStudios,
  favorites,
  onToggleFavorite,
  onSelectStudio,
  onBookClass,
  onOpenReferral,
  onNavigateSearch,
  onOpenReviews,
}) => {
  // Featured recurring class session for "Consistency is key" - CodeKids Robotics
  const roboticsStudio = recommendedStudios.find((s) => s.id === 'studio_robotics') || recommendedStudios[0];

  const consistencyClass: ClassSession = {
    id: 'cls_robo_1',
    studioId: 'studio_robotics',
    studioName: 'CodeKids Robotics Academy',
    title: 'Python & AI Innovators Lab',
    instructor: 'Dr. Alvin Lim',
    instructorImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    time: '5:30 PM',
    date: 'Wed, 19 Aug',
    credits: 12,
    originalCredits: 18,
    location: 'Orchard Plaza',
    distance: '0.5 km',
    category: 'Coding & Robotics',
    forKids: true,
    ageRange: 'Ages 10-16',
  };

  return (
    <div className="space-y-8 pb-20 pt-2 sm:pt-4">
      {/* WELCOME HERO & APP DESCRIPTION */}
      <section className="bg-gradient-to-br from-[#002d53] via-[#0042c8] to-[#1d4ed8] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#fde68a]" />
            <span>Welcome to Happy Parents</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
            One App for All Your Child&apos;s Enrichment
          </h1>
          <p className="text-sm text-blue-100/95 leading-relaxed font-normal">
            Happy parents is an app for parents to select enrichment activities of their kids. Use one app to book everything from coding classes to dance classes with no commitment of class packages.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* REFER FRIENDS PROMO BANNER */}
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">
            REFER FRIENDS. GET SGD 20.
          </h2>
          <button
            onClick={onOpenReferral}
            className="text-[#434656] p-1 rounded-full hover:bg-[#f3f4f6] transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#c2e0ff] rounded-xl overflow-hidden flex shadow-xs border border-[#c3c5d9]/30 relative">
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between z-10">
            <p className="text-sm font-medium text-[#001d32] mb-4 leading-snug">
              Earn SGD 20 when a fellow parent joins with your link. They&apos;ll get 20 bonus credits to try enrichment classes, too!
            </p>
            <button
              onClick={onOpenReferral}
              className="bg-[#191c1e] text-white rounded-full px-4 py-2 w-fit text-xs font-semibold flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              Refer friends <span>💰</span>
            </button>
          </div>

          <div className="w-2/5 sm:w-1/3 relative min-h-[140px]">
            <img
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80"
              alt="Parents sharing and chatting"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#c2e0ff] via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-full p-2 shadow-md flex flex-col items-center justify-center transform translate-x-2">
                <Users className="w-5 h-5 text-[#0042c8]" />
                <span className="text-[10px] bg-[#FDE68A] rounded-full px-1.5 -mt-1 font-bold border border-white">
                  💰
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDED ENRICHMENT CENTERS */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#191c1e] tracking-tight">Recommended Enrichment Centers</h2>
          <button
            onClick={onNavigateSearch}
            className="text-xs font-semibold text-[#0042c8] hover:underline flex items-center gap-1"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
          {recommendedStudios.map((studio) => (
            <div
              key={studio.id}
              onClick={() => onSelectStudio(studio)}
              className="flex-none w-[240px] space-y-2 cursor-pointer group"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xs border border-[#c3c5d9]/30 relative bg-[#e1e2e4]">
                <img
                  src={studio.image}
                  alt={studio.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(studio.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all active:scale-90 ${
                    favorites[studio.id]
                      ? 'bg-white text-red-500 shadow-md ring-2 ring-red-500/20'
                      : 'bg-white/80 backdrop-blur-xs text-[#434656] hover:text-red-500'
                  }`}
                  aria-label={favorites[studio.id] ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-200 ${
                      favorites[studio.id]
                        ? 'fill-red-500 text-red-500 opacity-100 scale-110'
                        : 'opacity-80'
                    }`}
                  />
                </button>
                <span className="absolute bottom-2.5 left-2.5 bg-[#191c1e]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Ages 4-18
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#191c1e] truncate group-hover:text-[#0042c8] transition-colors">
                  {studio.name}
                </h3>
                <p className="text-xs text-[#434656]">{studio.distance} • {studio.category}</p>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReviews(studio);
                  }}
                  className="inline-flex items-center gap-1.5 mt-1 cursor-pointer hover:bg-[#0042c8]/10 p-1 -ml-1 rounded-md transition-all active:scale-95 group/rating"
                  title="Click to view & submit parent reviews"
                >
                  <span className="text-xs font-bold text-[#191c1e] group-hover/rating:text-[#0042c8]">{studio.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-[#0056FF] text-[#0056FF]" />
                  <span className="text-xs text-[#434656] group-hover/rating:underline">
                    ({(studio.reviews ? studio.reviews.length : studio.reviewCount).toLocaleString()} reviews)
                  </span>
                  {studio.badge && (
                    <span className="bg-[#E8F1FF] text-[#0056FF] text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 shrink-0">
                      {studio.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONSISTENCY IS KEY - RECURRING BOOKING CARD */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-[#191c1e] tracking-tight">
            Consistency is key - book recurring enrichment slots
          </h2>
          <button
            onClick={() => onSelectStudio(roboticsStudio)}
            className="text-[#434656] p-1 rounded-full hover:bg-[#f3f4f6] transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#c3c5d9]/30 flex gap-4 hover:shadow-md transition-shadow">
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#191c1e]">
                  {consistencyClass.date} · {consistencyClass.time}
                </span>
                <span className="text-[10px] bg-[#e8f1ff] text-[#0042c8] font-bold px-2 py-0.5 rounded-full">
                  {consistencyClass.ageRange}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#191c1e] leading-snug mb-1">
                {consistencyClass.title}
              </h3>
              <p className="text-xs text-[#434656]">{consistencyClass.studioName}</p>
              <p className="text-xs text-[#434656]">Instructor: {consistencyClass.instructor}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onBookClass(consistencyClass)}
                className="bg-[#0042c8] text-white rounded-full px-5 py-2 text-xs font-bold hover:bg-[#003ab2] transition-colors active:scale-95 shadow-xs"
              >
                Book Slot
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#0042c8]">
                  {consistencyClass.credits} cr
                </span>
                {consistencyClass.originalCredits && (
                  <span className="text-xs text-[#434656] line-through opacity-70">
                    {consistencyClass.originalCredits} credits
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 self-start border border-[#c3c5d9]/20 bg-[#f3f4f6]">
            <img
              src={roboticsStudio.image}
              alt={consistencyClass.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* HOLISTIC TALENT DEVELOPMENT SPOTLIGHT (Business Model Canvas) */}
      <section className="bg-gradient-to-br from-[#f3f4f6] to-[#e4e7ff]/40 rounded-xl p-5 border border-[#c3c5d9]/30 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0042c8] text-white rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191c1e]">Holistic Talent & Skill Exploration</h3>
              <p className="text-xs text-[#434656]">Try without long-term semester commitments</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#f8f9fb] text-[#0042c8] font-bold border border-[#0042c8]/20 px-2 py-0.5 rounded-full">
            Ages 4-18
          </span>
        </div>

        <p className="text-xs text-[#434656] leading-relaxed">
          Help your children explore robotics, coding, speech & drama, pottery, creative writing, and gymnastics with zero upfront lock-ins. Compare parent reviews, transparent credit pricing, and book flexi-slots!
        </p>

        <div className="pt-1 flex gap-2">
          <button
            onClick={onNavigateSearch}
            className="w-full py-2.5 bg-[#0042c8] text-white font-bold text-xs rounded-xl hover:bg-[#003ab2] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Award className="w-3.5 h-3.5" />
            Explore All Enrichment Academies
          </button>
        </div>
      </section>

      {/* DISQUS DISCUSSION FORUM */}
      <DisqusForum />
    </div>
  );
};
