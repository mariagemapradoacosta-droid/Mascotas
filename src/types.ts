export type BehaviorType = 'activo' | 'ansioso' | 'desobediente' | 'equilibrado' | 'miedoso' | 'puppy';

export interface PetInfo {
  name: string;
  breed: string;
  age: number;
  weight: number;
  behavior: BehaviorType;
  notes?: string;
}

export interface ExerciseItem {
  title: string;
  duration: string;
  description: string;
  tips: string[];
}

export interface TrickItem {
  title: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  steps: string[];
  commonMistakes: string;
}

export interface NutritionItem {
  dailyCalories: number;
  gramsPerDay: number;
  mealsCount: number;
  recommendations: string[];
  foodTypes: string;
}

export interface EthologyItem {
  title: string;
  mentalStimulation: string;
  stressManagement: string;
  warningSigns: string[];
}

export interface DayScheduleTask {
  id: string;
  day: string;
  task: string;
  category: 'exercise' | 'trick' | 'mental' | 'health';
  completed: boolean;
}

export interface TrainingPlan {
  id: string;
  petInfo: PetInfo;
  createdAt: string;
  summary: string;
  dailyExercise: ExerciseItem;
  weeklyTrick: TrickItem;
  nutritionGuide: NutritionItem;
  ethologyNotes: EthologyItem;
  weeklySchedule: DayScheduleTask[];
}

export interface Ethologist {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
  pricePerSession: string;
  specialties: string[];
  bio: string;
  availableSlots: string[];
}

export interface BookingSession {
  id: string;
  ethologistId: string;
  ethologistName: string;
  ethologistTitle: string;
  date: string;
  time: string;
  topic: string;
  petName: string;
  status: 'confirmada' | 'completada' | 'pendiente';
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  popular?: boolean;
  features: { text: string; included: boolean }[];
  ctaText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'ethologist';
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'plan' | 'booking' | 'tip' | 'reminder';
}
