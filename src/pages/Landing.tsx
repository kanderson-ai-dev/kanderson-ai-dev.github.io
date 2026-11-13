// Landing (Plan.md §5): cold open → title → the work → thesis → proof → end card.
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { copyFor, pick, useLang } from '../i18n';
import { onDemandProjects, openSourceProjects, totals } from '../content/projects';
import type { Project } from '../content/types';
import {
  AccessBadge,
  ActCard,
  Badge,
  Button,
  Chip,
  Counter,
  FrameBrackets,
  GlassPanel,
  GodRays,
  IconTile,
  Kicker,
  Reveal,
  SplitHeadline,
} from '../components/primitives';
import { Particles } from '../components/Particles';
import { AmbientLoop } from '../components/AmbientLoop';
import { ContactBand } from '../components/Layout';
import s from './pages.module.css';

const ICONS: Record<string, React.ReactNode> = {
  model: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 3 6.5 4 4 0 0 1-1.5 6.5A4 4 0 0 1 12 22a4 4 0 0 1-5.5-3A4 4 0 0 1 5 12.5 4 4 0 0 1 8 6a4 4 0 0 1 4-4Z" />
      <path d="M12 8v8M8.5 10.5 12 8l3.5 2.5" />
    </svg>
  ),
  code: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  human: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  ),
};

/* scroll-focus: centered card gets .focused */
const useFocusRows = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll('[data-zz]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('focused', e.isIntersecting);
      },
      { threshold: 0.55 },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
  return ref;
};

