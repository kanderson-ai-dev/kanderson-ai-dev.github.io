import type { Localized, Project } from '../types';

const dir = '/projects/supply-chain-compliance-copilot-py';
const img = (n: number, alt: string) => ({
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
  slug: 'supply-chain-compliance-copilot-py',
  access: 'on-demand',
  order: 1,
  category: 'python',
  status: 'live',
  year: 2026,
  repoUrl: null,
  tests: 705,
  stack: ['Python', 'FastAPI', 'LangGraph', 'React', 'SQLite', 'Docker'],
  languages: ['en', 'es'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: {
      en: 'New audit case form in Supply Chain Compliance Co-Pilot',
      es: 'Formulario de nuevo caso de auditoría en Supply Chain Compliance Co-Pilot',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'New audit case form in Supply Chain Compliance Co-Pilot on laptop, tablet and phone',
      es: 'Formulario de nuevo caso de auditoría en Supply Chain Compliance Co-Pilot en portátil, tablet y móvil',
    },
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: 'ecESpjB2e54',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: {
        en: 'Watch the Supply Chain Compliance Co-Pilot film',
        es: 'Ver la película de Supply Chain Compliance Co-Pilot',
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
        en: 'A finding card linked to the exact sentence it quotes in the audit',
        es: 'Una tarjeta de hallazgo enlazada a la frase exacta que cita en la auditoría',
      },
      width: 1280,
      height: 720,
    },
  },
  gallery: [
    gal(1, {
      en: 'The case event log — every decision on record, from case creation to the finished report',
      es: 'El registro de eventos del caso — cada decisión registrada, desde la creación del caso hasta el informe final',
    }),
    gal(2, {
      en: 'The corrective-action table — every CAPA tied to its finding, owner, required evidence and status',
      es: 'La tabla de acciones correctivas — cada CAPA ligada a su hallazgo, responsable, evidencia requerida y estado',
    }),
    gal(3, {
      en: 'The prompt registry listing one promoted version per worker, with lifecycle stages and a verified audit chain — no prompt text',
      es: 'El registro de prompts listando una versión promovida por trabajador, con etapas de ciclo de vida y una cadena de auditoría verificada — sin texto de prompt',
    }),
    gal(4, {
      en: 'The stakeholder report on a phone — risk breakdown and non-conformities readable at the smallest size',
      es: 'El informe para stakeholders en un teléfono — desglose de riesgo y no conformidades legibles en el tamaño más pequeño',
    }),
  ],
  copy: {
    en: {
      title: 'Supply Chain Compliance Co-Pilot',
      tagline:
        'AI agents that review supplier audits and prove every finding. Corrective actions wait for your team\'s approval.',
      cardBlurb:
        'Every finding quoted from the audit, the same risk score on every run and human-approved corrective actions.',
      hook: { line: 'A generic AI summary says', accent: 'everything\'s fine.', tone: 'danger' },
      problem:
        'You\'re responsible for hundreds of suppliers you\'ll never visit. Each audit hides the lines that matter, and an AI summary that misses them — or invents them — is worse than none.',
      solution:
        'One coordinator routes each audit to five specialist agents. Every finding must quote the audit word for word or it is thrown out. Risk is scored by fixed rules. Corrective actions wait for your team before anything reaches the supplier.',
      howItWorks: [
        {
          title: 'Upload the audit',
          text: 'A SMETA-style audit is submitted and screened for hidden instructions.',
        },
        {
          title: 'Map and score',
          text: 'The supplier is mapped — country, sector, tier — and risk is scored by fixed rules.',
        },
        {
          title: 'Review in parallel',
          text: 'The compliance analyst reviews labour, health & safety, environment and business ethics at the same time.',
        },
        {
          title: 'Prove every finding',
          text: 'Each finding quotes the exact sentence in the audit. Unprovable ones are removed.',
        },
        {
          title: 'Approve the fixes',
          text: 'Drafted corrective actions wait for your team: approve, edit or reject.',
        },
        {
          title: 'Share the report',
          text: 'A stakeholder-ready report with findings, evidence and actions — every decision on record.',
        },
      ],
      features: [
        {
          title: 'Every finding —',
          titleAccent: 'proven by the audit.',
          tone: 'accent',
          text: 'Every non-conformance quotes the exact sentence of the uploaded audit, checked word for word. If the quote can\'t be found, the finding is removed and counted.',
          image: img(1, 'Findings table where every non-conformance cites its verbatim quote from the audit'),
        },
        {
          title: 'Five specialist agents,',
          titleAccent: 'one coordinator.',
          tone: 'model',
          text: 'The coordinator hands each audit to five specialist agents — Mapper, Risk Scorer, Compliance Analyst, CAPA Writer and Report Writer. The four audit areas are reviewed at the same time.',
          image: img(2, 'Worker lanes showing the five specialist agents of a completed audit run'),
        },
        {
          title: 'Same audit,',
          titleAccent: 'same risk score.',
          tone: 'accent',
          text: 'Risk comes from country, sector and supplier tier — scored by fixed rules, never judged by the model. The same audit always gets the same score.',
          image: img(3, 'Risk breakdown panel scoring country, sector and tier uplift'),
        },
        {
          title: 'Nothing reaches the supplier',
          titleAccent: 'until you approve.',
          tone: 'human',
          text: 'Drafted corrective actions pause for your compliance team to approve, edit or reject. The pause survives restarts, and nothing moves on without a person.',
          image: img(4, 'CAPA review modal with a drafted corrective action waiting for a human decision'),
        },
        {
          title: 'A report',
          titleAccent: 'ready to share.',
          tone: 'accent',
          text: 'Findings, quoted evidence and approved corrective actions in one report for buyers, auditors and the board. Export it and send it.',
          image: img(5, 'Stakeholder report with risk breakdown and the non-conformity table'),
        },
        {
          title: 'Tampered documents',
          titleAccent: 'get flagged.',
          tone: 'danger',
          text: 'Documents carrying hidden instructions are blocked before any analysis runs. Every decision lands in a tamper-evident trail you can re-verify.',
          image: img(6, 'Intake form rejecting an audit document flagged by the input guardrail'),
        },
      ],
      results: [
        {
          label: 'Hidden-instruction documents blocked',
          value: '100%',
          note: '3 of 3 tampered audits stopped before analysis',
          kind: 'measured',
        },
        {
          label: 'Corrective actions tied to a real finding',
          value: '100%',
          note: '26 of 26',
          kind: 'measured',
        },
        {
          label: 'Drafted findings that pass the quote check',
          value: '96%',
          note: 'the rest are removed before you see them',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Invented quotes in the report',
        pipeline: '0%',
        baseline: '10.4%',
        note: 'This system vs a single AI prompt · 6 fictional audits',
      },
      galleryHeadline: { title: 'Your framework. Your rules.', accent: 'Your systems.' },
      cta: {
        headline: 'Want this working in your compliance workflow?',
        text: 'Private project. I adapt it to your audit format, your risk model and your review gate, validate it on your own anonymized audits before go-live, and connect it to your systems. Tell me about your setup.',
      },
    },
    es: {
      title: 'Supply Chain Compliance Co-Pilot',
      tagline:
        'Agentes de IA que revisan auditorías de proveedores y prueban cada hallazgo. Las acciones correctivas esperan la aprobación de tu equipo.',
      cardBlurb:
        'Cada hallazgo citado de la auditoría, la misma puntuación en cada corrida y acciones correctivas aprobadas por humanos.',
      hook: { line: 'Un resumen genérico de IA dice', accent: 'que todo está bien.', tone: 'danger' },
      problem:
        'Eres responsable de cientos de proveedores que nunca visitarás. Cada auditoría esconde las líneas que importan, y un resumen de IA que se las salta — o se las inventa — es peor que ninguno.',
      solution:
        'Un coordinador reparte cada auditoría entre cinco agentes especialistas. Cada hallazgo debe citar la auditoría palabra por palabra o se descarta. El riesgo se puntúa con reglas fijas. Las acciones correctivas esperan a tu equipo antes de que nada llegue al proveedor.',
      howItWorks: [
        {
          title: 'Sube la auditoría',
          text: 'Se envía una auditoría estilo SMETA y se filtra en busca de instrucciones ocultas.',
        },
        {
          title: 'Mapear y puntuar',
          text: 'El proveedor se mapea — país, sector, tier — y el riesgo se puntúa con reglas fijas.',
        },
        {
          title: 'Revisar en paralelo',
          text: 'El analista de compliance revisa laboral, salud y seguridad, medio ambiente y ética empresarial a la vez.',
        },
        {
          title: 'Probar cada hallazgo',
          text: 'Cada hallazgo cita la frase exacta de la auditoría. Los que no se pueden probar se descartan.',
        },
        {
          title: 'Aprobar las correcciones',
          text: 'Las acciones correctivas redactadas esperan a tu equipo: aprobar, editar o rechazar.',
        },
        {
          title: 'Compartir el informe',
          text: 'Un informe listo para stakeholders con hallazgos, evidencia y acciones — cada decisión registrada.',
        },
      ],
      features: [
        {
          title: 'Cada hallazgo —',
          titleAccent: 'probado por la auditoría.',
          tone: 'accent',
          text: 'Cada no conformidad cita la frase exacta de la auditoría subida, comprobada palabra por palabra. Si la cita no se encuentra, el hallazgo se descarta y se contabiliza.',
          image: img(1, 'Tabla de hallazgos donde cada no conformidad cita su cita literal de la auditoría'),
        },
        {
          title: 'Cinco agentes especialistas,',
          titleAccent: 'un coordinador.',
          tone: 'model',
          text: 'El coordinador reparte cada auditoría entre cinco agentes especialistas — Mapper, Risk Scorer, Compliance Analyst, CAPA Writer y Report Writer. Las cuatro áreas de la auditoría se revisan a la vez.',
          image: img(2, 'Carriles de trabajadores mostrando los cinco agentes especialistas de una corrida de auditoría completada'),
        },
        {
          title: 'Misma auditoría,',
          titleAccent: 'misma puntuación de riesgo.',
          tone: 'accent',
          text: 'El riesgo viene del país, el sector y el tier del proveedor — puntuado con reglas fijas, nunca juzgado por el modelo. La misma auditoría siempre obtiene la misma puntuación.',
          image: img(3, 'Panel de desglose de riesgo puntuando país, sector y uplift de tier'),
        },
        {
          title: 'Nada llega al proveedor',
          titleAccent: 'hasta que tú apruebas.',
          tone: 'human',
          text: 'Las acciones correctivas redactadas pausan para que tu equipo de compliance las apruebe, edite o rechace. La pausa sobrevive a reinicios y nada avanza sin una persona.',
          image: img(4, 'Modal de revisión de CAPAs con una acción correctiva redactada esperando una decisión humana'),
        },
        {
          title: 'Un informe',
          titleAccent: 'listo para compartir.',
          tone: 'accent',
          text: 'Hallazgos, evidencia citada y acciones correctivas aprobadas en un informe para compradores, auditores y la dirección. Expórtalo y envíalo.',
          image: img(5, 'Informe para stakeholders con desglose de riesgo y tabla de no conformidades'),
        },
        {
          title: 'Los documentos manipulados',
          titleAccent: 'se marcan.',
          tone: 'danger',
          text: 'Los documentos con instrucciones ocultas se bloquean antes de cualquier análisis. Cada decisión cae en una traza a prueba de manipulación que puedes reverificar.',
          image: img(6, 'Formulario de admisión rechazando un documento de auditoría marcado por el guardrail de entrada'),
        },
      ],
      results: [
        {
          label: 'Documentos con instrucciones ocultas bloqueados',
          value: '100%',
          note: '3 de 3 auditorías manipuladas detenidas antes del análisis',
          kind: 'measured',
        },
        {
          label: 'Acciones correctivas ligadas a un hallazgo real',
          value: '100%',
          note: '26 de 26',
          kind: 'measured',
        },
        {
          label: 'Hallazgos que superan la verificación de cita',
          value: '96%',
          note: 'el resto se elimina antes de que los veas',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Citas inventadas en el informe',
        pipeline: '0%',
        baseline: '10.4%',
        note: 'Este sistema frente a un único prompt de IA · 6 auditorías ficticias',
      },
      galleryHeadline: { title: 'Tu marco. Tus reglas.', accent: 'Tus sistemas.' },
      cta: {
        headline: '¿Lo pongo a funcionar en tu flujo de compliance?',
        text: 'Proyecto privado. Lo adapto a tu formato de auditoría, tu modelo de riesgo y tu puerta de revisión, lo valido con tus propias auditorías anonimizadas antes del lanzamiento y lo conecto a tus sistemas. Cuéntame tu setup.',
      },
    },
  },
};
