import React, { useState } from 'react';
import { Zap, SlidersHorizontal, Dog, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { BehaviorType, PetInfo } from '../types';

interface PetFormProps {
  onSubmit: (info: PetInfo) => void;
  isLoading: boolean;
}

export const PetForm: React.FC<PetFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number | ''>(2);
  const [weight, setWeight] = useState<number | ''>(25);
  const [behavior, setBehavior] = useState<BehaviorType>('equilibrado');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breed.trim()) return;

    onSubmit({
      name: name.trim() || breed.trim(),
      breed: breed.trim(),
      age: Number(age) || 1,
      weight: Number(weight) || 10,
      behavior,
      notes: notes.trim(),
    });
  };

  const loadPreset = (presetBreed: string, presetAge: number, presetWeight: number, presetBehavior: BehaviorType, presetName: string, presetNotes: string) => {
    setName(presetName);
    setBreed(presetBreed);
    setAge(presetAge);
    setWeight(presetWeight);
    setBehavior(presetBehavior);
    setNotes(presetNotes);
  };

  return (
    <section id="generator-section" className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd]">
            <Dog className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1b1b24] leading-tight">Configura tu Perfil</h2>
            <p className="text-xs text-[#464555]">Genera un plan de adiestramiento a medida con IA</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#3525cd] bg-[#f0ecf9] px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> IA Generativa
        </span>
      </div>

      {/* Preset Quick Fill Chips */}
      <div className="mb-5 space-y-1.5">
        <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider block">
          ¿Quieres probar un ejemplo rápido?
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadPreset('Golden Retriever', 2, 25, 'equilibrado', 'Toby', 'Tira un poco de la correa al principio')}
            className="text-xs bg-[#f5f2ff] hover:bg-[#eae6f4] text-[#3525cd] font-medium px-3 py-1.5 rounded-lg border border-[#c7c4d8]/40 transition-colors"
          >
            🐶 Toby (Golden, 2 años)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('Border Collie', 3, 18, 'activo', 'Max', 'Necesita mucha estimulación mental')}
            className="text-xs bg-[#f5f2ff] hover:bg-[#eae6f4] text-[#3525cd] font-medium px-3 py-1.5 rounded-lg border border-[#c7c4d8]/40 transition-colors"
          >
            ⚡ Max (Collie, Muy activo)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('Mestizo', 1, 12, 'ansioso', 'Luna', 'Se pone nerviosa con ruidos fuertes')}
            className="text-xs bg-[#f5f2ff] hover:bg-[#eae6f4] text-[#3525cd] font-medium px-3 py-1.5 rounded-lg border border-[#c7c4d8]/40 transition-colors"
          >
            🐾 Luna (Mestiza, Ansiosa)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre opcional + Raza */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-1.5">
              Nombre de tu mascota
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Toby / Luna"
              className="w-full bg-[#f5f2ff]/60 border border-[#c7c4d8] rounded-xl px-4 py-3 text-sm text-[#1b1b24] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-1.5">
              Raza del perro <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Ej: Golden Retriever, Pastor Alemán..."
              className="w-full bg-[#f5f2ff]/60 border border-[#c7c4d8] rounded-xl px-4 py-3 text-sm text-[#1b1b24] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all"
            />
          </div>
        </div>

        {/* Edad + Peso */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-1.5">
              Edad (años) <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="number"
              required
              min="0.1"
              max="25"
              step="0.5"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="2"
              className="w-full bg-[#f5f2ff]/60 border border-[#c7c4d8] rounded-xl px-4 py-3 text-sm text-[#1b1b24] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-1.5">
              Peso (kg) <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="number"
              required
              min="0.5"
              max="120"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="25"
              className="w-full bg-[#f5f2ff]/60 border border-[#c7c4d8] rounded-xl px-4 py-3 text-sm text-[#1b1b24] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all"
            />
          </div>
        </div>

        {/* Comportamiento principal */}
        <div>
          <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-1.5">
            Comportamiento principal
          </label>
          <div className="relative">
            <select
              value={behavior}
              onChange={(e) => setBehavior(e.target.value as BehaviorType)}
              className="w-full bg-[#f5f2ff]/60 border border-[#c7c4d8] rounded-xl px-4 py-3 text-sm text-[#1b1b24] focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none appearance-none cursor-pointer pr-10"
            >
              <option value="equilibrado">Equilibrado / Dócil</option>
              <option value="activo">Muy Activo / Energía Alta</option>
              <option value="ansioso">Ansioso / Reactivo</option>
              <option value="desobediente">Desobediente en calle / Tira de correa</option>
              <option value="miedoso">Miedoso / Fobias y ruidos</option>
              <option value="puppy">Cachorro en etapa de aprendizaje</option>
            </select>
            <ChevronDown className="w-5 h-5 text-[#777587] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Detalles / Objetivos adicionales */}
        <div>
          <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-1.5">
            Detalles u objetivos específicos (Opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Lladra a otros perros, ansiedad por separación, no atiende a la llamada..."
            className="w-full bg-[#f5f2ff]/60 border border-[#c7c4d8] rounded-xl px-4 py-3 text-sm text-[#1b1b24] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="shimmer-btn w-full bg-[#3525cd] hover:bg-[#4f46e5] active:scale-[0.99] text-white py-4 rounded-xl font-bold text-base shadow-md shadow-[#3525cd]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analizando con IA Etológica...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current text-amber-300" />
              <span>Generar Plan IA</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};
