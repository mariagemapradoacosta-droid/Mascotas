import { Ethologist, MembershipPlan, AppNotification } from '../types';

export const INITIAL_ETHOLOGISTS: Ethologist[] = [
  {
    id: 'eth_1',
    name: 'Dra. Elena Morales',
    title: 'Etóloga Canina & Veterinaria Conductual',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    reviewsCount: 128,
    pricePerSession: '39€ / sesión',
    specialties: ['Ansiedad por Separación', 'Miedos y Fobias', 'Adaptación de Cachorros'],
    bio: 'Más de 10 años de experiencia tratando trastornos de ansiedad y conducta en perros de todas las razas. Enfoque 100% positivo y respetuoso.',
    availableSlots: ['Hoy 17:00', 'Hoy 18:30', 'Mañana 10:00', 'Mañana 12:00', 'Viernes 16:00']
  },
  {
    id: 'eth_2',
    name: 'Carlos Ruíz',
    title: 'Especialista en Modificación de Conducta',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviewsCount: 94,
    pricePerSession: '35€ / sesión',
    specialties: ['Reactividad en Paseo', 'Agresividad Intrasalud', 'Paseo con Correa Larga'],
    bio: 'Adiestrador profesional titulado y técnico en modificación de conducta canina. Apasionado del trabajo de olfato y reactividad.',
    availableSlots: ['Mañana 11:30', 'Mañana 16:00', 'Jueves 09:30', 'Jueves 18:00']
  },
  {
    id: 'eth_3',
    name: 'Dr. Marcos Alba',
    title: 'Psicólogo Animal & Investigador',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    rating: 5.0,
    reviewsCount: 210,
    pricePerSession: '45€ / sesión',
    specialties: ['Estrés Crónico', 'Perros Adoptados / Trauma', 'Estimulación Cognitiva'],
    bio: 'Doctor en Etología Aplicada con máster en neurobiología canina. Especialista en la rehabilitación emocional de perros rescatados.',
    availableSlots: ['Hoy 19:00', 'Viernes 11:00', 'Viernes 17:30', 'Sábado 10:00']
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan_basic',
    name: 'Básico Semanal',
    price: '2.99€',
    period: '/semana',
    ctaText: 'Elegir Plan',
    features: [
      { text: 'Planes de IA Ilimitados', included: true },
      { text: 'Seguimiento de Tareas 7 Días', included: true },
      { text: 'Guía Nutricional Personalizada', included: true },
      { text: 'Consulta directa con etólogos', included: false },
      { text: 'Sesión 1:1 por videollamada', included: false }
    ]
  },
  {
    id: 'plan_plus',
    name: 'Básico Mensual',
    price: '8.99€',
    period: '/mes',
    popular: true,
    badge: 'Ahorra un 25%',
    ctaText: 'Suscribirse',
    features: [
      { text: 'Todo lo del Básico Semanal', included: true },
      { text: 'Historial completo de progresos', included: true },
      { text: 'Chat ilimitado con Etólogo IA 24/7', included: true },
      { text: 'Exportación a PDF e impresión', included: true },
      { text: 'Sesión 1:1 por videollamada', included: false }
    ]
  },
  {
    id: 'plan_pro',
    name: 'PRO + Psicología',
    price: '24.99€',
    period: '/mes',
    badge: 'Recomendado',
    ctaText: 'Elegir PRO',
    features: [
      { text: 'Todo lo del Plan Plus Mensual', included: true },
      { text: '1 Sesión de Etología 1:1 al mes incluida', included: true },
      { text: 'Soporte prioritario por WhatsApp/Chat', included: true },
      { text: 'Atención personalizada para casos complejos', included: true },
      { text: 'Revisión mensual de objetivos', included: true }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: '¡Es hora del entrenamiento!',
    message: 'Toby tiene programada hoy la sesión de truco "Contacto Visual Sostenido". ¡Solo tomará 10 minutos!',
    time: 'Hace 15 min',
    read: false,
    type: 'reminder'
  },
  {
    id: 'notif_2',
    title: 'Nuevo consejo de Etología',
    message: 'Descubre cómo los paseos olfativos de 15 minutos reducen el estrés más que correr a toda velocidad.',
    time: 'Hace 2 horas',
    read: false,
    type: 'tip'
  },
  {
    id: 'notif_3',
    title: 'Plan Actualizado',
    message: 'Has completado 3 de las 7 tareas semanales. ¡Sigue así para desbloquear la medalla de Adiestrador Estrella!',
    time: 'Ayer',
    read: true,
    type: 'plan'
  }
];
