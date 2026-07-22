import React from 'react';
import { Star, Video, MessageSquare, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { INITIAL_ETHOLOGISTS } from '../data/initialData';
import { Ethologist } from '../types';

interface ExpertsTabProps {
  onOpenBooking: () => void;
  onOpenEthologistChat: () => void;
}

export const ExpertsTab: React.FC<ExpertsTabProps> = ({ onOpenBooking, onOpenEthologistChat }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner AI Ethologist */}
      <div className="bg-[#3525cd] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-amber-300 border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Atención Inmediata
          </span>
          <h2 className="text-2xl font-extrabold">Asistente Etólogo IA 24/7</h2>
          <p className="text-xs text-indigo-100 max-w-md">
            Resuelve dudas sobre conducta, tirones de correa, ladridos o ansiedad en tiempo real con nuestra IA entrenada en psicología animal.
          </p>
        </div>

        <button
          onClick={onOpenEthologistChat}
          className="z-10 bg-white text-[#3525cd] hover:bg-slate-100 px-6 py-3.5 rounded-xl text-xs font-bold shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Iniciar Consulta IA</span>
        </button>
      </div>

      {/* Directory Title */}
      <div className="space-y-1">
        <h3 className="text-xl font-extrabold text-[#1b1b24]">Equipo de Etólogos Certificados</h3>
        <p className="text-xs text-[#464555]">Reserva videollamadas 1:1 con veterinarios y psicólogos caninos titulados</p>
      </div>

      {/* Ethologists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_ETHOLOGISTS.map((eth) => (
          <div key={eth.id} className="bg-white border border-[#c7c4d8]/70 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={eth.avatarUrl}
                  alt={eth.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#3525cd]"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-[#1b1b24]">{eth.name}</h4>
                  <p className="text-xs text-[#464555] font-medium">{eth.title}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span>{eth.rating} ({eth.reviewsCount} evaluaciones)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#777587] leading-relaxed line-clamp-3">
                {eth.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {eth.specialties.map((spec, idx) => (
                  <span key={idx} className="text-[10px] font-bold bg-[#f5f2ff] text-[#3525cd] border border-[#c7c4d8]/40 px-2.5 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#c7c4d8]/30 flex items-center justify-between">
              <span className="text-xs font-black text-[#1b1b24]">{eth.pricePerSession}</span>
              <button
                onClick={onOpenBooking}
                className="px-3.5 py-2 bg-[#3525cd] text-white hover:bg-[#4f46e5] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Reservar 1:1</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
