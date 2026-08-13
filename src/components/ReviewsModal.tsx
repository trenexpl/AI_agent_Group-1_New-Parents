import React, { useState } from 'react';
import { Studio, Review } from '../types';
import { X, Star, ThumbsUp, CheckCircle2, MessageSquarePlus, Sparkles } from 'lucide-react';

interface ReviewsModalProps {
  studio: Studio | null;
  onClose: () => void;
  onAddReview: (studioId: string, newReview: Omit<Review, 'id' | 'studioId' | 'date'>) => void;
  currentUserName?: string;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  studio,
  onClose,
  onAddReview,
  currentUserName = 'Alex Johnson',
}) => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState(currentUserName);
  const [comment, setComment] = useState('');
  const [filterStar, setFilterStar] = useState<number | 'all'>('all');
  const [helpfulCountMap, setHelpfulCountMap] = useState<Record<string, number>>({});

  if (!studio) return null;

  const reviewsList = studio.reviews || defaultStudioReviews(studio.id);

  // Filter reviews
  const filteredReviews = reviewsList.filter((r) => {
    if (filterStar === 'all') return true;
    return r.rating === filterStar;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddReview(studio.id, {
      author: authorName.trim() || 'Anonymous Parent',
      rating: newRating,
      comment: comment.trim(),
      verifiedParent: true,
    });

    setComment('');
    setIsWritingReview(false);
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulCountMap((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  // Calculate rating breakdown
  const totalReviewsCount = reviewsList.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsList.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#c3c5d9]/30 flex justify-between items-center bg-[#f8f9fb]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#c3c5d9]/30 bg-[#e1e2e4]">
              <img src={studio.image} alt={studio.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#191c1e] tracking-tight">{studio.name}</h2>
                {studio.badge && (
                  <span className="bg-[#E8F1FF] text-[#0056FF] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {studio.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#434656]">{studio.category} • Parent Reviews & Rating Breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#434656] hover:bg-[#e1e2e4]/60 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Rating Summary Header Card */}
          <div className="bg-[#f8f9fb] rounded-2xl p-4 sm:p-5 border border-[#c3c5d9]/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Average Rating Big Score */}
            <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#c3c5d9]/30 pb-4 md:pb-0 md:pr-4">
              <span className="text-4xl sm:text-5xl font-black text-[#191c1e]">{studio.rating}</span>
              <div className="flex items-center gap-1 my-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(studio.rating)
                        ? 'fill-[#0056FF] text-[#0056FF]'
                        : 'text-[#c3c5d9] fill-[#c3c5d9]/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#434656]">
                Based on {studio.reviewCount.toLocaleString()} verified parent ratings
              </span>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="md:col-span-2 space-y-1.5">
              {ratingCounts.map(({ star, count }) => {
                const percentage = totalReviewsCount ? Math.round((count / totalReviewsCount) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-12 font-bold text-[#191c1e] flex items-center gap-1 shrink-0">
                      {star} <Star className="w-3 h-3 fill-[#0056FF] text-[#0056FF]" />
                    </span>
                    <div className="flex-1 h-2 bg-[#e1e2e4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0056FF] rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-[#434656] shrink-0">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row: Create Review Toggle & Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setFilterStar('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterStar === 'all'
                    ? 'bg-[#0042c8] text-white shadow-xs'
                    : 'bg-[#f3f4f6] text-[#434656] hover:bg-[#e7e8ea]'
                }`}
              >
                All ({reviewsList.length})
              </button>
              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterStar(star)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    filterStar === star
                      ? 'bg-[#0042c8] text-white shadow-xs font-bold'
                      : 'bg-[#f3f4f6] text-[#434656] hover:bg-[#e7e8ea]'
                  }`}
                >
                  {star} <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="bg-[#0042c8] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#003ab2] transition-colors flex items-center gap-1.5 active:scale-95 shadow-xs shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              {isWritingReview ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Write a Review Form Card */}
          {isWritingReview && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-[#E8F1FF]/60 rounded-2xl p-5 border-2 border-[#0042c8]/30 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200"
            >
              <div className="flex items-center gap-2 border-b border-[#0042c8]/20 pb-3">
                <Sparkles className="w-4 h-4 text-[#0042c8]" />
                <h3 className="text-sm font-extrabold text-[#191c1e]">Write Your Parent Review for {studio.name}</h3>
              </div>

              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#191c1e] block">Your Overall Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-2xl transition-transform active:scale-125 focus:outline-hidden"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || newRating)
                            ? 'fill-[#0056FF] text-[#0056FF]'
                            : 'text-[#c3c5d9] fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#0056FF] ml-2">
                    {hoverRating || newRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Author Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1e] block">Parent Name / Display Title</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex Johnson (Parent of Leo)"
                  required
                  className="w-full bg-white text-xs font-medium text-[#191c1e] px-3.5 py-2.5 rounded-xl border border-[#c3c5d9]/40 focus:border-[#0042c8] focus:ring-1 focus:ring-[#0042c8] outline-hidden"
                />
              </div>

              {/* Review Comment Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1e] block">Your Experience & Feedback</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about instructors, class pace, facilities, or how much your child enjoyed the class..."
                  required
                  className="w-full bg-white text-xs font-medium text-[#191c1e] p-3 rounded-xl border border-[#c3c5d9]/40 focus:border-[#0042c8] focus:ring-1 focus:ring-[#0042c8] outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#434656] hover:bg-white/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0042c8] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#003ab2] transition-colors shadow-sm active:scale-95"
                >
                  Submit Parent Review
                </button>
              </div>
            </form>
          )}

          {/* Past Reviews List */}
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-bold text-[#191c1e] flex items-center justify-between">
              <span>Parent Reviews & Experiences ({filteredReviews.length})</span>
              <span className="text-xs font-normal text-[#434656]">Sorted by Most Recent</span>
            </h3>

            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 bg-[#f8f9fb] rounded-xl border border-[#c3c5d9]/30 space-y-2">
                <p className="text-xs text-[#434656] font-medium">No reviews match this rating filter yet.</p>
                <button
                  onClick={() => setFilterStar('all')}
                  className="text-xs font-bold text-[#0042c8] underline"
                >
                  View all reviews
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white rounded-xl border border-[#c3c5d9]/30 space-y-2 hover:border-[#0042c8]/30 transition-colors shadow-2xs"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0042c8]/10 text-[#0042c8] font-bold text-xs flex items-center justify-center shrink-0">
                          {rev.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#191c1e]">{rev.author}</span>
                            {rev.verifiedParent && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                Verified Parent
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= rev.rating
                                    ? 'fill-[#0056FF] text-[#0056FF]'
                                    : 'text-[#c3c5d9] fill-transparent'
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-bold text-[#191c1e] ml-1">{rev.rating}.0</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] text-[#434656] font-medium shrink-0">{rev.date}</span>
                    </div>

                    <p className="text-xs text-[#191c1e] leading-relaxed pt-1">{rev.comment}</p>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => toggleHelpful(rev.id)}
                        className="text-[11px] text-[#434656] hover:text-[#0042c8] font-semibold flex items-center gap-1 bg-[#f3f4f6] px-2.5 py-1 rounded-full transition-colors active:scale-95"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Helpful {helpfulCountMap[rev.id] ? `(${helpfulCountMap[rev.id]})` : ''}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for default reviews per studio
export function defaultStudioReviews(studioId: string): Review[] {
  switch (studioId) {
    case 'studio_robotics':
      return [
        {
          id: 'rev_r1',
          studioId: 'studio_robotics',
          author: 'Sarah Tan (Parent of Leo)',
          rating: 5,
          date: '2 days ago',
          comment:
            'Dr. Alvin was so patient with my 8-year-old son. He built his first Lego Mindstorms robot in class and was beaming with pride! Small class ratio makes a huge difference.',
          verifiedParent: true,
        },
        {
          id: 'rev_r2',
          studioId: 'studio_robotics',
          author: 'Kenneth Poh',
          rating: 5,
          date: '1 week ago',
          comment:
            'Excellent Python curriculum broken down into easy logic puzzles. The parent lounge has Wi-Fi and good coffee too!',
          verifiedParent: true,
        },
        {
          id: 'rev_r3',
          studioId: 'studio_robotics',
          author: 'Priya Sharma',
          rating: 4,
          date: '2 weeks ago',
          comment:
            'Very hands-on environment. My daughter loved the Scratch animation workshop and wants to come back every weekend.',
          verifiedParent: true,
        },
      ];
    case 'studio_drama':
      return [
        {
          id: 'rev_d1',
          studioId: 'studio_drama',
          author: 'Michelle Chen',
          rating: 5,
          date: '3 days ago',
          comment:
            'My daughter used to be super shy in public, but Coach Sarah brought out her confidence in just 2 sessions! The Broadway improv class was full of laughter.',
          verifiedParent: true,
        },
        {
          id: 'rev_d2',
          studioId: 'studio_drama',
          author: 'David Wong',
          rating: 5,
          date: '2 weeks ago',
          comment:
            'Fantastic stage and costume setup at Paragon. The parents get to watch a mini 5-minute performance at the end of class!',
          verifiedParent: true,
        },
      ];
    case 'studio_pottery':
      return [
        {
          id: 'rev_p1',
          studioId: 'studio_pottery',
          author: 'Grace Lee',
          rating: 5,
          date: '1 day ago',
          comment:
            'Such a calming sensory activity. The ceramic pot my 9-year-old made on the wheel is already glazed and sitting on our dining table!',
          verifiedParent: true,
        },
        {
          id: 'rev_p2',
          studioId: 'studio_pottery',
          author: 'Benjamin Teo',
          rating: 5,
          date: '5 days ago',
          comment:
            'Very clean stations, aprons provided, and instructor Elena is wonderfully encouraging with young kids.',
          verifiedParent: true,
        },
      ];
    case 'studio_writing':
      return [
        {
          id: 'rev_w1',
          studioId: 'studio_writing',
          author: 'Evelyn Yeo',
          rating: 5,
          date: '4 days ago',
          comment:
            'My 10-year-old used to dread writing compositions. After 2 sessions here, he actually writes fantasy adventure stories for fun at home!',
          verifiedParent: true,
        },
        {
          id: 'rev_w2',
          studioId: 'studio_writing',
          author: 'Marcus Goh',
          rating: 4,
          date: '1 week ago',
          comment:
            'Great structured feedback provided to parents after class on essay logic and vocabulary usage.',
          verifiedParent: true,
        },
      ];
    case 'studio_dance':
      return [
        {
          id: 'rev_dn1',
          studioId: 'studio_dance',
          author: 'Hannah Lim',
          rating: 5,
          date: '1 week ago',
          comment:
            'World-class sprung floors and safety pads. Coach Anya is very disciplined yet warm with the gymnasts.',
          verifiedParent: true,
        },
        {
          id: 'rev_dn2',
          studioId: 'studio_dance',
          author: 'Rajiv Kumar',
          rating: 5,
          date: '2 weeks ago',
          comment:
            'My son loves the Junior Hip-Hop fusion class. Great energy, modern beats, and active workout!',
          verifiedParent: true,
        },
      ];
    case 'studio_sports':
      return [
        {
          id: 'rev_s1',
          studioId: 'studio_sports',
          author: 'Mark Ang',
          rating: 5,
          date: '2 days ago',
          comment:
            'High-energy agility obstacle drills and basketball fundamentals. Coach David keeps all 10 kids active non-stop!',
          verifiedParent: true,
        },
        {
          id: 'rev_s2',
          studioId: 'studio_sports',
          author: 'Jessica Soo',
          rating: 5,
          date: '4 days ago',
          comment:
            'Excellent facility at River Valley with hydration stations and first aid readiness. Great team-building spirit.',
          verifiedParent: true,
        },
      ];
    default:
      return [
        {
          id: `rev_gen_${studioId}`,
          studioId,
          author: 'Happy Parent',
          rating: 5,
          date: '3 days ago',
          comment:
            'Wonderful enrichment experience for my children! Professional instructors and convenient booking via Happy Parents app.',
          verifiedParent: true,
        },
      ];
  }
}
