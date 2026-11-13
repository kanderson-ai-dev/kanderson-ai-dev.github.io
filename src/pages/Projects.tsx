// /projects — grid index with technology filters, split into the Open-source
// and On-demand groups (Plan.md §4, §5.2 + D-OD1/D-OD2).
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { copyFor, pick, useLang } from '../i18n';
import { onDemandProjects, openSourceProjects, visibleProjects } from '../content/projects';
import type { Project } from '../content/types';
import { AccessBadge, Badge, Chip, GlassPanel, Reveal, SplitHeadline } from '../components/primitives';
import s from './pages.module.css';

export const Projects = () => {
  const { dict, l, lang } = useLang();
  const [tech, setTech] = useState<string | null>(null);

  const techs = useMemo(() => {
    const all = new Set<string>();
    visibleProjects.forEach((p) => p.stack.forEach((t) => all.add(t)));
    return Array.from(all).sort();
  }, []);

  const grouped = onDemandProjects.length > 0;
  const match = (p: Project) => !tech || p.stack.includes(tech);
  const osList = openSourceProjects.filter(match);
  const odList = onDemandProjects.filter(match);
  const flat = visibleProjects.filter(match);

  const card = (p: Project) => {
    const copy = copyFor(p, lang);
    return (
      <Reveal key={p.slug}>
        <GlassPanel hover className={s.card}>
          <Link to={l(`/projects/${p.slug}`)} aria-label={copy.title}>
            <img
              className={s.cardImg}
              src={p.cardImage.src}
              alt={pick(p.cardImage.alt, lang)}
              width={p.cardImage.width}
              height={p.cardImage.height}
              loading="lazy"
            />
            <div className={s.cardBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem' }}>
                <span className={s.cardTitle}>{copy.title}</span>
                <span style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {p.access === 'on-demand' && <AccessBadge label={dict.project.private} />}
                  <Badge status={p.status} />
                </span>
              </div>
              <span className={s.cardBlurb}>{copy.cardBlurb}</span>
              <span className={s.cardChips}>
                {p.stack.slice(0, 4).map((t) => (
                  <Chip key={t} muted>
                    {t}
                  </Chip>
                ))}
              </span>
            </div>
          </Link>
        </GlassPanel>
      </Reveal>
    );
  };

  return (
    <section className={`${s.wrap} ${s.section}`}>
      <Reveal>
        <SplitHeadline
          title={dict.projectsPage.titleA}
          accent={dict.projectsPage.titleB}
          as="h1"
          size="clamp(2rem, 5vw, 3.6rem)"
        />
        <p style={{ color: 'var(--muted)', maxWidth: '60ch', marginTop: '1rem' }}>{dict.projectsPage.subtitle}</p>
      </Reveal>
      <div className={s.filterRow} role="group" aria-label={dict.a11y.filterTech}>
        <button type="button" className={s.filterBtn} aria-pressed={tech === null} onClick={() => setTech(null)}>
          {dict.projectsPage.all}
        </button>
        {techs.map((t) => (
          <button
            key={t}
            type="button"
            className={s.filterBtn}
            aria-pressed={tech === t}
            onClick={() => setTech(tech === t ? null : t)}
          >
            {t}
          </button>
        ))}
      </div>
      {grouped ? (
        <>
          {odList.length > 0 && (
            <section id="on-demand" className={s.groupSection}>
              <Reveal>
                <SplitHeadline
                  title={dict.projectsPage.onDemandA}
                  accent={dict.projectsPage.onDemandB}
                  size="clamp(1.6rem, 3.6vw, 2.4rem)"
                />
                <p style={{ color: 'var(--muted)', maxWidth: '60ch', marginTop: '0.7rem' }}>
                  {dict.projectsPage.onDemandSub}
                </p>
              </Reveal>
              <div className={`${s.grid} ${s.cv}`}>{odList.map(card)}</div>
            </section>
          )}
          {osList.length > 0 && (
            <section id="open-source" className={s.groupSection}>
              <Reveal>
                <SplitHeadline
                  title={dict.projectsPage.openSourceA}
                  accent={dict.projectsPage.openSourceB}
                  size="clamp(1.6rem, 3.6vw, 2.4rem)"
                />
                <p style={{ color: 'var(--muted)', maxWidth: '60ch', marginTop: '0.7rem' }}>
                  {dict.projectsPage.openSourceSub}
                </p>
              </Reveal>
              <div className={`${s.grid} ${s.cv}`}>{osList.map(card)}</div>
            </section>
          )}
        </>
      ) : (
        <div className={`${s.grid} ${s.cv}`}>{flat.map(card)}</div>
      )}
    </section>
  );
};
