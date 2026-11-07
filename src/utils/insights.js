const strengths = {
  ARIES: 'Iniciativa para empezar, energía para avanzar y sinceridad para decir lo que necesitás.',
  TAURO: 'Constancia, paciencia y una presencia confiable que ayuda a sostener lo importante.',
  GEMINIS: 'Curiosidad, ingenio y facilidad para conectar ideas y personas.',
  CANCER: 'Intuición, empatía y capacidad para cuidar los vínculos cercanos.',
  LEO: 'Creatividad, calidez y confianza para entusiasmar a quienes te rodean.',
  VIRGO: 'Observación, criterio práctico y atención para mejorar lo que tocás.',
  LIBRA: 'Diplomacia, sensibilidad estética y capacidad para buscar acuerdos.',
  ESCORPIO: 'Profundidad, percepción y compromiso con lo que realmente te importa.',
  SAGITARIO: 'Entusiasmo, visión amplia y ganas de aprender de cada experiencia.',
  CAPRICORNIO: 'Responsabilidad, perseverancia y capacidad para convertir planes en logros.',
  ACUARIO: 'Originalidad, independencia y una mirada abierta para imaginar alternativas.',
  PISCIS: 'Sensibilidad, imaginación y una escucha intuitiva de lo que pasa alrededor.'
};
const fears = {
  ARIES: 'La impaciencia puede llevarte a responder antes de escuchar o evaluar todas las posibilidades.',
  TAURO: 'Los cambios inesperados pueden incomodarte y hacerte aferrarte más de la cuenta a lo conocido.',
  GEMINIS: 'La dispersión puede dejar muchas puertas abiertas y dificultar elegir dónde poner tu energía.',
  CANCER: 'La susceptibilidad puede hacerte tomar distancia cuando en realidad necesitás expresar lo que sentís.',
  LEO: 'La falta de reconocimiento puede tocar tu seguridad y hacerte esconder una vulnerabilidad legítima.',
  VIRGO: 'La autoexigencia puede convertir un detalle pendiente en una medida injusta de tu propio valor.',
  LIBRA: 'El deseo de evitar conflictos puede postergar decisiones y dejar tus necesidades en segundo plano.',
  ESCORPIO: 'La desconfianza puede llevarte a protegerte demasiado y dificultar que otros se acerquen.',
  SAGITARIO: 'Sentirte limitado puede impulsarte a escapar antes de descubrir qué necesita realmente la situación.',
  CAPRICORNIO: 'La exigencia de poder con todo puede hacerte olvidar que también está bien pedir apoyo.',
  ACUARIO: 'Sentirte condicionado puede llevarte a tomar distancia justo cuando un vínculo necesita presencia.',
  PISCIS: 'La sensibilidad al ambiente puede confundirte si absorbés emociones ajenas sin poner límites claros.'
};
const evolution = {
  ARIES: 'Tu crecimiento aparece cuando sumás pausa a la iniciativa y convertís el impulso en dirección.',
  TAURO: 'Tu evolución se abre cuando cuidás tu estabilidad sin cerrarte a los cambios que pueden renovarte.',
  GEMINIS: 'Tu camino se fortalece cuando elegís profundizar, sosteniendo una conversación, proyecto o vínculo.',
  CANCER: 'Tu mundo interior gana libertad cuando cuidás a otros sin dejar tus propias necesidades afuera.',
  LEO: 'Tu confianza se vuelve más genuina cuando compartís el protagonismo y reconocés tu valor sin aplausos.',
  VIRGO: 'Tu aprendizaje invita a aceptar lo suficiente, valorar tus avances y dejar espacio para lo espontáneo.',
  LIBRA: 'Tu equilibrio se afirma cuando buscás acuerdos sin perder una voz propia, clara y amable.',
  ESCORPIO: 'Tu transformación se vuelve más liviana cuando confiás de a poco y soltás el control innecesario.',
  SAGITARIO: 'Tu expansión se profundiza cuando la libertad también incluye compromiso, presencia y cuidado.',
  CAPRICORNIO: 'Tu camino se suaviza cuando permitís disfrute y descanso junto a la responsabilidad.',
  ACUARIO: 'Tu originalidad encuentra sentido cuando se conecta con personas concretas y acciones compartidas.',
  PISCIS: 'Tu sensibilidad se ordena cuando combinás intuición con límites, claridad y momentos de anclaje.'
};
export function getCombinationInsights({ sol, luna, ascendente }) {
  return {
    strengths: [`Tu impulso: ${strengths[sol]}`, `Tu mundo emocional: ${strengths[luna]}`, `Tu presencia: ${strengths[ascendente]}`],
    fears: [`Al iniciar: ${fears[sol]}`, `Al sentir: ${fears[luna]}`, `Al vincularte: ${fears[ascendente]}`],
    evolution: [`En tu identidad: ${evolution[sol]}`, `En tu mundo interior: ${evolution[luna]}`, `En tu manera de avanzar: ${evolution[ascendente]}`]
  };
}
