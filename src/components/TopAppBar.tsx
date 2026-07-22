import React from 'react';
import { PawPrint, Bell, Sparkles, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

interface TopAppBarProps {
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenEthologistChat: () => void;
  activePetName?: string;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  unreadCount,
  onOpenNotifications,
  onOpenEthologistChat,
  activePetName,
  user,
  onLogin,
  onLogout
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#c7c4d8]/40 h-16 transition-all">
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-[#3525cd] flex items-center justify-center text-white shadow-md shadow-[#3525cd]/20 group-hover:scale-105 transition-transform">
            <PawPrint className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#3525cd] leading-none">PetMind AI</span>
            <span className="text-[10px] font-semibold tracking-wider text-[#464555] uppercase">Bienestar Canino & IA</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick AI Ethologist Chat Trigger */}
          <button
            onClick={onOpenEthologistChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0ecf9] text-[#3525cd] hover:bg-[#eae6f4] transition-colors text-xs font-semibold"
            title="Consultar al Etólogo IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3525cd]" />
            <span>Consultar IA</span>
          </button>

          {activePetName && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f5f2ff] border border-[#c7c4d8]/50 text-xs font-medium text-[#1b1b24]">
              <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
              <span className="truncate max-w-[100px]">{activePetName}</span>
            </div>
          )}

          {/* User Auth status button */}
          {user ? (
            <div className="flex items-center gap-1 bg-[#f0ecf9] border border-[#c7c4d8]/50 rounded-full pr-1.5 pl-2 py-1 text-xs">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Usuario'} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-[#3525cd]" />
              )}
              <span className="font-bold text-[#3525cd] max-w-[80px] truncate hidden sm:inline">
                {user.displayName?.split(' ')[0] || 'Miembro'}
              </span>
              <button
                onClick={onLogout}
                className="p-1 text-[#777587] hover:text-[#ba1a1a] transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3525cd] text-white hover:bg-[#4f46e5] transition-all text-xs font-bold shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acceder</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#464555] hover:bg-[#eae6f4] active:scale-95 transition-all focus:outline-none"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

