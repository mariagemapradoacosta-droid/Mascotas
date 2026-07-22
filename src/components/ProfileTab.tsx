import React from 'react';
import { User as UserIcon, Dog, Calendar, ShieldCheck, Video, Settings, Plus, Award, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';
import { PetInfo, BookingSession, MembershipPlan, TrainingPlan } from '../types';

interface ProfileTabProps {
  user: User | null;
  onLogin: () => void;
  pets: PetInfo[];
  activePet: PetInfo | null;
  onSelectPet: (pet: PetInfo) => void;
  onNewPetClick: () => void;
  bookings: BookingSession[];
  activePlan: TrainingPlan | null;
  membership: MembershipPlan;
  onOpenPricing: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onLogin,
  pets,
  activePet,
  onSelectPet,
  onNewPetClick,
  bookings,
  activePlan,
  membership,
  onOpenPricing
}) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Profile Header */}
      <div className="bg-white border border-[#c7c4d8]/70 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Avatar'}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#3525cd] shadow-md shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#3525cd] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'PM'}
            </div>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-[#1b1b24]">
              {user?.displayName || 'Mi Cuenta PetMind'}
            </h2>
            <p className="text-xs text-[#464555]">{user?.email || 'Inicia sesión para sincronizar tus mascotas en la nube'}</p>
            <div className="inline-flex items-center gap-1.5 bg-[#6cf8bb]/30 text-[#00714d] border border-[#00714d]/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Suscripción: {membership.name}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {!user && (
            <button
              onClick={onLogin}
              className="px-4 py-2 bg-[#3525cd] text-white hover:bg-[#4f46e5] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Conectar Google</span>
            </button>
          )}

          <button
            onClick={onOpenPricing}
            className="px-4 py-2 bg-[#f0ecf9] text-[#3525cd] hover:bg-[#eae6f4] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Gestionar Plan
          </button>
        </div>
      </div>

      {/* Mis Mascotas Section */}
      <div className="bg-white border border-[#c7c4d8]/70 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1b1b24]">Mis Mascotas</h3>
            <p className="text-xs text-[#777587]">Selecciona la mascota activa para personalizar sus planes</p>
          </div>

          <button
            onClick={onNewPetClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3525cd] text-white rounded-xl text-xs font-bold hover:bg-[#4f46e5] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Perro</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pets.map((p, idx) => {
            const isSelected = activePet?.name === p.name;
            return (
              <div
                key={idx}
                onClick={() => onSelectPet(p)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-[#3525cd] bg-[#f0ecf9]/80 shadow-xs'
                    : 'border-[#c7c4d8]/50 bg-white hover:bg-[#f5f2ff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center font-bold">
                    <Dog className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1b1b24]">{p.name}</h4>
                    <p className="text-xs text-[#464555]">{p.breed} • {p.age} años • {p.weight} kg</p>
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[10px] font-extrabold uppercase bg-[#3525cd] text-white px-2 py-0.5 rounded-md">
                    Activa
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sesiones Etológicas Programadas */}
      <div className="bg-white border border-[#c7c4d8]/70 rounded-2xl p-6 shadow-xs space-y-3">
        <h3 className="text-lg font-bold text-[#1b1b24] flex items-center gap-2">
          <Video className="w-5 h-5 text-[#3525cd]" />
          <span>Videollamadas 1:1 Agendadas</span>
        </h3>

        {bookings.length === 0 ? (
          <p className="text-xs text-[#777587]">No tienes ninguna videollamada programada aún.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="p-3.5 bg-[#f5f2ff] border border-[#c7c4d8]/50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#1b1b24]">Sesión con {b.ethologistName}</h4>
                  <p className="text-[#464555]">{b.date} a las {b.time} • Mascota: {b.petName}</p>
                  <p className="text-[10px] text-[#777587] mt-0.5">Motivo: {b.topic}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-[10px] font-extrabold">
                  {b.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logros e Historial */}
      {activePlan && (
        <div className="bg-white border border-[#c7c4d8]/70 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-lg font-bold text-[#1b1b24] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#3525cd]" />
            <span>Estadísticas de Adiestramiento</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-[#f5f2ff] rounded-xl">
              <span className="text-2xl font-black text-[#3525cd]">
                {activePlan.weeklySchedule.filter((t) => t.completed).length}/7
              </span>
              <span className="block text-[11px] text-[#777587] mt-0.5 font-bold">Días Completados</span>
            </div>
            <div className="p-3 bg-[#f5f2ff] rounded-xl">
              <span className="text-2xl font-black text-[#006c49]">100%</span>
              <span className="block text-[11px] text-[#777587] mt-0.5 font-bold">Plan Refuerzo Positivo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
