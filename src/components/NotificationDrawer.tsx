import React from 'react';
import { X, Bell, CheckCheck, Lightbulb, CalendarCheck, Sparkles } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white max-w-sm w-full h-full shadow-2xl flex flex-col p-5 relative border-l border-[#c7c4d8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c7c4d8]/40">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#3525cd]" />
            <h3 className="font-extrabold text-base text-[#1b1b24]">Notificaciones</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#777587] hover:bg-[#f5f2ff]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button */}
        {notifications.some((n) => !n.read) && (
          <div className="pt-3 pb-2 text-right">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-bold text-[#3525cd] hover:underline inline-flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Marcar todas como leídas</span>
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pt-2 custom-scroll">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#777587]">
              No tienes notificaciones pendientes.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                  !n.read
                    ? 'bg-[#f5f2ff] border-[#3525cd]/40'
                    : 'bg-white border-[#c7c4d8]/40 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[#1b1b24]">
                    {n.type === 'tip' ? (
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    ) : n.type === 'booking' ? (
                      <CalendarCheck className="w-3.5 h-3.5 text-[#006c49]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#3525cd]" />
                    )}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-[#777587]">{n.time}</span>
                </div>

                <p className="text-[#464555] leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
