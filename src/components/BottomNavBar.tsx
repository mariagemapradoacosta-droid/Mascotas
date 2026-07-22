import React from 'react';
import { Home, ClipboardList, Brain, User } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'home' | 'plan' | 'experts' | 'profile';
  onChangeTab: (tab: 'home' | 'plan' | 'experts' | 'profile') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onChangeTab }) => {
  const navItems = [
    { id: 'home' as const, label: 'Inicio', icon: Home },
    { id: 'plan' as const, label: 'Plan', icon: ClipboardList },
    { id: 'experts' as const, label: 'Expertos', icon: Brain },
    { id: 'profile' as const, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-[#c7c4d8]/50 shadow-[0_-4px_20px_0_rgba(0,0,0,0.04)] flex justify-around items-center px-4 py-2.5 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
              isActive
                ? 'bg-[#3525cd] text-white shadow-sm font-bold'
                : 'text-[#464555] hover:bg-[#f5f2ff]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
