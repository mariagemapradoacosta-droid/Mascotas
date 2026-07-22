import React, { useState } from 'react';
import { PawPrint, Activity, GraduationCap, Utensils, HeartPulse, Calendar, Download, CheckCircle2, Circle, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { TrainingPlan, DayScheduleTask } from '../types';

interface PlanDashboardProps {
  plan: TrainingPlan | null;
  onToggleTask: (taskId: string) => void;
  onAskEthologist: (prompt: string) => void;
}

export const PlanDashboard: React.FC<PlanDashboardProps> = ({
  plan,
  onToggleTask,
  onAskEthologist,
}) => {
  const [activeTab, setActiveTab] = useState<'exercise' | 'trick' | 'nutrition' | 'ethology' | 'schedule'>('exercise');

  if (!plan) {
    return (
      <section id="results-anchor" className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-8 min-h-[320px] flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-20 h-20 bg-[#f5f2ff] rounded-full flex items-center justify-center mb-4 border border-[#c7c4d8]/40">
          <PawPrint className="w-10 h-10 text-[#777587]" />
        </div>
        <h3 className="text-xl font-bold text-[#1b1b24]">Tu plan aparecerá aquí</h3>
        <p className="text-sm text-[#777587] mt-1.5 max-w-sm">
          Introduce los datos de tu mascota en el formulario superior para generar un programa personalizado.
        </p>
      </section>
    );
  }

  const { petInfo, dailyExercise, weeklyTrick, nutritionGuide, ethologyNotes, weeklySchedule } = plan;

  const completedCount = weeklySchedule.filter((t) => t.completed).length;
  const totalCount = weeklySchedule.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <section id="results-anchor" className="print-area bg-white border border-[#c7c4d8]/70 rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Pet Header Bar */}
      <div className="p-6 bg-[#f5f2ff]/80 border-b border-[#c7c4d8]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#3525cd] rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#3525cd]/20 shrink-0">
            <PawPrint className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-extrabold text-[#1b1b24]">{petInfo.name}</h3>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#3525cd]/10 text-[#3525cd] px-2.5 py-0.5 rounded-full">
                {petInfo.behavior}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#464555] mt-1">
              {petInfo.breed} • {petInfo.age} {petInfo.age === 1 ? 'año' : 'años'} • {petInfo.weight} kg
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="w-full sm:w-auto bg-white border border-[#c7c4d8]/60 p-3 rounded-xl flex items-center gap-3">
          <div className="flex-1 sm:w-32">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#1b1b24]">Progreso Semanal</span>
              <span className="text-[#3525cd]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#eae6f4] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#3525cd] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#464555] whitespace-nowrap">
            {completedCount}/{totalCount} días
          </span>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="px-6 py-3.5 bg-[#f0ecf9]/50 border-b border-[#c7c4d8]/30 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#3525cd] shrink-0 mt-0.5" />
        <p className="text-xs text-[#1b1b24] font-medium leading-relaxed">
          {plan.summary}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#c7c4d8]/40 bg-[#fcf8ff] overflow-x-auto no-print">
        <button
          onClick={() => setActiveTab('exercise')}
          className={`flex-1 py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'exercise'
              ? 'border-[#3525cd] text-[#3525cd] bg-white'
              : 'border-transparent text-[#777587] hover:text-[#1b1b24]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Ejercicio</span>
        </button>

        <button
          onClick={() => setActiveTab('trick')}
          className={`flex-1 py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'trick'
              ? 'border-[#3525cd] text-[#3525cd] bg-white'
              : 'border-transparent text-[#777587] hover:text-[#1b1b24]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Truco de la semana</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`flex-1 py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'nutrition'
              ? 'border-[#3525cd] text-[#3525cd] bg-white'
              : 'border-transparent text-[#777587] hover:text-[#1b1b24]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Nutrición</span>
        </button>

        <button
          onClick={() => setActiveTab('ethology')}
          className={`flex-1 py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'ethology'
              ? 'border-[#3525cd] text-[#3525cd] bg-white'
              : 'border-transparent text-[#777587] hover:text-[#1b1b24]'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Etología</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'border-[#3525cd] text-[#3525cd] bg-white'
              : 'border-transparent text-[#777587] hover:text-[#1b1b24]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendario ({completedCount}/7)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* PANEL: EJERCICIO */}
        {activeTab === 'exercise' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">Plan de Actividad Diario</span>
                <h4 className="text-xl font-bold text-[#1b1b24]">{dailyExercise.title}</h4>
              </div>
              <span className="bg-[#6cf8bb]/30 text-[#00714d] text-xs font-bold px-3 py-1 rounded-full border border-[#00714d]/20 whitespace-nowrap">
                ⏱️ {dailyExercise.duration}
              </span>
            </div>

            <p className="text-sm text-[#464555] leading-relaxed bg-[#f5f2ff] p-4 rounded-xl border border-[#c7c4d8]/40">
              {dailyExercise.description}
            </p>

            <div>
              <h5 className="text-xs font-bold text-[#1b1b24] uppercase tracking-wider mb-2">Consejos del Adiestrador</h5>
              <ul className="space-y-2">
                {dailyExercise.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#464555] bg-white border border-[#c7c4d8]/40 p-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-[#006c49] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* PANEL: TRUCO */}
        {activeTab === 'trick' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">Desafío Cognitivo Semanal</span>
                <h4 className="text-xl font-bold text-[#1b1b24]">{weeklyTrick.title}</h4>
              </div>
              <span className="bg-[#f0ecf9] text-[#3525cd] text-xs font-bold px-3 py-1 rounded-full border border-[#c7c4d8]/40 whitespace-nowrap">
                Dificultad: {weeklyTrick.difficulty}
              </span>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#1b1b24] uppercase tracking-wider mb-2">Paso a Paso</h5>
              <div className="space-y-2">
                {weeklyTrick.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-[#f5f2ff]/60 border border-[#c7c4d8]/40 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-[#3525cd] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-[#1b1b24] font-medium leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {weeklyTrick.commonMistakes && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Error común a evitar:</strong> {weeklyTrick.commonMistakes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL: NUTRICIÓN */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">Pauta Alimentaria y Salud</span>
              <h4 className="text-xl font-bold text-[#1b1b24]">Pauta de Alimentación Recomendada</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#f5f2ff] border border-[#c7c4d8]/40 p-4 rounded-xl text-center">
                <span className="text-xs font-bold text-[#777587] block">Calorías Diarias</span>
                <span className="text-2xl font-black text-[#3525cd] mt-1 block">{nutritionGuide.dailyCalories} kcal</span>
              </div>
              <div className="bg-[#f5f2ff] border border-[#c7c4d8]/40 p-4 rounded-xl text-center">
                <span className="text-xs font-bold text-[#777587] block">Ración Diaria</span>
                <span className="text-2xl font-black text-[#006c49] mt-1 block">{nutritionGuide.gramsPerDay} g</span>
              </div>
              <div className="bg-[#f5f2ff] border border-[#c7c4d8]/40 p-4 rounded-xl text-center">
                <span className="text-xs font-bold text-[#777587] block">Tomas Diarias</span>
                <span className="text-2xl font-black text-[#1b1b24] mt-1 block">{nutritionGuide.mealsCount} comidas</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#c7c4d8]/40 rounded-xl space-y-2">
              <h5 className="text-xs font-bold text-[#1b1b24] uppercase tracking-wider">Tipo de Alimento Recomendado</h5>
              <p className="text-xs text-[#464555]">{nutritionGuide.foodTypes}</p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#1b1b24] uppercase tracking-wider mb-2">Recomendaciones Clave</h5>
              <ul className="space-y-2">
                {nutritionGuide.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#464555] bg-[#f5f2ff]/60 border border-[#c7c4d8]/30 p-3 rounded-xl">
                    <Utensils className="w-4 h-4 text-[#3525cd] shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* PANEL: ETOLOGÍA */}
        {activeTab === 'ethology' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">Salud Emocional y Conducta</span>
              <h4 className="text-xl font-bold text-[#1b1b24]">{ethologyNotes.title}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f5f2ff] border border-[#c7c4d8]/40 rounded-xl space-y-1.5">
                <h5 className="text-xs font-bold text-[#3525cd] uppercase tracking-wider">🧠 Estimulación Mental</h5>
                <p className="text-xs text-[#464555] leading-relaxed">{ethologyNotes.mentalStimulation}</p>
              </div>

              <div className="p-4 bg-[#6cf8bb]/15 border border-[#00714d]/20 rounded-xl space-y-1.5">
                <h5 className="text-xs font-bold text-[#00714d] uppercase tracking-wider">🌿 Gestión del Estrés</h5>
                <p className="text-xs text-[#1b1b24] leading-relaxed">{ethologyNotes.stressManagement}</p>
              </div>
            </div>

            {ethologyNotes.warningSigns && ethologyNotes.warningSigns.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-[#1b1b24] uppercase tracking-wider mb-2">Señales de Alerta Emocional</h5>
                <div className="space-y-2">
                  {ethologyNotes.warningSigns.map((sign, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL: CALENDARIO 7 DÍAS */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">Checklist Diaria</span>
                <h4 className="text-xl font-bold text-[#1b1b24]">Calendario de Tareas de la Semana</h4>
              </div>
              <span className="text-xs font-bold text-[#3525cd] bg-[#f0ecf9] px-3 py-1 rounded-full">
                {completedCount} de 7 completadas
              </span>
            </div>

            <p className="text-xs text-[#777587]">
              Haz clic en la casilla de cada día para marcar las actividades que hayas completado con tu perro.
            </p>

            <div className="space-y-2.5">
              {weeklySchedule.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleTask(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.completed
                      ? 'bg-[#6cf8bb]/15 border-[#00714d]/30 text-[#00714d]'
                      : 'bg-[#f5f2ff]/60 border-[#c7c4d8]/40 hover:bg-[#f0ecf9] text-[#1b1b24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button type="button" className="shrink-0 focus:outline-none">
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-[#006c49] fill-[#6cf8bb]" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#777587]" />
                      )}
                    </button>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3525cd] block">
                        {item.day}
                      </span>
                      <span className={`text-xs font-semibold ${item.completed ? 'line-through text-[#00714d]' : 'text-[#1b1b24]'}`}>
                        {item.task}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white border border-[#c7c4d8]/50 text-[#777587] shrink-0">
                    {item.category === 'exercise' ? 'Ejercicio' : item.category === 'trick' ? 'Truco' : item.category === 'mental' ? 'Olfato' : 'Salud'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="p-4 bg-[#f5f2ff]/90 border-t border-[#c7c4d8]/40 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <button
          onClick={() => onAskEthologist(`Tengo dudas sobre el plan de adiestramiento de mi perro ${petInfo.name} (${petInfo.breed}, ${petInfo.behavior}). ¿Podrías darme un consejo específico para acelerar su progreso?`)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#3525cd] text-[#3525cd] hover:bg-[#f0ecf9] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Consultar al Etólogo IA sobre este plan</span>
        </button>

        <button
          onClick={handlePrintPDF}
          className="printable-btn w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Descargar PDF Completo</span>
        </button>
      </div>
    </section>
  );
};
