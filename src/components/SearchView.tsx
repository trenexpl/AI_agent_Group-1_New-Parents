import React, { useState } from 'react';
import { Studio, CategoryType, ClassSession } from '../types';
import { Search, MapPin, SlidersHorizontal, Star, Heart, Ticket, Calendar } from 'lucide-react';

interface SearchViewProps {
  studios: Studio[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectStudio: (studio: Studio) => void;
  onBookClass: (session: ClassSession) => void;
  onOpenReviews: (studio: Studio) => void;
  favorites: Record<string, boolean>;
  onToggleFavorite: (studioId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  studios,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onSelectStudio,
  onBookClass,
  onOpenReviews,
  favorites,
  onToggleFavorite,
}) => {
  const [location, setLocation] = useState('Orchard');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'credits'>('distance');

  const categories: CategoryType[] = [
    'All',
    'Coding & Robotics',
    'Speech & Drama',
    'Art & Pottery',
    'Creative Writing',
    'Gymnastics & Dance',
    'Sports & Physical Development',
  ];

  const toggleFavorite = (e: React.MouseEvent, studioId: string) => {
    e.stopPropagation();
    onToggleFavorite(studioId);
  };

  // Filter studios and prioritize favorited course listings at the top
  const filteredStudios = studios
    .filter((studio) => {
      const matchesCategory =
        selectedCategory === 'All' || studio.category === selectedCategory;
      const matchesQuery =
        studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.nextAvailable.className.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      // 1. Favorited / Hearted course listings take top priority
      const isFavA = favorites[a.id] ? 1 : 0;
      const isFavB = favorites[b.id] ? 1 : 0;
      if (isFavA !== isFavB) {
        return isFavB - isFavA;
      }
      // 2. Secondary sorting criteria
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'credits') return a.credits - b.credits;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  const favoritedCount = filteredStudios.filter((s) => favorites[s.id]).length;

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Mobile Search Bar */}
      <section className="md:hidden">
        <div className="relative bg-[#f3f4f6] rounded-full flex items-center px-4 py-3 border border-[#c3c5d9]/30 focus-within:border-[#0042c8] transition-colors shadow-xs">
          <Search className="w-5 h-5 text-[#434656] mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search activities or studios"
            className="bg-transparent border-none p-0 w-full text-sm text-[#191c1e] focus:ring-0 placeholder:text-[#434656] outline-hidden font-medium"
          />
          <div className="flex items-center gap-1 border-l border-[#c3c5d9]/40 pl-3 ml-2 shrink-0">
            <MapPin className="w-4 h-4 text-[#0042c8]" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-xs font-semibold text-[#434656] bg-transparent border-none p-0 focus:ring-0 cursor-pointer outline-hidden"
            >
              <option value="Orchard">Orchard</option>
              <option value="Somerset">Somerset</option>
              <option value="Dhoby Ghaut">Dhoby Ghaut</option>
              <option value="River Valley">River Valley</option>
            </select>
          </div>
        </div>
      </section>

      {/* Filter Category Chips */}
      <section>
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2 snap-x -mx-5 px-5 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`snap-start shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#0042c8] text-white shadow-xs font-bold'
                    : 'bg-[#e7e8ea] text-[#191c1e] border border-[#c3c5d9]/30 hover:bg-[#edeef0]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Priority Favorited Banner */}
      {favoritedCount > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-500 text-white rounded-full shadow-xs shrink-0">
              <Heart className="w-4 h-4 fill-current" />
            </span>
            <div>
              <p className="text-xs font-bold text-red-950">
                {favoritedCount} Priority Favorited {favoritedCount === 1 ? 'Course Listing' : 'Course Listings'}
              </p>
              <p className="text-[11px] text-red-800/90">
                Favorited listings are automatically moved to top priority in search results.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-500 text-white px-3 py-1 rounded-full shadow-2xs">
            ❤️ Pinned Priority
          </span>
        </div>
      )}

      {/* Results Header Info */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-[#191c1e] tracking-tight">
            {filteredStudios.length} {selectedCategory === 'All' ? 'Courses & Classes' : `${selectedCategory} Courses`}
          </h2>
          <p className="text-xs text-[#434656] mt-0.5">Near {location}, Singapore</p>
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="flex items-center gap-1.5 text-[#0042c8] text-xs font-bold hover:bg-[#f3f4f6] px-3 py-1.5 rounded-full transition-colors border border-[#0042c8]/20"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter & Sort
        </button>
      </div>

      {/* Sort Options Bar if Filter Drawer expanded */}
      {showFilterDrawer && (
        <div className="bg-white rounded-xl p-4 border border-[#c3c5d9]/40 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#434656]">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('distance')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sortBy === 'distance' ? 'bg-[#0042c8] text-white' : 'bg-[#f3f4f6] text-[#434656]'
                }`}
              >
                Distance
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sortBy === 'rating' ? 'bg-[#0042c8] text-white' : 'bg-[#f3f4f6] text-[#434656]'
                }`}
              >
                Highest Rated
              </button>
              <button
                onClick={() => setSortBy('credits')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sortBy === 'credits' ? 'bg-[#0042c8] text-white' : 'bg-[#f3f4f6] text-[#434656]'
                }`}
              >
                Lowest Credits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Studio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudios.map((studio) => {
          const isFav = favorites[studio.id];
          const nextCls = studio.upcomingClasses[0] || {
            id: `cls_${studio.id}`,
            studioId: studio.id,
            studioName: studio.name,
            title: studio.nextAvailable.className,
            instructor: studio.nextAvailable.instructor,
            time: studio.nextAvailable.time,
            date: 'Today',
            credits: studio.nextAvailable.credits,
            location: studio.location,
            distance: studio.distance,
            category: studio.category,
          };

          return (
            <div
              key={studio.id}
              onClick={() => onSelectStudio(studio)}
              className={`group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${
                isFav
                  ? 'bg-white border-2 border-red-500/60 shadow-md ring-2 ring-red-500/10'
                  : 'bg-white border border-[#c3c5d9]/30 hover:shadow-md'
              }`}
            >
              {/* Card Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-[#e1e2e4]">
                <img
                  src={studio.image}
                  alt={studio.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Priority Badge */}
                {isFav && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-10 animate-in fade-in duration-200">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Priority Favorite</span>
                  </div>
                )}

                <button
                  onClick={(e) => toggleFavorite(e, studio.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all active:scale-90 shadow-xs z-10 cursor-pointer ${
                    isFav
                      ? 'bg-white text-red-500 ring-2 ring-red-500/20'
                      : 'bg-white/80 backdrop-blur-xs text-[#434656] hover:text-red-500'
                  }`}
                  title={isFav ? "Remove from priority" : "Prioritize this course listing"}
                >
                  <Heart className={`w-4 h-4 transition-all ${isFav ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
                </button>

                {/* Rating Badge */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReviews(studio);
                  }}
                  className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#E8F1FF] hover:bg-white px-2.5 py-1 rounded-full border border-[#0042c8]/20 backdrop-blur-md shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
                  title="Click to view & write parent reviews"
                >
                  <Star className="w-3.5 h-3.5 fill-[#0056FF] text-[#0056FF]" />
                  <span className="text-xs font-bold text-[#0056FF]">{studio.rating}</span>
                  <span className="text-xs text-[#0056FF]/80 underline">
                    ({(studio.reviews ? studio.reviews.length : studio.reviewCount).toLocaleString()})
                  </span>
                  {studio.badge && (
                    <span className="text-xs font-semibold text-[#0056FF]/80 ml-0.5">
                      • {studio.badge}
                    </span>
                  )}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
                    {studio.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-[#f3f4f6] px-2 py-0.5 rounded-md border border-[#c3c5d9]/20">
                    <Ticket className="w-3.5 h-3.5 text-[#0042c8]" />
                    <span className="text-xs font-bold text-[#191c1e]">{studio.credits} cr</span>
                  </div>
                </div>

                <p className="text-xs text-[#434656] flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#434656]" />
                  {studio.distance} • {studio.location}
                </p>

                {/* Next Available Box */}
                <div className="mt-auto space-y-2">
                  <div className="text-[10px] font-bold text-[#434656] uppercase tracking-wider">
                    NEXT AVAILABLE
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookClass(nextCls);
                    }}
                    className="flex justify-between items-center bg-[#f8f9fb] border border-[#c3c5d9]/30 rounded-lg p-2.5 hover:border-[#0042c8]/50 transition-colors cursor-pointer group/row"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#191c1e]">{studio.nextAvailable.time}</span>
                      <span className="text-xs text-[#434656] truncate max-w-[160px]">
                        {studio.nextAvailable.className}
                      </span>
                    </div>
                    <button className="px-4 py-1.5 rounded-full bg-[#0042c8] text-white text-xs font-bold hover:bg-[#003ab2] transition-colors group-hover/row:scale-105 active:scale-95 duration-200">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