const ShowcaseCard = ({ p, index, num }: { p: Project; index: number; num: number }) => {
  const { dict, l, lang } = useLang();
  const copy = copyFor(p, lang);
  const flip = index % 2 === 1;
  return (
    <div className={`${s.zzRow} ${flip ? s.flip : ''}`} data-zz>
      <div className={s.zzMedia}>
        <Link to={l(`/projects/${p.slug}`)} aria-label={copy.title} tabIndex={-1}>
          <img src={p.cardImage.src} alt={pick(p.cardImage.alt, lang)} width={p.cardImage.width} height={p.cardImage.height} loading="lazy" style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover' }} />
        </Link>
        <FrameBrackets />
      </div>
      <div>
        <Kicker>
          {String(num).padStart(2, '0')} / {p.category.toUpperCase()}
        </Kicker>
        <div style={{ margin: '0.7rem 0 0.6rem' }}>
          <SplitHeadline title={copy.title} as="h3" size="clamp(1.5rem, 3.2vw, 2.2rem)" />
        </div>
        <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge status={p.status} />
          {p.access === 'on-demand' && <AccessBadge label={dict.project.private} />}
        </span>
        <p style={{ color: 'var(--muted)', marginTop: '0.9rem', maxWidth: '46ch' }}>{copy.cardBlurb}</p>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', margin: '0.9rem 0 1.1rem' }}>
          {p.stack.slice(0, 4).map((t) => (
            <Chip key={t} muted>
              {t}
            </Chip>
          ))}
        </div>
        <div className={s.moreBtn}>
          <Button href={l(`/projects/${p.slug}`)} variant="ghost">
            {dict.showcase.more} →
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Landing = () => {
  const { dict, l, lang } = useLang();
  const zzRef = useFocusRows();
  const flagship = openSourceProjects.find((p) => p.slug === 'langgraph-multiagent-orchestrator');
  const projectsNote =
    totals.onDemand > 0
      ? dict.strip.projectsNote
          .replace('{open}', String(totals.openSource))
          .replace('{demand}', String(totals.onDemand))
      : 'github.com/kanderson-ai-dev';
  const testsNote =
    totals.testsPrivate > 0
      ? dict.strip.testsNote
          .replace('{pub}', String(totals.testsPublic))
          .replace('{priv}', String(totals.testsPrivate))
      : dict.strip.testsFallback;

  /* Counter strip — measured, not claimed. Sits between the two acts (proof
     right after the product); without on-demand projects it keeps its old
     spot right after the hero. */
  const counterStrip = (
    <section className={`${s.wrap} ${s.cv}`} aria-label={dict.a11y.figures}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
          <SplitHeadline title={dict.strip.headlineA} accent={dict.strip.headlineB} size="clamp(1.6rem,3.5vw,2.4rem)" />
        </div>
        <div className={s.strip}>
          <Counter value={String(totals.projects)} label={dict.strip.projects} note={projectsNote} />
          <Counter value={String(totals.tests)} label={dict.strip.tests} note={testsNote} />
          <Counter value={totals.topCoverage} label={dict.strip.coverage} note={dict.strip.coverageNote} />
        </div>
      </Reveal>
    </section>
  );

  return (
    <>
      {/* 1 — Hero / cold open */}
      <section className={s.hero}>
        {flagship?.loop && (
          <div className={s.heroLoop}>
            <AmbientLoop
              loop={flagship.loop}
              style={{ width: '100%', height: '100%' }}
              label={dict.a11y.pauseLoop}
              playLabel={dict.a11y.playLoop}
            />
          </div>
        )}
        <GodRays />
        <Particles count={30} />
        <div className={`${s.wrap} ${s.heroInner}`}>
          <Kicker>{dict.hero.kicker}</Kicker>
          <h1 className={s.heroName} style={{ marginTop: '1rem' }}>
            {dict.hero.name}
          </h1>
          <div className={s.heroLine} aria-hidden="true" />
          <div style={{ marginTop: '1.6rem' }}>
            <SplitHeadline
              title={dict.hero.titleA}
              accent={dict.hero.titleB}
              as="div"
              size="clamp(1.4rem, 3.6vw, 2.6rem)"
            />
          </div>
          <p className={s.thesis}>
            <span className={s.thesisModel}>{dict.hero.thesisModel}</span>
            <span className={s.thesisCode}>{dict.hero.thesisCode}</span>
            <span className={s.thesisHuman}>{dict.hero.thesisHuman}</span>
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', marginTop: '2.2rem', flexWrap: 'wrap' }}>
            <Button href={l('/projects')} variant="primary">
              {dict.hero.viewProjects} →
            </Button>
            <Button href="#contact" variant="ghost">
              {dict.hero.getInTouch}
            </Button>
          </div>
          {onDemandProjects.length > 0 && (
            <a href="#on-demand" className={s.heroTeaser}>
              <span className={s.heroTeaserKicker}>{dict.nav.onDemand}</span>
              <AccessBadge label={dict.project.private} />
              <span className={s.heroTeaserTitle}>{copyFor(onDemandProjects[0], lang).title}</span>
              <span className={s.heroTeaserArrow} aria-hidden="true">
                ↓
              </span>
            </a>
          )}
        </div>
        <div className={s.scrollCue}>{dict.hero.scroll} ↓</div>
      </section>

      {/* 2 — The work: on demand first, proof, then open source */}
      {onDemandProjects.length === 0 && counterStrip}
      <div ref={zzRef} id="work">
        {onDemandProjects.length > 0 ? (
          <>
            <div id="on-demand">
              <ActCard>{dict.showcase.actOnDemand}</ActCard>
              <section className={`${s.wrap} ${s.cv}`} aria-label={dict.a11y.onDemand}>
                <Reveal>
                  <p style={{ color: 'var(--muted)', maxWidth: '60ch', fontSize: '1.02rem' }}>
                    {dict.showcase.onDemandIntro}
                  </p>
                </Reveal>
                {onDemandProjects.map((p, i) => (
                  <ShowcaseCard key={p.slug} p={p} index={i} num={i + 1} />
                ))}
              </section>
            </div>
            {counterStrip}
            <ActCard>{dict.showcase.actOpenSource}</ActCard>
          </>
        ) : (
          <ActCard>{dict.showcase.act}</ActCard>
        )}
        <section id="open-source" className={`${s.wrap} ${s.cv}`} aria-label={dict.a11y.openSource}>
          {openSourceProjects.map((p, i) => (
            <ShowcaseCard key={p.slug} p={p} index={onDemandProjects.length + i} num={i + 1} />
          ))}
        </section>
      </div>

      {/* 3 — About / thesis */}
      <section id="about" className={`${s.section} ${s.cv}`}>
        <div className={s.wrap}>
          <Reveal>
            <SplitHeadline title={dict.about.titleA} accent={dict.about.titleB} size="clamp(1.8rem,4.4vw,3.2rem)" />
            <p style={{ color: 'var(--muted)', maxWidth: '68ch', marginTop: '1.4rem', fontSize: '1.05rem' }}>{dict.about.p1}</p>
            <p style={{ color: 'var(--muted)', maxWidth: '68ch', fontSize: '1.05rem' }}>{dict.about.p2}</p>
          </Reveal>
          <Reveal className={s.triad}>
            <GlassPanel className={s.triadCard}>
              <div className={s.triadTitle} style={{ color: 'var(--model)' }}>{dict.about.modelTitle}</div>
              <p style={{ color: 'var(--muted)', margin: 0 }}>{dict.about.modelText}</p>
            </GlassPanel>
            <GlassPanel className={s.triadCard}>
              <div className={s.triadTitle} style={{ color: 'var(--accent)' }}>{dict.about.codeTitle}</div>
              <p style={{ color: 'var(--muted)', margin: 0 }}>{dict.about.codeText}</p>
            </GlassPanel>
            <GlassPanel className={s.triadCard}>
              <div className={s.triadTitle} style={{ color: 'var(--human)' }}>{dict.about.humanTitle}</div>
              <p style={{ color: 'var(--muted)', margin: 0 }}>{dict.about.humanText}</p>
            </GlassPanel>
          </Reveal>
          <Reveal className={s.pillars}>
            <IconTile icon={ICONS.model} name={dict.about.pillar1} job={dict.about.pillar1Text} tone="model" />
            <IconTile icon={ICONS.code} name={dict.about.pillar2} job={dict.about.pillar2Text} tone="accent" />
            <IconTile icon={ICONS.human} name={dict.about.pillar3} job={dict.about.pillar3Text} tone="human" />
          </Reveal>
        </div>
      </section>

      {/* 4 — Contact / end card */}
      <ContactBand titleA={dict.contact.titleA} titleB={dict.contact.titleB} text={dict.contact.text} showWork />
    </>
  );
};
