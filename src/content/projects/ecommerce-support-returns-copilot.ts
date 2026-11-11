import type { Project } from '../types';

const dir = '/projects/ecommerce-support-returns-copilot';
const img = (n: number, alt: string) => ({
  src: `${dir}/feature-${n}-1600.webp`,
  alt,
  width: 1600,
  height: 900,
});
const gal = (n: number, alt: string) => ({
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
  languages: ['en'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: 'E-commerce Support & Returns Copilot preview',
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: 'E-commerce Support & Returns Copilot support console on a laptop with the customer widget on tablet and phone',
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: null,
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: 'Watch the E-commerce Support & Returns Copilot film',
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
      alt: 'A supervisor routing work to five specialist workers',
      width: 1280,
      height: 720,
    },
  },
  architecture: {
    src: `${dir}/architecture.webp`,
    width: 1920,
    height: 960,
    alt: 'Simplified architecture of E-commerce Support & Returns Copilot: input guardrail, supervisor, five specialist workers, deterministic policy engine, amount cap and human approval queue',
    description:
      'A ticket arrives from the widget, the public sandbox or the API and passes the input guardrail (injection screen and rate limit). Blocked messages are rejected or sent back for more information; safe tickets reach the supervisor, a model router that dispatches specialist workers one step at a time — order lookup against the verified record, deterministic policy eligibility, refund decision drafting, shipping tracking and escalation — each returning to the supervisor. Eligibility and amounts come only from the deterministic policy engine; the model drafts the reply. If the refund amount is at or under the auto-approve cap, it is written and resolved; above the cap it waits in a human approval queue, and the human can approve, edit or reject before resolution.',
  },
  gallery: [
    gal(1, 'The customer widget holding a refund for review — the reply is drafted, a human decides'),
    gal(2, 'The same support widget on a tablet — states designed explicitly at every size'),
    gal(3, 'The prompt registry listing versioned worker prompts with lifecycle stages, no prompt text'),
    gal(4, 'A duplicate refund request rejected deterministically in the customer widget'),
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
      limitations: [
        'The scorecard is a regression gate over 36 synthetic tickets from a single live run, not a capability claim.',
        'The demo runs on a synthetic store. A real deployment connects to your order system and is validated on your own anonymized tickets before go-live.',
        'The default store is single-node; a multi-operator deployment moves to a shared database.',
      ],
      galleryHeadline: { title: 'And it\'s a real', accent: 'product.' },
      cta: {
        headline: 'Want this adapted to your store?',
        text: 'Private project. I tailor the policy engine, order source and channels to your store. Tell me about your setup.',
      },
    },
    es: undefined,
  },
};
