import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, UserCheck, Star } from 'lucide-react';
import { INITIAL_ETHOLOGISTS } from '../data/initialData';
import { BookingSession } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (session: BookingSession) => void;
  defaultPetName?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirmBooking,
  defaultPetName = 'Tu mascota'
}) => {
  const [selectedEthologistId, setSelectedEthologistId] = useState(INITIAL_ETHOLOGISTS[0].id);
  const [selectedSlot, setSelectedSlot] = useState(INITIAL_ETHOLOGISTS[0].availableSlots[0]);
  const [topic, setTopic] = useState('Ansiedad por separación y ladrido compulsivo');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedEthologist = INITIAL_ETHOLOGISTS.find((e) => e.id === selectedEthologistId) || INITIAL_ETHOLOGISTS[0];

  const handleEthologistChange = (id: string) => {
    setSelectedEthologistId(id);
    const eth = INITIAL_ETHOLOGISTS.find((e) => e.id === id);
    if (eth && eth.availableSlots.length > 0) {
      setSelectedSlot(eth.availableSlots[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const [datePart, timePart] = selectedSlot.split(' ');

    const newBooking: BookingSession = {
      id: `booking_${Date.now()}`,
      ethologistId: selectedEthologist.id,
      ethologistName: selectedEthologist.name,
      ethologistTitle: selectedEthologist.title,
      date: datePart,
      time: timePart || '17:00',
      topic: topic.trim() || 'Consulta etológica general',
      petName: defaultPetName,
      status: 'confirmada'
    };

    onConfirmBooking(newBooking);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#c7c4d8]/80 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777587] hover:text-[#1b1b24] p-2 rounded-full hover:bg-[#f5f2ff]"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#6cf8bb]/30 text-[#00714d] rounded-full flex items-center justify-center mx-auto border border-[#00714d]/20">
              <CheckCircle2 className="w-10 h-10 text-[#006c49]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#1b1b24]">¡Reserva Confirmada!</h3>
            <p className="text-sm text-[#464555] max-w-sm mx-auto">
              Hemos agendado tu videollamada 1:1 con <strong>{selectedEthologist.name}</strong> para el turno <strong>{selectedSlot}</strong>.
            </p>

            <div className="bg-[#f5f2ff] p-4 rounded-xl border border-[#c7c4d8]/40 text-left text-xs text-[#1b1b24] space-y-1">
              <p><strong>Mascota:</strong> {defaultPetName}</p>
              <p><strong>Motivo:</strong> {topic}</p>
              <p><strong>Enlace Google Meet:</strong> Se enviará 15 minutos antes a tu correo.</p>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full bg-[#3525cd] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-[#4f46e5] transition-colors"
            >
              Aceptar y Volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3525cd] bg-[#f0ecf9] px-2.5 py-1 rounded-full">
                Etología 1:1
              </span>
              <h3 className="text-xl font-extrabold text-[#1b1b24] mt-2">Reservar Sesión con Experto</h3>
              <p className="text-xs text-[#777587]">Selecciona el especialista etólogo y la hora que mejor te convenga.</p>
            </div>

            {/* Ethologist Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider">
                Selecciona al Etólogo Canino
              </label>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 custom-scroll">
                {INITIAL_ETHOLOGISTS.map((eth) => (
                  <div
                    key={eth.id}
                    onClick={() => handleEthologistChange(eth.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      selectedEthologistId === eth.id
                        ? 'border-[#3525cd] bg-[#f0ecf9]/60 shadow-xs'
                        : 'border-[#c7c4d8]/50 hover:bg-[#f5f2ff]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={eth.avatarUrl}
                        alt={eth.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#c7c4d8]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#1b1b24]">{eth.name}</h4>
                        <p className="text-[11px] text-[#464555]">{eth.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-current text-amber-500" />
                          <span>{eth.rating} ({eth.reviewsCount} opiniones)</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#3525cd]">{eth.pricePerSession}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">
                Horarios Disponibles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedEthologist.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSlot === slot
                        ? 'bg-[#3525cd] text-white border-[#3525cd]'
                        : 'bg-[#f5f2ff] text-[#1b1b24] border-[#c7c4d8]/60 hover:bg-[#eae6f4]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivo de consulta */}
            <div>
              <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-1.5">
                Motivo principal de consulta para {defaultPetName}
              </label>
              <textarea
                rows={2}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe el comportamiento que deseas tratar..."
                className="w-full bg-[#f5f2ff]/60 border border-[#c7c4d8] rounded-xl p-3 text-xs text-[#1b1b24] outline-none focus:ring-2 focus:ring-[#3525cd]/20"
              />
            </div>

            {/* Action */}
            <button
              type="submit"
              className="w-full bg-[#3525cd] hover:bg-[#4f46e5] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Confirmar Reserva ({selectedEthologist.pricePerSession})</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
