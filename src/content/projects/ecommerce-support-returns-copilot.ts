import type { Localized, Project } from '../types';

const dir = '/projects/ecommerce-support-returns-copilot';
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
  slug: 'ecommerce-support-returns-copilot',
  access: 'on-demand',
  order: 1,
  category: 'node',
  status: 'live',
  year: 2026,
  repoUrl: null,
  tests: 486,
  coverage: 97.1,
  stack: ['Node.js', 'TypeScript', 'Fastify', 'LangGraph', 'React', 'SQLite', 'Docker'],
  languages: ['en', 'es'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: {
      en: 'E-commerce Support & Returns Copilot preview',
      es: 'Vista previa de E-commerce Support & Returns Copilot',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'E-commerce Support & Returns Copilot support console on a laptop with the customer widget on tablet and phone',
      es: 'Consola de soporte de E-commerce Support & Returns Copilot en un portátil con el widget de cliente en tablet y teléfono',
    },
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: 'Btnuw-aMXtA',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: {
        en: 'Watch the E-commerce Support & Returns Copilot film',
        es: 'Ver la película de E-commerce Support & Returns Copilot',
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
        en: 'A supervisor routing work to five specialist workers',
        es: 'Un supervisor enrutando trabajo a cinco trabajadores especialistas',
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
      en: 'Simplified architecture of E-commerce Support & Returns Copilot: input guardrail, supervisor, five specialist workers, deterministic policy engine, amount cap, human approval queue, and a prompt registry feeding the model steps',
      es: 'Arquitectura simplificada de E-commerce Support & Returns Copilot: guardrail de entrada, supervisor, cinco trabajadores especialistas, motor de política determinista, tope de importe, cola de aprobación humana y un registro de prompts alimentando los pasos de modelo',
    },
    description: {
      en: 'A ticket arrives from the widget, the public sandbox or the API and passes the input guardrail (injection screen and rate limit). Blocked messages are rejected or sent back for more information; safe tickets reach the supervisor, a model router that dispatches specialist workers one step at a time — order lookup against the verified record, deterministic policy eligibility, refund decision drafting, shipping tracking and escalation — each returning to the supervisor. Eligibility and amounts come only from the deterministic policy engine; the model drafts the reply. If the refund amount is at or under the auto-approve cap, it is written and resolved; above the cap it waits in a human approval queue, and the human can approve, edit or reject before resolution. The supervisor and the four model workers each run the prompt version currently promoted in a prompt registry; policy eligibility has no prompt because it never calls a model. New prompt versions are authored in the console and only promoted after an A/B evaluation gate, with every promotion and rollback recorded in a tamper-evident audit trail. Each resolution is stored in the ticket history with the exact prompt versions that produced it.',
      es: 'Un ticket llega desde el widget, el sandbox público o la API y pasa el guardrail de entrada (filtro de inyección y límite de tasa). Los mensajes bloqueados se rechazan o se devuelven pidiendo más información; los tickets seguros llegan al supervisor, un enrutador de modelo que despacha trabajadores especialistas un paso cada vez — consulta de pedido contra el registro verificado, elegibilidad de política determinista, redacción de la decisión de reembolso, seguimiento de envío y escalado — cada uno de vuelta al supervisor. La elegibilidad y los importes vienen solo del motor de política determinista; el modelo redacta la respuesta. Si el importe del reembolso es igual o menor que el tope de auto-aprobación, se escribe y se resuelve; por encima del tope espera en una cola de aprobación humana, y el humano puede aprobar, editar o rechazar antes de la resolución. El supervisor y los cuatro trabajadores de modelo ejecutan cada uno la versión de prompt promovida en un registro de prompts; la elegibilidad de política no tiene prompt porque nunca llama a un modelo. Las nuevas versiones de prompt se crean en la consola y solo se promueven tras una puerta de evaluación A/B, con cada promoción y rollback grabado en una traza de auditoría que evidencia manipulación. Cada resolución se guarda en el historial del ticket con las versiones exactas de prompt que la produjeron.',
    },
  },
  gallery: [
    gal(1, {
      en: 'The customer widget holding a refund for review — the reply is drafted, a human decides',
      es: 'El widget de cliente reteniendo un reembolso para revisión — la respuesta está redactada, un humano decide',
    }),
    gal(2, {
      en: 'The same support widget on a tablet — states designed explicitly at every size',
      es: 'El mismo widget de soporte en una tablet — estados diseñados explícitamente en cada tamaño',
    }),
    gal(3, {
      en: 'The prompt registry listing versioned prompts for the router and every model worker, with lifecycle stages, no prompt text',
      es: 'El registro de prompts listando prompts versionados para el enrutador y cada trabajador de modelo, con etapas de ciclo de vida, sin texto de prompt',
    }),
    gal(4, {
      en: 'A duplicate refund request rejected deterministically in the customer widget',
      es: 'Una solicitud de reembolso duplicado rechazada de forma determinista en el widget de cliente',
    }),
  ],
  copy: {
    en: {
      title: 'E-commerce Support & Returns Copilot',
      tagline:
        'Post-purchase tickets resolved by a deterministic return-policy engine. Large refunds wait for a human, enforced at the database.',
      cardBlurb:
        'Order verification, a deterministic policy engine and a hard approval gate for large refunds.',
      hook: { line: 'A chatbot is cheaper —', accent: 'until it approves the wrong refund.', tone: 'danger' },
      problem:
        'Support tickets are judgment work with money attached, and every refund must trace back to policy, not to what a model felt like saying.',
      solution:
        'A supervisor routes each ticket to specialist workers; a deterministic engine alone decides eligibility and amounts; anything above the cap is physically impossible to auto-approve.',
      howItWorks: [
        {
          title: 'Ticket in',
          text: 'A ticket arrives from the widget, sandbox or API and passes the injection guardrail.',
        },
        {
          title: 'Verify the order',
          text: 'The order is checked against the real store database.',
        },
        {
          title: 'Apply policy',
          text: 'A deterministic engine decides eligibility: window, condition, item flags.',
        },
        {
          title: 'Decide',
          text: 'Refund, replacement or deny; the model only drafts the explanation.',
        },
        {
          title: 'Approve if needed',
          text: 'Refunds above the cap land in a human approval queue.',
        },
      ],
      features: [
        {
          title: 'Screened',
          titleAccent: 'before any AI runs.',
          tone: 'accent',
          text: 'Every message is screened in code before any model sees it. All 22 attack techniques in the corpus were blocked; a bare prompt blocked none.',
          image: img(6, 'A prompt-injection message blocked before any model runs'),
        },
        {
          title: 'Policy engine —',
          titleAccent: 'decides in code.',
          tone: 'accent',
          text: 'Return window, condition and item flags are checked in code against the verified order record. Same input, same decision, every time.',
          image: img(1, 'Ticket trace citing the return-policy rules that decided it'),
        },
        {
          title: 'Over the cap?',
          titleAccent: 'The database refuses.',
          tone: 'danger',
          text: 'Refunds above the cap can\'t be auto-approved: the system refuses the write, even if an agent tried. They wait for a person, with the policy check and the drafted reply side by side.',
          image: img(2, 'A $240 refund above the $75 cap waiting for human approval'),
        },
        {
          title: 'Duplicate refunds',
          titleAccent: 'stopped at the source.',
          tone: 'danger',
          text: 'A second refund for the same item is rejected deterministically before anything is written. No prompt can talk its way past it.',
          image: img(3, 'A duplicate refund request rejected in the support queue'),
        },
        {
          title: 'A widget',
          titleAccent: 'customers can use.',
          tone: 'accent',
          text: 'The public support widget handles empty, blocked and requires-approval states explicitly. White-label settings carry your store\'s name and colors.',
          image: img(4, 'Customer support widget on desktop and mobile'),
        },
        {
          title: 'Four in five',
          titleAccent: 'resolved without a human.',
          tone: 'accent',
          text: 'The Performance and Cost tab turns resolved tickets into a dollar figure. On the scored dataset, 81% of tickets were resolved without escalation.',
          image: img(5, 'Performance and cost panel with deflection rate and cost per ticket'),
        },
      ],
      results: [
        {
          label: 'Cost per ticket',
          value: '~$0.0006',
          note: 'Measured from real token usage in the live scorecard run',
          kind: 'measured',
        },
        {
          label: 'Injection block rate',
          value: '100%',
          note: '22-technique corpus; the bare-prompt baseline blocks 0%',
          kind: 'measured',
        },
        {
          label: 'Ticket deflection',
          value: '81%',
          note: 'Resolved without human escalation on the scored dataset — injections, above-cap refunds and disputes correctly reach humans',
          kind: 'measured',
        },
        {
          label: 'Automated tests',
          value: '486',
          note: '442 backend (97.1% line coverage) + 26 frontend + 18 browser E2E incl. accessibility checks',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Resolution accuracy',
        pipeline: '1.00',
        baseline: '0.11',
        note: 'Pipeline vs a single bare prompt · live scorecard · 36 synthetic tickets · one run · 2026-10-14',
      },
      galleryHeadline: { title: 'And it\'s a real', accent: 'product.' },
      cta: {
        headline: 'Want this adapted to your store?',
        text: 'Private project. I connect it to your order system, tune the policy engine and refund cap to your rules, validate it on your own anonymized tickets before go-live, and scale it to your whole support team. Tell me about your setup.',
      },
    },
    es: {
      title: 'E-commerce Support & Returns Copilot',
      tagline:
        'Tickets posventa resueltos por un motor determinista de política. Los reembolsos grandes esperan a un humano, forzado en la base de datos.',
      cardBlurb:
        'Verificación de pedidos, motor de política determinista y una puerta de aprobación estricta para reembolsos grandes.',
      hook: { line: 'Un chatbot es más barato —', accent: 'hasta que aprueba el reembolso equivocado.', tone: 'danger' },
      problem:
        'Los tickets de soporte son trabajo de criterio con dinero de por medio, y cada reembolso debe poder rastrearse hasta la política, no hasta lo que un modelo tuvo ganas de decir.',
      solution:
        'Un supervisor enruta cada ticket a trabajadores especialistas; solo un motor determinista decide elegibilidad e importes; cualquier cosa por encima del tope es físicamente imposible de auto-aprobar.',
      howItWorks: [
        {
          title: 'Entra el ticket',
          text: 'Un ticket llega desde el widget, el sandbox o la API y pasa el guardrail de inyección.',
        },
        {
          title: 'Verificar el pedido',
          text: 'El pedido se comprueba contra la base de datos real de la tienda.',
        },
        {
          title: 'Aplicar la política',
          text: 'Un motor determinista decide la elegibilidad: ventana, estado, flags del artículo.',
        },
        {
          title: 'Decidir',
          text: 'Reembolso, reposición o rechazo; el modelo solo redacta la explicación.',
        },
        {
          title: 'Aprobar si hace falta',
          text: 'Los reembolsos por encima del tope caen en una cola de aprobación humana.',
        },
      ],
      features: [
        {
          title: 'Filtrado',
          titleAccent: 'antes de que corra la IA.',
          tone: 'accent',
          text: 'Cada mensaje se filtra en código antes de que lo vea cualquier modelo. Las 22 técnicas de ataque del corpus quedaron bloqueadas; un prompt pelado no bloqueó ninguna.',
          image: img(6, 'Un mensaje de inyección de prompt bloqueado antes de que corra cualquier modelo'),
        },
        {
          title: 'Motor de política —',
          titleAccent: 'decide en código.',
          tone: 'accent',
          text: 'La ventana de devolución, el estado y los flags del artículo se comprueban en código contra el registro verificado del pedido. Misma entrada, misma decisión, siempre.',
          image: img(1, 'Traza de un ticket citando las reglas de política de devoluciones que lo decidieron'),
        },
        {
          title: '¿Por encima del tope?',
          titleAccent: 'La base de datos lo rechaza.',
          tone: 'danger',
          text: 'Los reembolsos por encima del tope no pueden auto-aprobarse: el sistema rechaza la escritura, aunque un agente lo intente. Esperan a una persona, con la comprobación de política y la respuesta redactada una al lado de la otra.',
          image: img(2, 'Un reembolso de $240 por encima del tope de $75 esperando aprobación humana'),
        },
        {
          title: 'Reembolsos duplicados',
          titleAccent: 'frenados en el origen.',
          tone: 'danger',
          text: 'Un segundo reembolso del mismo artículo se rechaza de forma determinista antes de escribir nada. Ningún prompt puede convencer al sistema.',
          image: img(3, 'Una solicitud de reembolso duplicado rechazada en la cola de soporte'),
        },
        {
          title: 'Un widget',
          titleAccent: 'que los clientes pueden usar.',
          tone: 'accent',
          text: 'El widget público de soporte maneja los estados vacío, bloqueado y requiere-aprobación de forma explícita. Los ajustes white-label llevan el nombre y los colores de tu tienda.',
          image: img(4, 'Widget de soporte al cliente en escritorio y móvil'),
        },
        {
          title: 'Cuatro de cinco',
          titleAccent: 'resueltos sin un humano.',
          tone: 'accent',
          text: 'La pestaña de Rendimiento y Coste convierte los tickets resueltos en una cifra en dólares. En el dataset puntuado, el 81% de los tickets se resolvió sin escalado.',
          image: img(5, 'Panel de rendimiento y coste con tasa de deflexión y coste por ticket'),
        },
      ],
      results: [
        {
          label: 'Coste por ticket',
          value: '~$0.0006',
          note: 'Medido desde el uso real de tokens en la corrida en vivo del scorecard',
          kind: 'measured',
        },
        {
          label: 'Tasa de bloqueo de inyección',
          value: '100%',
          note: 'Corpus de 22 técnicas; la referencia de prompt pelado bloquea 0%',
          kind: 'measured',
        },
        {
          label: 'Deflexión de tickets',
          value: '81%',
          note: 'Resueltos sin escalado humano en el dataset puntuado — inyecciones, reembolsos sobre el tope y disputas llegan correctamente a humanos',
          kind: 'measured',
        },
        {
          label: 'Tests automatizados',
          value: '486',
          note: '442 backend (97.1% cobertura de líneas) + 26 frontend + 18 E2E de navegador con checks de accesibilidad',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Precisión de resolución',
        pipeline: '1.00',
        baseline: '0.11',
        note: 'Pipeline vs un solo prompt pelado · scorecard en vivo · 36 tickets sintéticos · una corrida · 2026-10-14',
      },
      galleryHeadline: { title: 'Y es un', accent: 'producto real.' },
      cta: {
        headline: '¿Lo adapto a tu tienda?',
        text: 'Proyecto privado. Lo conecto a tu sistema de pedidos, afino el motor de política y el tope de reembolso a tus reglas, lo valido con tus propios tickets anonimizados antes del lanzamiento y lo escalo a todo tu equipo de soporte. Cuéntame tu setup.',
      },
    },
  },
};
