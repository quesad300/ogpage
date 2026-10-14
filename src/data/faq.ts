/**
 * Inventario FAQ — fuente única de verdad para el texto visible (Faq.astro)
 * y el nodo FAQPage del JSON-LD (MainLayout.astro).
 *
 * Auditoría de contenido: cada oración de cada respuesta es trazable 1:1 a un
 * dato de Agents.md. Prohibido: precios, nombres de clientes, cifras,
 * porcentajes, tiempos de respuesta ni testimonios.
 */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: readonly FaqItem[] = [
  {
    id: "que-hace-ogdevsecops",
    question: "¿Qué tipo de software desarrolla OGDevSecOps?",
    answer:
      "Sistemas administrativos, ERP y CRM a medida con Laravel y MySQL, incluyendo roles con Spatie. También APIs REST y plataformas GPS con Traccar.",
  },
  {
    id: "tecnologias",
    question: "¿Qué tecnologías utilizan?",
    answer:
      "Backend con Laravel, PHP y MySQL. Frontend con JavaScript y React. Apps móviles con Flutter, React Native e Ionic. Servidores en Linux con Docker.",
  },
  {
    id: "plataformas-gps-traccar",
    question: "¿Qué incluye el servicio de plataformas GPS con Traccar?",
    answer:
      "Instalación, personalización del backend en Java y de la interfaz en JavaScript, además de actualizaciones y respaldos.",
  },
  {
    id: "moodle",
    question: "¿Trabajan con Moodle?",
    answer:
      "Sí. Temas personalizados para Moodle 5 en web y app móvil con Ionic. También trabajamos con WordPress.",
  },
  {
    id: "modalidad-de-trabajo",
    question: "¿Cómo es la modalidad de trabajo?",
    answer:
      "Trabajamos en remoto desde Villaflores, Chiapas, México, y estamos disponibles para reubicación en México y el extranjero.",
  },
  {
    id: "infraestructura-despliegue",
    question: "¿Cómo despliegan y monitorean el software?",
    answer:
      "Infraestructura con Docker Swarm y despliegue continuo con GitHub Actions y GHCR. Administración con Portainer y monitoreo con Grafana y Prometheus.",
  },
  {
    id: "contacto",
    question: "¿Cómo puedo contactarlos?",
    answer:
      "Escríbenos a joseoswaldogperez@gmail.com o por WhatsApp. También estamos en LinkedIn, GitHub y YouTube.",
  },
];
