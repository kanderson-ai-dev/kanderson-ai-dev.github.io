// /projects/:slug — "the film, scrollable" (Plan.md §6).
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLang } from '../i18n';
import { getProject, visibleProjects } from '../content/projects';
import type { Img } from '../content/types';
import {
  ActCard,
  Badge,
  Button,
  Chip,
  Counter,
  EvidenceChip,
  FrameBrackets,
  GlassPanel,
  GodRays,
  Kicker,
  LensFlare,
  Reveal,
  SplitHeadline,
  Stamp,
} from '../components/primitives';
import { LiteYouTube } from '../components/LiteYouTube';
import { ContactBand } from '../components/Layout';
import layout from '../components/layout.module.css';
import s from './pages.module.css';

/* ---------------- scroll-spy sub-nav ---------------- */

const SubNav = ({ labels, visible }: { labels: Record<string, string>; visible: string[] }) => {
  const [active, setActive] = useState('overview');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    visible.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [visible]);
  return (
    <nav className={layout.subnav} aria-label="sections">
      <div className={layout.subnavInner}>
        {visible.map((id) => (
          <a key={id} href={`#${id}`} className={active === id ? layout.active : ''}>
            {labels[id]}
          </a>
        ))}
      </div>
    </nav>
  );
};

/* ---------------- Lightbox ---------------- */

