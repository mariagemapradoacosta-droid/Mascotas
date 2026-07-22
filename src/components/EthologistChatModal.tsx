import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2, Dog } from 'lucide-react';
import { ChatMessage, PetInfo } from '../types';

interface EthologistChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePet?: PetInfo | null;
  initialPrompt?: string;
}

export const EthologistChatModal: React.FC<EthologistChatModalProps> = ({
  isOpen,
  onClose,
  activePet,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'ai',
      text: activePet
        ? `¡Hola! Soy tu Etólogo IA. He revisado la ficha de ${activePet.name} (${activePet.breed}, ${activePet.behavior}). ¿En qué comportamiento o duda puedo ayudarte hoy?`
        : '¡Hola! Soy el Etólogo IA de PetMind. ¿Qué consulta o problema de comportamiento tienes sobre tu mascota?',
      timestamp: 'Ahora'
    }
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-ethologist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          petProfile: activePet,
          chatHistory: messages.map((m) => ({ role: m.sender, content: m.text }))
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Entiendo la situación. Para abordar esto de forma efectiva, te sugiero crear rutinas de refuerzo positivo diarias.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'ai',
          text: 'Lo siento, ha habido un problema de conexión. Te sugiero intentar de nuevo en un momento.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '¿Cómo evito que mi perro tire de la correa?',
    '¿Qué hago si llora cuando me voy de casa?',
    '¿Cómo enseño a mi perro a venir a la llamada?',
    '¿Qué juegos de olfato me recomiendas?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#c7c4d8]/80 rounded-2xl max-w-xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-[#3525cd] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                <span>Consulta Etológica IA 24/7</span>
              </h3>
              <p className="text-[11px] text-indigo-100">
                {activePet ? `Orientado para ${activePet.name} (${activePet.breed})` : 'Especialista en conducta canina'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 bg-[#f5f2ff] border-b border-[#c7c4d8]/40 overflow-x-auto flex gap-2 no-scrollbar shrink-0">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium bg-white hover:bg-[#eae6f4] text-[#3525cd] border border-[#c7c4d8]/60 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fcf8ff] custom-scroll">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#3525cd] text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#3525cd] text-white rounded-br-none'
                    : 'bg-white border border-[#c7c4d8]/60 text-[#1b1b24] shadow-xs rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-[#777587]'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#6cf8bb] text-[#002113] flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  Tú
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-[#777587] bg-white border border-[#c7c4d8]/50 p-3 rounded-xl w-fit">
              <Loader2 className="w-4 h-4 text-[#3525cd] animate-spin" />
              <span>El Etólogo IA está redactando la respuesta...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="p-3 bg-white border-t border-[#c7c4d8]/50 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta sobre el comportamiento..."
              className="flex-1 bg-[#f5f2ff] border border-[#c7c4d8]/70 rounded-xl px-4 py-2.5 text-xs text-[#1b1b24] outline-none focus:ring-2 focus:ring-[#3525cd]/20"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#3525cd] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#4f46e5] disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
