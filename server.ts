import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-initialize GenAI client
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. Mock fallback will be used if API calls fail.");
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Endpoint: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Endpoint: Generate Pet Plan with Gemini
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { name, breed, age, weight, behavior, notes } = req.body;

      if (!breed || !age || !weight || !behavior) {
        return res.status(400).json({ error: "Missing required pet parameters (breed, age, weight, behavior)" });
      }

      const petName = name && name.trim() ? name.trim() : breed;
      const ai = getGenAI();

      if (ai) {
        try {
          const prompt = `Eres un etólogo canino certificado y adiestrador profesional galardonado.
Crea un plan de adiestramiento, salud y nutrición integral para el siguiente perro:
- Nombre: ${petName}
- Raza: ${breed}
- Edad: ${age} años
- Peso: ${weight} kg
- Comportamiento principal: ${behavior} (opciones comunes: activo, ansioso, desobediente, equilibrado, miedoso, puppy)
- Notas adicionales: ${notes || "Ninguna"}

Genera una respuesta en JSON estricto que contenga los siguientes campos:
1. summary: Un resumen inspirador de 2 frases sobre la personalidad y potencial de esta mascota.
2. dailyExercise: { title: string, duration: string, description: string, tips: [string, string] }
3. weeklyTrick: { title: string, difficulty: 'Fácil' | 'Intermedio' | 'Avanzado', steps: [string, string, string], commonMistakes: string }
4. nutritionGuide: { dailyCalories: number, gramsPerDay: number, mealsCount: number, recommendations: [string, string], foodTypes: string }
5. ethologyNotes: { title: string, mentalStimulation: string, stressManagement: string, warningSigns: [string, string] }
6. weeklySchedule: Array de 7 objetos con { id: string, day: 'Lunes'|'Martes'|'Miércoles'|'Jueves'|'Viernes'|'Sábado'|'Domingo', task: string, category: 'exercise'|'trick'|'mental'|'health', completed: false }

Por favor responde ÚNICAMENTE con el objeto JSON válido.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          });

          const rawText = response.text || "";
          let parsedData;
          try {
            parsedData = JSON.parse(rawText);
          } catch (e) {
            console.error("Failed to parse Gemini JSON output directly:", e);
            // Retry stripping markdown if present
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleaned);
          }

          if (parsedData) {
            const plan = {
              id: `plan_${Date.now()}`,
              petInfo: {
                name: petName,
                breed,
                age: Number(age),
                weight: Number(weight),
                behavior,
                notes: notes || '',
              },
              createdAt: new Date().toLocaleDateString("es-ES", { day: 'numeric', month: 'short', year: 'numeric' }),
              summary: parsedData.summary || `Plan personalizado para ${petName}, enfocado en su comportamiento ${behavior}.`,
              dailyExercise: parsedData.dailyExercise || {
                title: "Rutina Adaptada",
                duration: "45 min/día",
                description: `Paseo activo y estimulación física apropiada para un ${breed} de ${weight}kg.`,
                tips: ["Evita horas de calor extremo", "Incorporate descansos con hidratación"]
              },
              weeklyTrick: parsedData.weeklyTrick || {
                title: "Atención y Enfoque",
                difficulty: "Fácil",
                steps: ["Mantén premios en mano", "Premia cuando te mire a los ojos", "Aumenta la duración poco a poco"],
                commonMistakes: "No repitas el comando 'Mírame' múltiples veces."
              },
              nutritionGuide: parsedData.nutritionGuide || {
                dailyCalories: Math.round(Number(weight) * 30 + 70),
                gramsPerDay: Math.round((Number(weight) * 30 + 70) / 3.8),
                mealsCount: Number(age) < 1 ? 3 : 2,
                recommendations: ["Racionar en comedero lento para evitar ansia", "Proteínas de alta digestibilidad"],
                foodTypes: "Pienso de gama alta rico en proteína animal y Omega-3"
              },
              ethologyNotes: parsedData.ethologyNotes || {
                title: "Salud Conductual",
                mentalStimulation: "Juegos de olfato 15 minutos al día con alfombra olfativa.",
                stressManagement: "Crear un espacio seguro de calma en casa con su cama favorita.",
                warningSigns: ["Jadear excesivo sin calor", "Rascado compulsivo por ansiedad"]
              },
              weeklySchedule: parsedData.weeklySchedule || generateDefaultSchedule(petName, behavior)
            };

            return res.json({ success: true, plan });
          }
        } catch (aiError) {
          console.error("Gemini API call failed, falling back to local algorithmic generation:", aiError);
        }
      }

      // Smart Fallback generator if AI is unavailable or fails
      const fallbackPlan = generateAlgorithmicPlan(petName, breed, Number(age), Number(weight), behavior, notes);
      return res.json({ success: true, plan: fallbackPlan, fallback: true });

    } catch (err: any) {
      console.error("Error in /api/generate-plan:", err);
      res.status(500).json({ error: "No se pudo generar el plan en este momento.", details: err.message });
    }
  });

  // API Endpoint: AI Ethologist Chat
  app.post("/api/chat-ethologist", async (req, res) => {
    try {
      const { message, petProfile, chatHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "El mensaje no puede estar vacío." });
      }

      const ai = getGenAI();
      if (ai) {
        try {
          const petContext = petProfile
            ? `Datos de la mascota actual del usuario: Nombre: ${petProfile.name}, Raza: ${petProfile.breed}, Edad: ${petProfile.age} años, Peso: ${petProfile.weight}kg, Comportamiento: ${petProfile.behavior}.`
            : "El usuario consulta sobre su perro.";

          const systemInstruction = `Eres un etólogo canino y psicólogo animal experto y empático de PetMind AI. Tu tono es profesional, cálido, positivo y basado en el adiestramiento respetuoso con refuerzo positivo (sin castigos ni violencia).
${petContext}
Responde de manera concisa y práctica en español, dividiendo la respuesta en párrafos claros o puntos claves si ayuda a la lectura. Máximo 180 palabras.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `Historial de conversación breve: ${JSON.stringify(chatHistory || [])}\nPregunta del usuario: ${message}`,
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });

          return res.json({ success: true, reply: response.text || "Entiendo perfectamente lo que me comentas. Para tratar esto efectivamente, te recomiendo empezar con sesiones cortas de refuerzo positivo diario." });
        } catch (err) {
          console.error("Gemini chat error:", err);
        }
      }

      // Fallback response for chat
      return res.json({
        success: true,
        reply: `¡Hola! Como etólogo de PetMind AI, te aconsejo enfocar este comportamiento con paciencia. Para la situación de tu perro (${petProfile?.name || 'tu mascota'}), es clave premiar las conductas tranquilas con premios de alto valor y mantener rutinas constantes de estimulación mental.`
      });
    } catch (err: any) {
      res.status(500).json({ error: "Error procesando la consulta etológica." });
    }
  });

  // Vite middleware in dev mode vs static files in prod mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PetMind AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

