// /projects — grid index with technology filters (Plan.md §4, §5.2).
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { visibleProjects } from '../content/projects';
import { Badge, Chip, GlassPanel, Reveal, SplitHeadline } from '../components/primitives';
import s from './pages.module.css';

export const Projects = () => {
  const { dict, l } = useLang();
  const [tech, setTech] = useState<string | null>(null);

  const techs = useMemo(() => {
    const all = new Set<string>();
    visibleProjects.forEach((p) => p.stack.forEach((t) => all.add(t)));
    return Array.from(all).sort();
  }, []);

  const list = visibleProjects.filter((p) => !tech || p.stack.includes(tech));

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
      <div className={s.filterRow} role="group" aria-label="filter by technology">
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
      <div className={`${s.grid} ${s.cv}`}>
        {list.map((p) => {
          const copy = p.copy.en!;
          return (
            <Reveal key={p.slug}>
              <GlassPanel hover className={s.card}>
                <Link to={l(`/projects/${p.slug}`)} aria-label={copy.title}>
                  <img
                    className={s.cardImg}
                    src={p.cardImage.src}
                    alt={p.cardImage.alt}
                    width={p.cardImage.width}
                    height={p.cardImage.height}
                    loading="lazy"
                  />
                  <div className={s.cardBody}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem' }}>
                      <span className={s.cardTitle}>{copy.title}</span>
                      <Badge status={p.status} />
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
        })}
      </div>
    </section>
  );
};