const Lightbox = ({ img, onClose }: { img: Img; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={img.alt} onClick={onClose}>
      <button type="button" className={s.lightboxClose} onClick={onClose} autoFocus>
        Esc ✕
      </button>
      <img src={img.src} alt={img.alt} width={img.width} height={img.height} onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

/* ---------------- Page ---------------- */

export const ProjectPage = () => {
  const { slug } = useParams();
  const { lang, dict, l } = useLang();
  const project = slug ? getProject(slug) : undefined;
  const [zoom, setZoom] = useState<Img | null>(null);
  const onClose = useCallback(() => setZoom(null), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return null;
  const copy = (lang === 'es' ? project.copy.es : undefined) ?? project.copy.en!;
  const missingEs = lang === 'es' && !project.copy.es;

  const idx = visibleProjects.findIndex((p) => p.slug === project.slug);
  const prev = visibleProjects[idx - 1];
  const next = visibleProjects[idx + 1];

  const navLabels: Record<string, string> = {
    overview: dict.project.overview,
    demo: dict.project.demo,
    features: dict.project.features,
    architecture: dict.project.architecture,
    results: dict.project.results,
    stack: dict.project.stack,
  };

  const visibleSections = [
    'overview',
    ...(project.video ? ['demo'] : []),
    'features',
    ...(project.architecture ? ['architecture'] : []),
    ...(copy.results?.length ? ['results'] : []),
    'stack',
  ];

  return (
    <>
      <SubNav labels={navLabels} visible={visibleSections} />

      {/* Hook — cold open */}
      {copy.hook && (
        <section className={s.hookBand}>
          <div className={s.hookBg}>
            <img src={`/projects/${project.slug}/hook-1920.webp`} alt="" loading="eager" fetchPriority="high" />
          </div>
          <div className={`${s.wrap} ${s.hookInner}`}>
            <Reveal>
              <SplitHeadline
                title={copy.hook.line}
                accent={copy.hook.accent}
                tone={copy.hook.tone}
                size="clamp(2.4rem, 6.5vw, 5rem)"
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Hero — title card */}
      <section className={`${s.wrap} ${s.pHero}`} id="overview">
        <GodRays />
        <div>
          <Kicker>
            {dict.project.introducing} · {project.category.toUpperCase()}
          </Kicker>
          <div style={{ margin: '1rem 0' }}>
            <SplitHeadline
              title={copy.title.split(' ')[0]}
              accent={copy.title.slice(copy.title.indexOf(' ') + 1)}
              as="h1"
              size="clamp(2rem, 4.6vw, 3.8rem)"
            />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '1.06rem', maxWidth: '52ch' }}>{copy.tagline}</p>
          <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', margin: '1.2rem 0 1.6rem' }}>
            <Badge status={project.status} />
            {project.stack.slice(0, 5).map((t) => (
              <Chip key={t} muted>
                {t}
              </Chip>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
            {project.video && (
              <Button href="#demo" variant="primary">
                {dict.project.watchFilm} →
              </Button>
            )}
            {project.repoUrl && (
              <Button href={project.repoUrl} variant="ghost" external>
                {dict.project.viewGithub}
              </Button>
            )}
          </div>
          {missingEs && <div className={s.enNotice}>{dict.project.enOnly}</div>}
        </div>
        <Reveal className={s.pHeroMedia}>
          <GlassPanel style={{ padding: 0 }}>
            <img
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              width={project.heroImage.width}
              height={project.heroImage.height}
              loading="eager"
              style={{ borderRadius: 'var(--radius-lg)' }}
            />
          </GlassPanel>
          <LensFlare style={{ top: '6%', left: '10%' }} />
        </Reveal>
      </section>

      {/* Overview — problem / solution / how it works */}
      <section className={`${s.wrap} ${s.cv}`}>
        <Reveal className={s.twoCol}>
          <GlassPanel className={s.panelPad} style={{ borderLeft: '3px solid var(--danger)' }}>
            <Kicker>{dict.project.problem}</Kicker>
            <p style={{ marginTop: '1rem', fontSize: '1.05rem', lineHeight: 1.6 }}>{copy.problem}</p>
            {copy.hook?.tone === 'danger' && <Stamp>{copy.hook.accent.replace('.', '')}</Stamp>}
          </GlassPanel>
          <GlassPanel className={s.panelPad} style={{ borderLeft: '3px solid var(--accent)' }}>
            <Kicker>{dict.project.solution}</Kicker>
            <p style={{ marginTop: '1rem', fontSize: '1.05rem', lineHeight: 1.6 }}>{copy.solution}</p>
          </GlassPanel>
        </Reveal>
        <Reveal>
          <SplitHeadline title={dict.project.howItWorks} size="clamp(1.5rem,3.4vw,2.4rem)" />
          <div className={s.steps}>
            {copy.howItWorks.map((step, i) => (
              <div className={s.step} key={step.title}>
                <div className={s.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className={s.stepTitle}>{step.title}</div>
                  <div className={s.stepText}>{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Demo — the film */}
      {project.video && (
        <section id="demo" className={`${s.demo} ${s.cv}`}>
          <div className={s.wrap}>
            <Reveal>
              <LiteYouTube
                youtubeId={project.video.youtubeId}
                poster={project.video.poster}
                title={`${copy.title} — film`}
                comingSoonText={dict.project.filmComingSoon}
              />
              {project.video.youtubeId && (
                <p className={s.captionsNote}>{dict.project.captionsNote}</p>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* Features — the promises */}
      <section id="features" className={`${s.wrap} ${s.cv}`}>
        <ActCard>{dict.project.features}</ActCard>
        {copy.features.map((f, i) => (
          <Reveal key={f.title + i} className={`${s.zzRow} ${i % 2 ? s.flip : ''}`}>
            <button type="button" className={s.featureImg} onClick={() => setZoom(f.image)} aria-label={`${f.image.alt} — enlarge`}>
              <img src={f.image.src} alt={f.image.alt} width={f.image.width} height={f.image.height} loading="lazy" />
              <FrameBrackets />
            </button>
            <div>
              <SplitHeadline
                title={f.title}
                accent={f.titleAccent}
                tone={f.tone}
                as="h3"
                size="clamp(1.6rem, 3.4vw, 2.5rem)"
              />
              <p style={{ color: 'var(--muted)', marginTop: '0.9rem', maxWidth: '52ch', fontSize: '1.02rem' }}>{f.text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Architecture */}
      {project.architecture && (
        <section id="architecture" className={`${s.wrap} ${s.cv}`}>
          <Reveal>
            <SplitHeadline title={dict.project.architecture} size="clamp(1.5rem,3.4vw,2.4rem)" />
            <figure className={s.archWrap}>
              <img src={project.architecture.src} alt={project.architecture.alt} width="1600" height="900" loading="lazy" />
              <figcaption className={s.archCaption}>{dict.project.archSource}</figcaption>
            </figure>
            <details className={s.archDetails}>
              <summary>{dict.project.archDetails}</summary>
              <p>{project.architecture.description}</p>
            </details>
          </Reveal>
        </section>
      )}

      {/* Results — measured, not claimed */}
      {copy.results && copy.results.length > 0 && (
        <section id="results" className={`${s.wrap} ${s.section} ${s.cv}`}>
          <Reveal>
            <SplitHeadline title={dict.project.resultsA} accent={dict.project.resultsB} size="clamp(1.9rem,4.4vw,3.2rem)" />
          </Reveal>
          <Reveal className={s.strip}>
            {copy.results.map((r) => (
              <div key={r.label}>
                <Counter value={r.value} label={r.label} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <EvidenceChip kind={r.kind}>{r.note}</EvidenceChip>
                </div>
              </div>
            ))}
          </Reveal>
          {copy.baseline && (
            <Reveal>
              <GlassPanel className={s.panelPad}>
                <Kicker>{copy.baseline.label}</Kicker>
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'baseline', marginTop: '0.9rem', flexWrap: 'wrap' }}>
                  <Counter value={copy.baseline.pipeline} label="this system" />
                  <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.6rem' }}>vs</span>
                  <Counter value={copy.baseline.baseline} label="baseline" />
                </div>
                <p style={{ color: 'var(--muted)', marginTop: '0.8rem', marginBottom: 0 }}>{copy.baseline.note}</p>
              </GlassPanel>
            </Reveal>
          )}
          {copy.limitations && (
            <Reveal>
              <div className={s.limitPanel} style={{ background: 'var(--panel)', borderRadius: 'var(--radius)' }}>
                <strong style={{ color: 'var(--warn)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.12em' }}>
                  {dict.project.limitations.toUpperCase()}
                </strong>
                <ul style={{ margin: '0.7rem 0 0', paddingLeft: '1.2rem' }}>
                  {(Array.isArray(copy.limitations) ? copy.limitations : [copy.limitations]).map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* Gallery — a real product, not a slide */}
      {project.gallery && project.gallery.length > 0 && (
        <section className={`${s.wrap} ${s.cv}`}>
          <Reveal>
            <SplitHeadline
              title={copy.galleryHeadline?.title ?? dict.project.realProductA}
              accent={copy.galleryHeadline?.accent ?? dict.project.realProductB}
              size="clamp(1.5rem,3.4vw,2.4rem)"
            />
            <div className={s.gallery}>
              {project.gallery.map((g) => (
                <button key={g.src} type="button" onClick={() => setZoom(g)} aria-label={g.alt}>
                  <img src={g.src} alt={g.alt} width={g.width} height={g.height} loading="lazy" />
                </button>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Stack */}
      <section id="stack" className={`${s.wrap} ${s.cv}`}>
        <Reveal>
          <SplitHeadline title={dict.project.stack} size="clamp(1.5rem,3.4vw,2.4rem)" />
          <div className={s.stackRow}>
            {project.stack.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Final CTA + prev/next */}
      <div className={`${s.wrap} ${s.cv}`}>
        <Reveal className={s.prevNext}>
          {prev ? (
            <Link to={l(`/projects/${prev.slug}`)}>
              <GlassPanel hover className={s.pnCard}>
                <img src={prev.cardImage.src} alt="" width={110} height={69} loading="lazy" />
                <span>
                  <span className={s.pnLabel}>← {dict.project.previous}</span>
                  <span className={s.pnTitle} style={{ display: 'block' }}>{prev.copy.en!.title}</span>
                </span>
              </GlassPanel>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={l(`/projects/${next.slug}`)}>
              <GlassPanel hover className={s.pnCard} style={{ justifyContent: 'flex-end', textAlign: 'right' }}>
                <span>
                  <span className={s.pnLabel}>{dict.project.next} →</span>
                  <span className={s.pnTitle} style={{ display: 'block' }}>{next.copy.en!.title}</span>
                </span>
                <img src={next.cardImage.src} alt="" width={110} height={69} loading="lazy" />
              </GlassPanel>
            </Link>
          ) : (
            <span />
          )}
        </Reveal>
      </div>
      <ContactBand
        kicker={copy.cta ? undefined : dict.contact.kicker}
        titleA={copy.cta?.headline ?? dict.contact.titleA}
        titleB={copy.cta ? undefined : dict.contact.titleB}
        text={copy.cta?.text ?? dict.contact.text}
      />

      {zoom && <Lightbox img={zoom} onClose={onClose} />}
    </>
  );
};
