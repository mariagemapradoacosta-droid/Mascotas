import React, { useState } from 'react';
import { Check, X, Sparkles, ShieldCheck } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/initialData';
import { MembershipPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: MembershipPlan) => void;
  activePlanId?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan, activePlanId }) => {
  return (
    <section className="space-y-6 pt-2 pb-6">
      <div className="text-center space-y-1.5 max-w-md mx-auto">
        <h2 className="text-2xl font-extrabold text-[#1b1b24] tracking-tight">Planes de Membresía</h2>
        <p className="text-xs text-[#464555]">Elige la suscripción que mejor se ajuste al ritmo de aprendizaje de tu perro</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 px-1 custom-scroll snap-x">
        {MEMBERSHIP_PLANS.map((plan) => {
          const isSelected = activePlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`min-w-[280px] max-w-[320px] snap-center rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-[#3525cd] text-white shadow-xl shadow-[#3525cd]/20 scale-[1.02] border-2 border-[#3525cd]'
                  : 'bg-white text-[#1b1b24] border border-[#c7c4d8]/70 shadow-xs'
              }`}
            >
              {/* Top Popular Badge */}
              {plan.badge && (
                <div
                  className={`absolute -top-3 right-6 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${
                    plan.popular
                      ? 'bg-[#6cf8bb] text-[#002113]'
                      : 'bg-[#3525cd] text-white'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="font-extrabold text-lg leading-tight">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight">{plan.price}</span>
                  <span className={`text-xs font-semibold ${plan.popular ? 'text-indigo-200' : 'text-[#777587]'}`}>
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs font-medium">
                      {feat.included ? (
                        <Check
                          className={`w-4 h-4 shrink-0 ${
                            plan.popular ? 'text-[#6cf8bb]' : 'text-[#006c49]'
                          }`}
                        />
                      ) : (
                        <X className="w-4 h-4 shrink-0 text-[#777587] opacity-50" />
                      )}
                      <span className={!feat.included ? 'opacity-50 line-through' : ''}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full mt-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-white text-[#3525cd] hover:bg-slate-100 shadow-md'
                    : isSelected
                    ? 'bg-[#006c49] text-white'
                    : 'border border-[#3525cd] text-[#3525cd] hover:bg-[#f0ecf9]'
                }`}
              >
                {isSelected ? 'Membresía Activa' : plan.ctaText}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
