import React from 'react';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-6 pb-2 text-center space-y-4 max-w-2xl mx-auto">
      {/* Category Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3525cd]/10 border border-[#3525cd]/20">
        <Sparkles className="w-3.5 h-3.5 text-[#3525cd]" />
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#3525cd]">
          ATENCIÓN ESPECIALIZADA / IA
        </span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1b1b24] leading-[1.15]">
        Adiestramiento <span className="text-[#3525cd]">Inteligente</span> y Bienestar para tu Mascota
      </h1>

      {/* Subtitle */}
      <p className="text-[#464555] text-base sm:text-lg leading-relaxed px-2 font-normal max-w-xl mx-auto">
        Personaliza la educación y salud de tu mejor amigo con la ayuda de nuestra IA avanzada y expertos etólogos.
      </p>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <span className="inline-flex items-center gap-1.5 bg-[#6cf8bb]/30 text-[#00714d] border border-[#00714d]/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#006c49]" />
          Certificado por Etólogos
        </span>
        <span className="inline-flex items-center gap-1.5 bg-[#eae6f4] text-[#3525cd] border border-[#c7c4d8]/50 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#3525cd]" />
          IA Nativa Adaptativa
        </span>
      </div>
    </section>
  );
};
