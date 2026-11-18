import type { Localized, Project } from '../types';

const dir = '/projects/agentic-crm';
const img = (n: number, alt: Localized) => ({
  src: `${dir}/feature-${n}-1600.webp`,
  alt,
  width: 1600,
  height: 900,
});
const gal = (n: number, alt: Localized) => ({
  src: `${dir}/gallery-${n}-1200.webp`,
  alt,
  width: 1200,
  height: 750,
});

export const project: Project = {
  slug: 'agentic-crm',
  access: 'on-demand',
  order: 1, // first in the On-demand group; supply-chain is 2, e-commerce is 3
  category: 'python',
  status: 'live',
  year: 2026,
  repoUrl: null,
  tests: 600,
  stack: ['Python', 'FastAPI', 'LangGraph', 'React', 'TypeScript', 'SQLite'],
  languages: ['en', 'es'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: {
      en: 'Multi-Agent CRM dashboard with pipeline value, forecast and recent activity',
      es: 'Panel de Multi-Agent CRM con valor del pipeline, forecast y actividad reciente',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'Multi-Agent CRM dashboard on laptop, tablet and phone',
      es: 'Panel de Multi-Agent CRM en portátil, tablet y móvil',
    },
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: null,
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: {
        en: 'Watch the Multi-Agent CRM film',
        es: 'Ver la película de Multi-Agent CRM',
      },
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  loop: {
    webm: `${dir}/loop.webm`,
    mp4: `${dir}/loop.mp4`,
    poster: {
      src: `${dir}/loop-poster.webp`,
      alt: {
        en: 'Change proposals passing a policy gate: some apply, others wait for approval',
        es: 'Propuestas de cambio pasando una puerta de reglas: unas se aplican, otras esperan aprobación',
      },
      width: 1280,
      height: 720,
    },
  },
  gallery: [
    gal(1, {
      en: 'A deal record with its fields and a timeline of calls, meetings and emails, in the light theme',
      es: 'La ficha de un trato con sus campos y una línea de tiempo de llamadas, reuniones y emails, en el tema claro',
    }),
    gal(2, {
      en: 'An account with its contacts, deals and activity timeline, in the dark theme',
      es: 'Una cuenta con sus contactos, tratos y línea de tiempo de actividad, en el tema oscuro',
    }),
    gal(3, {
      en: 'The leads list with the New lead dialog open, in the light theme',
      es: 'La lista de leads con el diálogo de nuevo lead abierto, en el tema claro',
    }),
    gal(4, {
      en: 'The dashboard and the deals board side by side on a phone, in the dark theme',
      es: 'El panel y el tablero de tratos lado a lado en un móvil, en el tema oscuro',
    }),
  ],
  copy: {
    en: {
      title: 'Multi-Agent CRM',
      tagline:
        'A sales CRM where AI agents do the busywork. Every change is a proposal, and the big ones wait for your approval.',
      cardBlurb:
        'AI agents log meetings, draft follow-ups and flag risk. Plain rules decide what changes; you approve the big ones.',
      hook: { line: 'An AI edited your pipeline.', accent: 'Who changed this?', tone: 'danger' },
      problem:
        'Your best reps close deals, then spend the evening feeding the CRM: logging calls, updating deals, writing follow-ups, fixing duplicates. Hand that to a generic AI and it marks a deal won that isn\'t, or emails a promise nobody made.',
      solution:
        'A multi-agent system: a Supervisor leads a team of specialist AI agents, one for every sales job. Agents never edit your CRM directly. Every change is a proposal, plain rules decide which ones apply, the big ones wait in your Approvals Inbox, and everything joins a tamper-evident Audit Chain.',
      howItWorks: [
        {
          title: 'Drop in your notes',
          text: 'Meeting notes or an email go in, and the Supervisor routes the work to the right team of agents.',
        },
        {
          title: 'Guardrails first',
          text: 'Every note and email is screened before any agent reads it. Hidden instructions are treated as data, never obeyed.',
        },
        {
          title: 'Specialists do the work',
          text: 'The Meeting Analyst logs the meeting and its tasks; the Deal Strategist weighs the risk and suggests next steps.',
        },
        {
          title: 'Reviewed before it\'s proposed',
          text: 'The Email Composer drafts the follow-up; the Compliance Reviewer checks every claim against the CRM and sends it back until it\'s right.',
        },
        {
          title: 'Rules decide, you approve',
          text: 'Small updates apply on their own. Closing a deal, a large amount change or any outbound email waits for you: approve, edit or reject.',
        },
        {
          title: 'Always on record',
          text: 'Every change joins the Audit Chain, and the Prompt Registry versions each agent\'s instructions; a new version goes live only once it proves better.',
        },
      ],
      features: [
        {
          title: 'Your whole pipeline,',
          titleAccent: 'at a glance.',
          tone: 'accent',
          text: 'Pipeline value, weighted forecast, deals at risk and the latest activity on one screen. The agents\' logged work keeps it current, so your Monday review starts from facts.',
          image: img(1, {
            en: 'Sales dashboard with pipeline value, weighted forecast, deals at risk and recent activity',
            es: 'Panel de ventas con valor del pipeline, forecast ponderado, tratos en riesgo y actividad reciente',
          }),
        },
        {
          title: 'A team of AI agents.',
          titleAccent: 'One Supervisor.',
          tone: 'model',
          text: 'The Supervisor routes each job to the right specialist: Lead Qualifier, Account Researcher, Deal Strategist, Meeting Analyst, Email Composer, Compliance Reviewer, Data Steward and Forecast Analyst. Each one does one sales job well.',
          image: img(2, {
            en: 'Illustration of a Supervisor agent connected to its team of specialist agents',
            es: 'Ilustración de un agente Supervisor conectado a su equipo de agentes especialistas',
          }),
        },
        {
          title: 'Agents propose.',
          titleAccent: 'Rules decide.',
          tone: 'accent',
          text: 'Agents never edit your CRM directly: every change arrives as a proposal. Plain rules, not the AI, decide which ones apply and which ones wait for you.',
          image: img(3, {
            en: 'Illustration of change proposals passing a policy gate that applies some and holds others',
            es: 'Ilustración de propuestas de cambio pasando una puerta de reglas que aplica unas y retiene otras',
          }),
        },
        {
          title: 'Big changes wait',
          titleAccent: 'for you.',
          tone: 'human',
          text: 'Closing a deal, a large amount change or any outbound email lands in your Approvals Inbox. You see exactly what changes and why, then approve, edit or reject.',
          image: img(4, {
            en: 'Illustration of an approvals inbox showing an amount change and the reason it needs a human decision',
            es: 'Ilustración de una bandeja de aprobaciones con un cambio de importe y el motivo por el que necesita una decisión humana',
          }),
        },
        {
          title: 'Who changed this?',
          titleAccent: 'Now you know.',
          tone: 'accent',
          text: 'Every change, decision and approval joins a tamper-evident Audit Chain. Any edit to the record is detected, so you can always show who changed what, and why.',
          image: img(5, {
            en: 'Illustration of a tamper-evident audit chain linking each logged change in order',
            es: 'Ilustración de una cadena de auditoría a prueba de manipulaciones que enlaza en orden cada cambio registrado',
          }),
        },
        {
          title: 'Every deal,',
          titleAccent: 'on one board.',
          tone: 'accent',
          text: 'Drag deals between stages, spot the ones that have gone quiet, and switch to a table when you need to sort and filter. Every move the agents propose lands here once it\'s approved.',
          image: img(6, {
            en: 'Deals board with one column per pipeline stage and deal cards flagged when quiet',
            es: 'Tablero de tratos con una columna por etapa del pipeline y tarjetas marcadas cuando llevan tiempo sin actividad',
          }),
        },
      ],
      galleryHeadline: { title: 'Your pipeline. Your rules.', accent: 'Your brand.' },
      cta: {
        headline: 'Want this working for your sales team?',
        text: 'Private project. I adapt it to your pipeline stages, your approval rules and your brand, validate it on your own anonymized deals before go-live, and connect it to your systems. Tell me about your team.',
      },
    },
    es: {
      title: 'Multi-Agent CRM',
      tagline:
        'Un CRM de ventas donde agentes de IA hacen el trabajo pesado. Cada cambio es una propuesta y los importantes esperan tu aprobación.',
      cardBlurb:
        'Agentes de IA registran reuniones, redactan seguimientos y detectan riesgos. Las reglas deciden; tú apruebas lo grande.',
      hook: { line: 'Una IA editó tu pipeline.', accent: '¿Quién cambió esto?', tone: 'danger' },
      problem:
        'Tus mejores vendedores cierran tratos y luego pasan la tarde alimentando el CRM: registrar llamadas, actualizar tratos, escribir seguimientos, limpiar duplicados. Si se lo das a una IA genérica, marca como ganado un trato que no lo está o envía una promesa que nadie hizo.',
      solution:
        'Un sistema multiagente: un Supervisor dirige un equipo de agentes de IA especializados, uno para cada tarea de ventas. Los agentes nunca editan tu CRM directamente. Cada cambio es una propuesta, reglas claras deciden cuáles se aplican, las importantes esperan en tu Approvals Inbox y todo queda en una Audit Chain a prueba de manipulaciones.',
      howItWorks: [
        {
          title: 'Suelta tus notas',
          text: 'Entran las notas de una reunión o un email, y el Supervisor reparte el trabajo al equipo de agentes adecuado.',
        },
        {
          title: 'Guardrails primero',
          text: 'Cada nota y cada email se revisan antes de que un agente los lea. Las instrucciones ocultas se tratan como datos, nunca se obedecen.',
        },
        {
          title: 'Los especialistas trabajan',
          text: 'El Meeting Analyst registra la reunión y sus tareas; el Deal Strategist evalúa el riesgo y sugiere los siguientes pasos.',
        },
        {
          title: 'Revisado antes de proponerse',
          text: 'El Email Composer redacta el seguimiento; el Compliance Reviewer contrasta cada afirmación con el CRM y lo devuelve hasta que está bien.',
        },
        {
          title: 'Las reglas deciden, tú apruebas',
          text: 'Los cambios pequeños se aplican solos. Cerrar un trato, un cambio grande de importe o cualquier email saliente te esperan: apruebas, editas o rechazas.',
        },
        {
          title: 'Siempre registrado',
          text: 'Cada cambio entra en la Audit Chain, y el Prompt Registry versiona las instrucciones de cada agente; una versión nueva solo entra en producción cuando demuestra ser mejor.',
        },
      ],
      features: [
        {
          title: 'Todo tu pipeline,',
          titleAccent: 'de un vistazo.',
          tone: 'accent',
          text: 'Valor del pipeline, forecast ponderado, tratos en riesgo y la actividad más reciente en una sola pantalla. El trabajo que registran los agentes lo mantiene al día, así que tu revisión del lunes parte de hechos.',
          image: img(1, {
            en: 'Sales dashboard with pipeline value, weighted forecast, deals at risk and recent activity',
            es: 'Panel de ventas con valor del pipeline, forecast ponderado, tratos en riesgo y actividad reciente',
          }),
        },
        {
          title: 'Un equipo de agentes de IA.',
          titleAccent: 'Un Supervisor.',
          tone: 'model',
          text: 'El Supervisor envía cada tarea al especialista adecuado: Lead Qualifier, Account Researcher, Deal Strategist, Meeting Analyst, Email Composer, Compliance Reviewer, Data Steward y Forecast Analyst. Cada uno hace bien una tarea de ventas.',
          image: img(2, {
            en: 'Illustration of a Supervisor agent connected to its team of specialist agents',
            es: 'Ilustración de un agente Supervisor conectado a su equipo de agentes especialistas',
          }),
        },
        {
          title: 'Los agentes proponen.',
          titleAccent: 'Las reglas deciden.',
          tone: 'accent',
          text: 'Los agentes nunca editan tu CRM directamente: cada cambio llega como una propuesta. Reglas claras, no la IA, deciden cuáles se aplican y cuáles te esperan.',
          image: img(3, {
            en: 'Illustration of change proposals passing a policy gate that applies some and holds others',
            es: 'Ilustración de propuestas de cambio pasando una puerta de reglas que aplica unas y retiene otras',
          }),
        },
        {
          title: 'Los cambios grandes',
          titleAccent: 'te esperan.',
          tone: 'human',
          text: 'Cerrar un trato, un cambio grande de importe o cualquier email saliente llega a tu Approvals Inbox. Ves exactamente qué cambia y por qué, y apruebas, editas o rechazas.',
          image: img(4, {
            en: 'Illustration of an approvals inbox showing an amount change and the reason it needs a human decision',
            es: 'Ilustración de una bandeja de aprobaciones con un cambio de importe y el motivo por el que necesita una decisión humana',
          }),
        },
        {
          title: '¿Quién cambió esto?',
          titleAccent: 'Ahora lo sabes.',
          tone: 'accent',
          text: 'Cada cambio, decisión y aprobación entra en una Audit Chain a prueba de manipulaciones. Cualquier edición del registro se detecta, así que siempre puedes mostrar quién cambió qué y por qué.',
          image: img(5, {
            en: 'Illustration of a tamper-evident audit chain linking each logged change in order',
            es: 'Ilustración de una cadena de auditoría a prueba de manipulaciones que enlaza en orden cada cambio registrado',
          }),
        },
        {
          title: 'Cada trato,',
          titleAccent: 'en un tablero.',
          tone: 'accent',
          text: 'Arrastra tratos entre etapas, detecta los que se han quedado parados y cambia a tabla cuando necesites ordenar y filtrar. Cada movimiento que proponen los agentes llega aquí una vez aprobado.',
          image: img(6, {
            en: 'Deals board with one column per pipeline stage and deal cards flagged when quiet',
            es: 'Tablero de tratos con una columna por etapa del pipeline y tarjetas marcadas cuando llevan tiempo sin actividad',
          }),
        },
      ],
      galleryHeadline: { title: 'Tu pipeline. Tus reglas.', accent: 'Tu marca.' },
      cta: {
        headline: '¿Lo pongo a funcionar para tu equipo de ventas?',
        text: 'Proyecto privado. Lo adapto a las etapas de tu pipeline, tus reglas de aprobación y tu marca, lo valido con tus propios tratos anonimizados antes del lanzamiento y lo conecto a tus sistemas. Cuéntame cómo trabaja tu equipo.',
      },
    },
  },
};
