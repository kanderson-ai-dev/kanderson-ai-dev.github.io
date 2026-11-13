// Content model (Plan.md §7). Every project page renders only from this data.

export type Lang = 'en' | 'es';
export type Status = 'live' | 'in-development' | 'planned';
export type Category = 'python' | 'node';
export type Access = 'open-source' | 'on-demand';

// A text that exists in both languages — or a plain string when it is
// brand/shared or not translated yet (D-I18N1: all fields get an es value).
export type Localized = string | Partial<Record<Lang, string>>;

export interface Img {
  src: string;
  alt: Localized;
  width: number;
  height: number;
}

// Semantic accent (§3.1): code/verified, model, human, blocked
export type Tone = 'accent' | 'model' | 'human' | 'danger';

// One architecture view (diagram) of a project, transcribed from its README.
// `title` renders a small heading above the figure when present.
export interface ArchView {
  src: string;
  alt: Localized;
  description: Localized;
  width?: number;
  height?: number;
  title?: Localized;
}

export interface ProjectCopy {
  title: string;
  tagline: string; // <= 140 chars
  cardBlurb: string; // <= 120 chars (cards + mega-menu)
  hook?: { line: string; accent: string; tone?: Tone };
  problem: string;
  solution: string;
  howItWorks: { title: string; text: string }[]; // 4-6 steps
  features: {
    title: string;
    titleAccent?: string;
    tone?: Tone;
    text: string;
    image: Img; // 16:9 slot — film-derived 1600x900, real captures re-framed by tools/mockups
  }[]; // 3-6 features; title + titleAccent render as a SplitHeadline
  results?: { label: string; value: string; note: string; kind: 'measured' | 'simulated' }[];
  baseline?: { label: string; pipeline: string; baseline: string; note: string };
  limitations?: string | string[]; // open-source only; forbidden on on-demand projects (D-OD8)
  galleryHeadline?: { title: string; accent: string }; // overrides the shared gallery headline
  cta?: { headline: string; text: string };
}

export interface Project {
  slug: string;
  access: Access; // 'on-demand' ⇒ repoUrl: null, copy.en.cta required, no limitations
  order: number; // landing/menu order within its access group
  category: Category;
  status: Status;
  year: number;
  repoUrl: string | null;
  tests: number; // automated tests, from the project's README verification block
  coverage?: number; // line coverage %, measured in CI
  stack: string[];
  languages: Lang[];
  defaultLang?: Lang;
  hiddenFromIndex?: boolean;
  cardImage: Img; // 16:10 thumbnail
  heroImage: Img;
  ogImage: string; // 1200x630
  video: { youtubeId: string | null; poster: Img; captionsLang: Lang[] } | null;
  loop?: { webm: string; mp4: string; poster: Img };
  architecture?: ArchView | ArchView[];
  gallery?: Img[];
  copy: Record<Lang, ProjectCopy | undefined>; // 'en' required, 'es' optional
}
