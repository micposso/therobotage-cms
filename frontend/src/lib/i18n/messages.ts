import savedSpanish from './ui-es.json'
import type { Locale } from './routing'
const spanish: Record<string, string> = {
  RESEARCH: 'INVESTIGACIÓN', ROBOTS: 'ROBOTS', 'RXD FRAMEWORK': 'MARCO RXD', LEARN: 'APRENDER', JOBS: 'EMPLEOS', ENTERPRISE: 'EMPRESAS',
  Research: 'Investigación', Robots: 'Robots', Learn: 'Aprender', Jobs: 'Empleos', Enterprise: 'Empresas',
  'Robot Literacy': 'Alfabetización robótica', 'Live Robot Lab': 'Laboratorio de robots', 'Courses & Certifications': 'Cursos y certificaciones',
  'Sign in': 'Iniciar sesión', Search: 'Buscar', 'Search…': 'Buscar…', 'Open search': 'Abrir búsqueda', 'Close search': 'Cerrar búsqueda', 'Open menu': 'Abrir menú', 'Close menu': 'Cerrar menú',
  'Back to News': 'Volver a las noticias', Related: 'Contenido relacionado', 'Read in English': 'Leer en inglés', 'AI-translated from English': 'Traducido del inglés con IA',
  'Preparing people and organizations for a world with robots.': 'Preparamos a personas y organizaciones para un mundo con robots.',
  Pages: 'Páginas', Certifications: 'Certificaciones', Follow: 'Síguenos', 'All rights reserved.': 'Todos los derechos reservados.',
  'Privacy Policy': 'Política de privacidad', 'Terms of Use': 'Términos de uso', 'Fair use of AI': 'Uso responsable de la IA',
  'What Robot Are You?': '¿Qué robot eres?', 'RXD Scorecard': 'Evaluación RXD', Access: 'Acceso', Connect: 'Contacto', Summit: 'Encuentro',
  'Robotics Experience Practitioner': 'Profesional de experiencia robótica', 'Robot Experience Designer': 'Diseñador de experiencia robótica',
  'Cookie preferences': 'Preferencias de cookies',
  'We use cookies to understand how visitors use The Robot Age and to improve your experience.': 'Usamos cookies para entender cómo se utiliza The Robot Age y mejorar tu experiencia.',
  'Manage preferences': 'Gestionar preferencias', 'Reject non-essential': 'Rechazar las no esenciales', 'Accept all': 'Aceptar todas',
  Necessary: 'Necesarias', 'Session management and security. Always active.': 'Gestión de sesión y seguridad. Siempre activas.',
  Analytics: 'Análisis', 'Helps us understand which pages are most useful. No personal data is sold.': 'Nos ayuda a entender qué páginas son más útiles. No vendemos datos personales.',
  'Toggle analytics cookies': 'Activar o desactivar cookies de análisis', 'Toggle marketing cookies': 'Activar o desactivar cookies de marketing',
  'Used to measure the effectiveness of outreach and promotions.': 'Permiten medir la eficacia de nuestras campañas y promociones.', 'Save preferences': 'Guardar preferencias',
}
export function uiText(text: string, locale: Locale): string { if (locale === 'en') return text; const key = text.trim(); const translated = spanish[key] || (savedSpanish as Record<string, string>)[key]; return translated ? text.replace(key, translated) : text }