function generateDefaultSchedule(petName: string, behavior: string) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const tasks = [
    { task: "Paseo olfativo de 30 min sin tirones", category: 'exercise' as const },
    { task: "Sesión de 10 min de 'Sentado y Espera' con premios", category: 'trick' as const },
    { task: "Juego de búsqueda de comida en alfombra olfativa", category: 'mental' as const },
    { task: "Caminata activa con cambios de ritmo en parque", category: 'exercise' as const },
    { task: "Práctica del truco 'Junto' con distracciones suaves", category: 'trick' as const },
    { task: "Revisión de oídos, cepillado y masaje de relajación", category: 'health' as const },
    { task: "Excursión en entorno natural o parque de perros tranquilo", category: 'exercise' as const },
  ];

  return days.map((day, idx) => ({
    id: `task_${idx}_${Date.now()}`,
    day,
    task: tasks[idx].task,
    category: tasks[idx].category,
    completed: false,
  }));
}

function generateAlgorithmicPlan(name: string, breed: string, age: number, weight: number, behavior: string, notes?: string) {
  const dailyCalories = Math.round(weight * 30 + 70);
  const gramsPerDay = Math.round(dailyCalories / 3.8);

  let exercise, trick, ethology, recommendations;

  if (behavior === 'activo') {
    exercise = {
      title: "Entrenamiento de Alta Energía y Agilidad",
      duration: "60 - 75 min/día",
      description: "Combinación de running progresivo, lanzamientos de pelota con pausas de control y 20 min de rastro olfativo.",
      tips: ["Satisface primero la necesidad mental con olfato antes del ejercicio físico intenso", "Usa juguetes tipo Kong rellenos congelados para calmar en casa"]
    };
    trick = {
      title: "Giro y Saltar Obstáculos Bajo Control",
      difficulty: "Intermedio" as const,
      steps: [
        "Guía a tu perro en círculo con un premio cerca de su hocico diciendo 'Gira'",
        "Combina el giro con un salto suave sobre una barra baja",
        "Premia en el instante exacto en que aterrice con éxito"
      ],
      commonMistakes: "Lanzar el premio demasiado pronto antes de completar la rotación."
    };
    ethology = {
      title: "Gestión de la Sobreexcitación",
      mentalStimulation: "3 sesiones diarias de 10 min de juegos de cobro o puzles de nivel 2.",
      stressManagement: "Instaurar el 'Protocolo de Calma': permanecer echado en su cama mientras la familia come.",
      warningSigns: ["Ladridos continuos por demanda de atención", "Morder la correa durante los paseos"]
    };
  } else if (behavior === 'ansioso') {
    exercise = {
      title: "Paseo Descompresivo y Estabilización",
      duration: "40 - 50 min/día",
      description: "Paseos lentos con correa larga de 5 metros en zonas verdes tranquilas con baja densidad de estímulos.",
      tips: ["Permite que olfatee todo lo que desee sin prisas", "Usa arnés en Y ergonómico en lugar de collar de cuello"]
    };
    trick = {
      title: "Contacto Visual Sostenido ('Focus')",
      difficulty: "Fácil" as const,
      steps: [
        "Sostén un premio cerca de tus ojos y espera a que tu perro te mire a la cara",
        "En el instante en que mantenga la mirada, di 'Muy bien' y entrégale el premio",
        "Aumenta la duración de la mirada de 1 a 5 segundos progresivamente"
      ],
      commonMistakes: "Mirar fijamente de forma intimidante; mantén una mirada suave y alegre."
    };
    ethology = {
      title: "Reducción de Ansiedad por Separación",
      mentalStimulation: "Ofrecer juguetes lamedores (Lickmats) con kéfir o pavo antes de salir de casa.",
      stressManagement: "Evitar despedidas efusivas y salidas dramáticas. Practicar salidas falsas de 2 minutos.",
      warningSigns: ["Jadear excesivo con lengua ancha", "Rascado cerca de puertas o ventanas"]
    };
  } else if (behavior === 'desobediente') {
    exercise = {
      title: "Paseo Estructurado con Reglas Claras",
      duration: "45 min/día",
      description: "Paseo con cambios frecuentes de dirección, paradas estratégicas y práctica del 'Junto' en tramos breves.",
      tips: ["Premia la posición junto a tu pierna con golosinas blandas de alto valor", "Si tira de la correa, detente inmediatamente sin dar tirones bruscos"]
    };
    trick = {
      title: "Llamada de Emergencia Imparable",
      difficulty: "Intermedio" as const,
      steps: [
        "Elige una palabra clave nueva y entusiasta como '¡AQUÍ!'",
        "Comienza a 2 metros de distancia con premios irresistibles (pollo cocido o salchicha)",
        "Cuando llegue corriendo, sujétalo suavemente del arnés mientras lo premias apasionadamente"
      ],
      commonMistakes: "Llamar al perro para regañarlo o terminar la diversión en el parque."
    };
    ethology = {
      title: "Creación de Vínculo y Liderazgo Respetuoso",
      mentalStimulation: "Juegos de autocontrol: el perro debe esperar sentado antes de comer o salir por la puerta.",
      stressManagement: "Mantener una voz firme pero enérgica y alegre, evitando gritos que generen confusión.",
      warningSigns: ["Ignorar intencionadamente cuando hay estímulos externos", "Saltar sobre las personas"]
    };
  } else {
    exercise = {
      title: "Rutina Equilibrada de Bienestar Completo",
      duration: "45 - 60 min/día",
      description: "Paseo interactivo en parque, ejercicios de agilidad urbana y socialización libre controlada.",
      tips: ["Varía las rutas de paseo semanalmente para explorar nuevos olores", "Mantén hidratación fresca siempre disponible"]
    };
    trick = {
      title: "Sentado, Quieto y Distracción Media",
      difficulty: "Fácil" as const,
      steps: [
        "Pide 'Sentado' y da un paso atrás mostrando la palma de la mano abierta",
        "Cuenta 3 segundos, regresa a su lado y premia si se mantuvo quieto",
        "Aumenta la distancia a 5 metros y añade distracciones progresivas"
      ],
      commonMistakes: "Retroceder demasiado rápido antes de afianzar la permanencia corta."
    };
    ethology = {
      title: "Mantenimiento del Bienestar Emocional",
      mentalStimulation: "Puzles interactivos de madera y juegos de escondite con objetos o familiares.",
      stressManagement: "Tiempos de descanso ininterrumpidos de al menos 12-14 horas al día.",
      warningSigns: ["Cambios repentinos en apetito o nivel de energía"]
    };
  }

  recommendations = [
    `Ajustar ración a ${gramsPerDay}g diarios divididos en ${age < 1 ? 3 : 2} tomas.`,
    "Añadir suplemento de Aceite de Salmón (Omega-3) para favorecer la salud articular y el pelaje.",
    "Mantener agua fresca y limpia disponible las 24 horas."
  ];

  return {
    id: `plan_${Date.now()}`,
    petInfo: {
      name,
      breed,
      age,
      weight,
      behavior: behavior as any,
      notes: notes || '',
    },
    createdAt: new Date().toLocaleDateString("es-ES", { day: 'numeric', month: 'short', year: 'numeric' }),
    summary: `Plan adaptado especialmente para ${name} (${breed}), optimizado para un nivel conductual ${behavior} con foco en salud física y equilibrio mental.`,
    dailyExercise: exercise,
    weeklyTrick: trick,
    nutritionGuide: {
      dailyCalories,
      gramsPerDay,
      mealsCount: age < 1 ? 3 : 2,
      recommendations,
      foodTypes: "Alimento súper premium balanceado con alta biodisponibilidad."
    },
    ethologyNotes: ethology,
    weeklySchedule: generateDefaultSchedule(name, behavior)
  };
}

startServer();
