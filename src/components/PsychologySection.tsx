import React from 'react';
import { ShieldCheck, Video, MessageSquare, CheckCircle, Sparkles, Calendar } from 'lucide-react';

interface PsychologySectionProps {
  onOpenBooking: () => void;
}

export const PsychologySection: React.FC<PsychologySectionProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative bg-[#1b1b24] text-white rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl border border-slate-800">
      {/* Background Ambient Glows */}
      <div className="absolute -right-12 -top-12 w-56 h-56 bg-[#3525cd] opacity-25 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#006c49] opacity-20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative z-10 space-y-4 max-w-xl">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-[#3525cd] text-white px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Etología Premium
        </span>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Servicio de Psicología y Etología Canina
        </h2>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed font-normal">
          ¿Problemas de agresividad, ansiedad por separación o miedos? Nuestros expertos etólogos certificados están aquí para ayudarte de forma personalizada con diagnóstico y seguimiento médico-conductual.
        </p>

        {/* Value Points */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="flex items-center gap-2.5 text-slate-100 text-xs font-semibold bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-xs">
            <Video className="w-4 h-4 text-[#6cf8bb] shrink-0" />
            <span>Sesiones 1:1 por videollamada</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-100 text-xs font-semibold bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-xs">
            <MessageSquare className="w-4 h-4 text-[#6cf8bb] shrink-0" />
            <span>Seguimiento por chat 24/7</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onOpenBooking}
          className="w-full sm:w-auto bg-[#6cf8bb] hover:bg-[#4edea3] text-[#002113] py-4 px-8 rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-[#6cf8bb]/10 flex items-center justify-center gap-2.5 mt-4 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Reservar Sesión Etológica</span>
        </button>
      </div>
    </section>
  );
};
