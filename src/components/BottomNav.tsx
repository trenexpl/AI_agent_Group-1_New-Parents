import React from 'react';
import { TabType } from '../types';
import { Home, Search, PlusCircle, Calendar, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  credits: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, credits }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5 mb-0.5" />,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <Search className="w-5 h-5 mb-0.5" />,
    },
    {
      id: 'credits',
      label: 'Add credits',
      icon: <PlusCircle className="w-5 h-5 mb-0.5" />,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <Calendar className="w-5 h-5 mb-0.5" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5 mb-0.5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#f8f9fb]/90 backdrop-blur-md border-t border-[#c3c5d9]/30 md:hidden px-2 pb-5 pt-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'bg-[#c2e0ff] text-[#47647e] rounded-full px-3.5 py-1 text-[#0042c8]'
                  : 'text-[#434656] hover:text-[#0042c8] px-2 py-1'
              }`}
            >
              {item.icon}
              <span
                className={`text-[10px] font-medium tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-[#0042c8]' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
