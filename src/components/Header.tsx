import React from 'react';
import { TabType, UserProfile } from '../types';
import { Search, Bell, User, LogIn } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  user: UserProfile | null;
  isLoggedIn?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  user,
  isLoggedIn = true,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
}) => {
  return (
    <>
      {/* Mobile Header - Profile tab layout */}
      {currentTab === 'profile' && (
        <header className="fixed top-0 w-full z-40 bg-[#f8f9fb] hidden md:flex border-b border-[#c3c5d9]/30">
          <div className="flex justify-between items-center px-5 h-16 w-full max-w-md mx-auto">
            <div className="flex items-center gap-2">
              {isLoggedIn && user ? (
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={user.avatarUrl}
                  alt={user.name}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0042c8] text-white flex items-center justify-center font-bold text-xs">
                  HP
                </div>
              )}
              <span className="font-bold text-2xl text-[#0042c8]">Happy Parents</span>
            </div>
            <button
              onClick={onOpenNotifications}
              className="text-[#0042c8] hover:bg-[#f3f4f6] p-2 rounded-full transition-colors active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Mobile Top Bar for Search Screen */}
      {currentTab === 'search' && (
        <header className="fixed top-0 w-full z-40 bg-[#f8f9fb] md:hidden flex justify-between items-center px-5 h-16 max-w-md mx-auto border-b border-[#c3c5d9]/20">
          <button
            onClick={() => onTabChange('profile')}
            className="flex items-center text-[#0042c8] hover:opacity-80 active:scale-90 transition-all"
            aria-label="Profile"
          >
            <User className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-extrabold text-[#0042c8] tracking-tight">Happy Parents</h1>
          <button
            onClick={onOpenNotifications}
            className="text-[#434656] hover:bg-[#f3f4f6] p-1.5 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
        </header>
      )}

      {/* Mobile Top Bar for Home Screen */}
      {currentTab === 'home' && (
        <header className="fixed top-0 w-full z-40 bg-[#f8f9fb]/90 backdrop-blur-md md:hidden flex justify-between items-center px-5 h-16">
          <h1 className="text-2xl font-extrabold text-[#191c1e] tracking-tight">For you</h1>
          <button
            onClick={() => onTabChange('search')}
            className="bg-[#f3f4f6] p-2.5 rounded-full hover:bg-[#e7e8ea] transition-colors active:scale-90"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-[#191c1e]" />
          </button>
        </header>
      )}

      {/* Mobile Top Bar for Credits / Upcoming Screen */}
      {(currentTab === 'credits' || currentTab === 'upcoming') && (
        <header className="fixed top-0 w-full z-40 bg-[#f8f9fb]/90 backdrop-blur-md md:hidden flex justify-between items-center px-5 h-16 border-b border-[#c3c5d9]/20">
          <h1 className="text-2xl font-extrabold text-[#191c1e] tracking-tight capitalize">
            {currentTab === 'credits' ? 'Credits & Balance' : 'Upcoming Classes'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-[#c2e0ff] text-[#0042c8] px-3 py-1 rounded-full">
              {isLoggedIn && user ? user.credits : 0} cr
            </span>
            <button
              onClick={onOpenNotifications}
              className="text-[#434656] hover:bg-[#f3f4f6] p-1.5 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Desktop Web Header */}
      <header className="hidden md:flex fixed top-0 w-full z-50 bg-[#f8f9fb] justify-between items-center px-8 h-20 shadow-xs border-b border-[#c3c5d9]/30">
        <div className="flex items-center gap-8">
          <button
            onClick={() => onTabChange('home')}
            className="text-3xl font-extrabold text-[#0042c8] tracking-tight cursor-pointer hover:opacity-90"
          >
            Happy Parents
          </button>
          <nav className="flex gap-6">
            <button
              onClick={() => onTabChange('home')}
              className={`font-semibold text-base transition-colors ${
                currentTab === 'home'
                  ? 'text-[#0042c8] font-bold border-b-2 border-[#0042c8] pb-1'
                  : 'text-[#434656] hover:text-[#0042c8]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onTabChange('search')}
              className={`font-semibold text-base transition-colors ${
                currentTab === 'search'
                  ? 'text-[#0042c8] font-bold border-b-2 border-[#0042c8] pb-1'
                  : 'text-[#434656] hover:text-[#0042c8]'
              }`}
            >
              Search & Studios
            </button>
            <button
              onClick={() => onTabChange('upcoming')}
              className={`font-semibold text-base transition-colors ${
                currentTab === 'upcoming'
                  ? 'text-[#0042c8] font-bold border-b-2 border-[#0042c8] pb-1'
                  : 'text-[#434656] hover:text-[#0042c8]'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => onTabChange('credits')}
              className={`font-semibold text-base transition-colors ${
                currentTab === 'credits'
                  ? 'text-[#0042c8] font-bold border-b-2 border-[#0042c8] pb-1'
                  : 'text-[#434656] hover:text-[#0042c8]'
              }`}
            >
              Credits ({isLoggedIn && user ? user.credits : 0})
            </button>
            <button
              onClick={() => onTabChange('profile')}
              className={`font-semibold text-base transition-colors ${
                currentTab === 'profile'
                  ? 'text-[#0042c8] font-bold border-b-2 border-[#0042c8] pb-1'
                  : 'text-[#434656] hover:text-[#0042c8]'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434656]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentTab !== 'search') onTabChange('search');
              }}
              placeholder="Search studios or classes (e.g. Pilates)"
              className="pl-10 pr-4 py-2 bg-[#f3f4f6] rounded-full border-none focus:ring-2 focus:ring-[#0042c8] w-72 text-sm text-[#191c1e] placeholder:text-[#434656]/70 outline-hidden"
            />
          </div>

          <button
            onClick={onOpenNotifications}
            className="text-[#434656] hover:bg-[#f3f4f6] transition-colors rounded-full p-2"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          {isLoggedIn && user ? (
            <button
              onClick={() => onTabChange('profile')}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#0042c8]/20 group-hover:border-[#0042c8]"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-[#191c1e]">{user.name}</p>
                <p className="text-[11px] text-[#0042c8] font-semibold">{user.credits} credits</p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onTabChange('profile')}
              className="bg-[#0042c8] hover:bg-[#0036a3] text-white font-bold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In / Sign Up</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
};

