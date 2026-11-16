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
      en: 'Supply Chain Compliance Co-Pilot preview',
      es: 'Vista previa de Supply Chain Compliance Co-Pilot',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'Supply Chain Compliance Co-Pilot operator console on a laptop with the stakeholder report on a tablet and the case view on a phone',
      es: 'Consola de operador de Supply Chain Compliance Co-Pilot en un portátil con el informe para stakeholders en una tablet y la vista de caso en un teléfono',
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
  architecture: {
    src: `${dir}/architecture.webp`,
    width: 1920,
    height: 1080,
    alt: {
      en: 'Simplified architecture of Supply Chain Compliance Co-Pilot: audit upload, injection screen, a supervisor routing five specialist workers, a four-area parallel compliance review with deterministic merge and quote verification, a human CAPA review gate, checkpointing and audit trail, and a prompt registry feeding every model step',
      es: 'Arquitectura simplificada de Supply Chain Compliance Co-Pilot: subida de la auditoría, filtro de inyección, un supervisor enrutando cinco trabajadores especialistas, revisión de compliance en cuatro áreas en paralelo con fusión determinista y verificación de citas, puerta de revisión humana de CAPAs, checkpointing y traza de auditoría, y un registro de prompts alimentando cada paso de modelo',
    },
    description: {
      en: 'An operator uploads the audit document, which passes an injection screen that treats the file as data, never orders; tampered documents are rejected before any worker runs. Safe audits reach the supervisor — a model router that dispatches specialist workers one step at a time: a supplier mapper, a risk scorer whose score is computed in code, a compliance analyst, a CAPA writer and a report writer, each returning to the supervisor. The compliance analyst reviews four audit areas at once — labour standards, health & safety, environment and business ethics — and their results merge deterministically; a quote verifier removes any finding whose evidence quote cannot be found verbatim in the uploaded audit. Drafted corrective actions pause at a human review gate — approve, edit or reject — and sealed actions resume to the report writer, which produces the stakeholder report. The supervisor state is checkpointed so a pause survives restarts, cases and events are persisted, and every decision lands in a hash-chained audit trail that can be re-verified. Each model step resolves its prompt from a prompt registry holding exactly one promoted version per worker; new versions are authored in the console, pass an A/B evaluation gate, and can be rolled back.',
      es: 'Un operador sube el documento de auditoría, que pasa un filtro de inyección que trata el archivo como datos, nunca como órdenes; los documentos manipulados se rechazan antes de que corra cualquier trabajador. Las auditorías seguras llegan al supervisor — un enrutador de modelo que despacha trabajadores especialistas un paso cada vez: un mapeador de proveedores, un puntuador de riesgo cuya puntuación se calcula en código, un analista de compliance, un redactor de CAPAs y un redactor de informes, cada uno de vuelta al supervisor. El analista de compliance revisa cuatro áreas de la auditoría a la vez — estándares laborales, salud y seguridad, medio ambiente y ética empresarial — y sus resultados se fusionan de forma determinista; un verificador de citas descarta cualquier hallazgo cuya evidencia no se encuentre literalmente en la auditoría subida. Las acciones correctivas redactadas pausan en una puerta de revisión humana — aprobar, editar o rechazar — y las acciones aprobadas reanudan hacia el redactor de informes, que produce el informe para stakeholders. El estado del supervisor se guarda en checkpoints para que la pausa sobreviva a reinicios, los casos y eventos se persisten y cada decisión cae en una traza de auditoría encadenada por hash que se puede reverificar. Cada paso de modelo resuelve su prompt desde un registro de prompts con exactamente una versión promovida por trabajador; las nuevas versiones se crean en la consola, pasan una puerta de evaluación A/B y pueden revertirse.',
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
        'Every finding quoted from the audit, deterministic risk scores and human-approved corrective actions.',
      hook: { line: 'A generic AI summary says', accent: 'everything\'s fine.', tone: 'danger' },
      problem:
        'You\'re responsible for hundreds of suppliers you\'ll never visit. Each audit hides the lines that matter, and an AI summary that misses them — or invents them — is worse than none.',
      solution:
        'A supervisor routes each audit to specialist agents. Every finding must quote the audit word for word or it is thrown out. Risk is scored in code. Corrective actions wait for your team before anything reaches the supplier.',
      howItWorks: [
        {
          title: 'Upload the audit',
          text: 'A SMETA-style audit is submitted and screened for hidden instructions.',
        },
        {
          title: 'Map and score',
          text: 'The supplier is mapped — country, sector, tier — and risk is scored deterministically.',
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
          title: 'One supervisor,',
          titleAccent: 'five specialists.',
          tone: 'model',
          text: 'The supervisor routes each audit to a Supplier Mapper, Risk Scorer, Compliance Analyst, CAPA Writer and Report Writer. The four audit areas are reviewed in parallel.',
          image: img(2, 'Worker lanes showing the five specialists of a completed audit run'),
        },
        {
          title: 'Same audit,',
          titleAccent: 'same risk score.',
          tone: 'accent',
          text: 'Risk comes from country, sector and supplier tier, scored in code — not by the model. Run it twice and get the same answer.',
          image: img(3, 'Risk breakdown panel scoring country, sector and tier uplift in code'),
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
          label: 'Citation faithfulness',
          value: '0.96',
          note: 'vs 0.90 for a single bare prompt; same scorecard (0.963 / 0.896)',
          kind: 'measured',
        },
        {
          label: 'Injection block rate',
          value: '100%',
          note: '3 adversarial documents in the scorecard',
          kind: 'measured',
        },
        {
          label: 'CAPA grounding',
          value: '100%',
          note: 'Every corrective action traced to a finding; same scorecard',
          kind: 'measured',
        },
        {
          label: 'Automated tests',
          value: '705',
          note: '575 backend (91% branch coverage) + 123 frontend + 7 browser e2e',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Fabricated quotes',
        pipeline: '0%',
        baseline: '10.4%',
        note: 'Pipeline vs a single bare prompt · committed scorecard · 6 synthetic audits · one pass',
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
        'Cada hallazgo citado de la auditoría, puntuación de riesgo determinista y acciones correctivas aprobadas por humanos.',
      hook: { line: 'Un resumen genérico de IA dice', accent: 'que todo está bien.', tone: 'danger' },
      problem:
        'Eres responsable de cientos de proveedores que nunca visitarás. Cada auditoría esconde las líneas que importan, y un resumen de IA que se las salta — o se las inventa — es peor que ninguno.',
      solution:
        'Un supervisor reparte cada auditoría entre agentes especialistas. Cada hallazgo debe citar la auditoría palabra por palabra o se descarta. El riesgo se puntúa en código. Las acciones correctivas esperan a tu equipo antes de que nada llegue al proveedor.',
      howItWorks: [
        {
          title: 'Sube la auditoría',
          text: 'Se envía una auditoría estilo SMETA y se filtra en busca de instrucciones ocultas.',
        },
        {
          title: 'Mapear y puntuar',
          text: 'El proveedor se mapea — país, sector, tier — y el riesgo se puntúa de forma determinista.',
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
          title: 'Un supervisor,',
          titleAccent: 'cinco especialistas.',
          tone: 'model',
          text: 'El supervisor reparte cada auditoría entre un Supplier Mapper, Risk Scorer, Compliance Analyst, CAPA Writer y Report Writer. Las cuatro áreas de la auditoría se revisan en paralelo.',
          image: img(2, 'Carriles de trabajadores mostrando los cinco especialistas de una corrida de auditoría completada'),
        },
        {
          title: 'Misma auditoría,',
          titleAccent: 'misma puntuación de riesgo.',
          tone: 'accent',
          text: 'El riesgo viene del país, el sector y el tier del proveedor, puntuado en código — no por el modelo. Ejecútalo dos veces y obtén la misma respuesta.',
          image: img(3, 'Panel de desglose de riesgo puntuando en código país, sector y uplift de tier'),
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
          label: 'Fidelidad de citas',
          value: '0.96',
          note: 'vs 0,90 de un solo prompt pelado; mismo scorecard (0,963 / 0,896)',
          kind: 'measured',
        },
        {
          label: 'Tasa de bloqueo de inyección',
          value: '100%',
          note: '3 documentos adversariales en el scorecard',
          kind: 'measured',
        },
        {
          label: 'Anclaje de CAPAs',
          value: '100%',
          note: 'Cada acción correctiva trazada hasta un hallazgo; mismo scorecard',
          kind: 'measured',
        },
        {
          label: 'Tests automatizados',
          value: '705',
          note: '575 backend (91% cobertura de ramas) + 123 frontend + 7 e2e de navegador',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Citas inventadas',
        pipeline: '0%',
        baseline: '10.4%',
        note: 'Pipeline vs un solo prompt pelado · scorecard comprometido · 6 auditorías sintéticas · una pasada',
      },
      galleryHeadline: { title: 'Tu marco. Tus reglas.', accent: 'Tus sistemas.' },
      cta: {
        headline: '¿Lo pongo a funcionar en tu flujo de compliance?',
        text: 'Proyecto privado. Lo adapto a tu formato de auditoría, tu modelo de riesgo y tu puerta de revisión, lo valido con tus propias auditorías anonimizadas antes del lanzamiento y lo conecto a tus sistemas. Cuéntame tu setup.',
      },
    },
  },
};
