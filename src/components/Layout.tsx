// Layout: navbar with mega-menu, footer, contact band (Plan.md §4, §5.4).
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { onDemandProjects, openSourceProjects, visibleProjects } from '../content/projects';
import { useLang, switchPath } from '../i18n';
import { AccessBadge, Button, StatusPill, GlassPanel, Kicker, SplitHeadline, EndCard } from './primitives';
import s from './layout.module.css';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.3 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5Z" />
  </svg>
);

export const LINKEDIN = 'https://www.linkedin.com/in/kaarsten-anderson/';
export const GITHUB = 'https://github.com/kanderson-ai-dev';
export const EMAIL = 'contact@kaarstenanderson.com';

/* ---------------- Mega menu ---------------- */

type Dict = ReturnType<typeof useLang>['dict'];

const MegaItem = ({
  p,
  num,
  l,
  dict,
  onNavigate,
}: {
  p: (typeof visibleProjects)[number];
  num: number;
  l: (p: string) => string;
  dict: Dict;
  onNavigate: () => void;
}) => (
  <Link to={l(`/projects/${p.slug}`)} className={s.megaItem} onClick={onNavigate}>
    <span className={s.megaNum}>{String(num).padStart(2, '0')}</span>
    <img className={s.megaThumb} src={p.cardImage.src} alt="" width={64} height={40} loading="lazy" />
    <span className={s.megaTxt}>
      <span className={s.megaName}>
        {p.copy.en!.title}
        {p.access === 'on-demand' && <AccessBadge label={dict.project.private} />}
      </span>
      <span className={s.megaBlurb} style={{ display: 'block' }}>
        {p.copy.en!.cardBlurb}
      </span>
    </span>
  </Link>
);

const MegaGroup = ({
  id,
  name,
  sub,
  to,
  items,
  l,
  dict,
  onNavigate,
  children,
}: {
  id: string;
  name: string;
  sub: string;
  to: string;
  items: typeof visibleProjects;
  l: (p: string) => string;
  dict: Dict;
  onNavigate: () => void;
  children?: React.ReactNode;
}) => (
  <div className={s.megaGroup} role="group" aria-labelledby={id}>
    <Link id={id} to={to} className={s.megaGroupHead} onClick={onNavigate}>
      <span className={s.megaGroupName}>{name}</span>
      <span className={s.megaGroupSub}>{sub}</span>
    </Link>
    {items.map((p, i) => (
      <MegaItem key={p.slug} p={p} num={i + 1} l={l} dict={dict} onNavigate={onNavigate} />
    ))}
    {children}
  </div>
);

const MegaMenu = ({ dict, l }: { dict: Dict; l: (p: string) => string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const close = () => setOpen(false);

  const enter = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 120);
  };
  const leave = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const grouped = onDemandProjects.length > 0;

  return (
    <div ref={ref} className={`${s.mega} ${open ? s.open : ''}`} onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className={s.navLink} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((v) => !v)}>
        {dict.nav.projects} ▾
      </button>
      <div className={`${s.megaPanel} ${grouped ? s.megaPanelWide : ''}`}>
        <GlassPanel style={{ padding: '0.6rem' }}>
          {grouped ? (
            <div className={s.megaGroups}>
              <MegaGroup
                id="mega-open-source"
                name={dict.nav.openSource}
                sub={dict.nav.openSourceSub}
                to={l('/projects#open-source')}
                items={openSourceProjects}
                l={l}
                dict={dict}
                onNavigate={close}
              />
              <MegaGroup
                id="mega-on-demand"
                name={dict.nav.onDemand}
                sub={dict.nav.onDemandSub}
                to={l('/projects#on-demand')}
                items={onDemandProjects}
                l={l}
                dict={dict}
                onNavigate={close}
              >
                <Link to={`${l('/')}#contact`} className={s.megaEval} onClick={close}>
                  {dict.nav.evalAccess} →
                </Link>
              </MegaGroup>
            </div>
          ) : (
            visibleProjects.map((p, i) => (
              <MegaItem key={p.slug} p={p} num={i + 1} l={l} dict={dict} onNavigate={close} />
            ))
          )}
          <Link to={l('/projects')} className={s.megaAll} onClick={close}>
            {dict.nav.viewAll} →
          </Link>
        </GlassPanel>
      </div>
    </div>
  );
};

/* ---------------- Navbar ---------------- */

export const Navbar = () => {
  const { lang, dict, l } = useLang();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className={s.nav}>
      <div className={s.navInner}>
        <Link to={l('/')} className={s.logo} aria-label="kaarstenanderson.com — home">
          KA<i>_</i>
        </Link>
        <nav className={`${s.navLinks} ${menuOpen ? s.open : ''}`} aria-label="Main">
          <NavLink to={l('/')} end className={s.navLink}>
            {dict.nav.home}
          </NavLink>
          <MegaMenu dict={dict} l={l} />
          <a href="#about" className={s.navLink}>
            {dict.nav.about}
          </a>
          <a href="#contact" className={s.navLink}>
            {dict.nav.contact}
          </a>
          <div className={s.langToggle} role="group" aria-label="Language">
            {(['en', 'es'] as const).map((lg) => (
              <button
                key={lg}
                type="button"
                aria-pressed={lang === lg}
                onClick={() => navigate(switchPath(pathname, lg))}
              >
                {lg.toUpperCase()}
              </button>
            ))}
          </div>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={s.navIcon} aria-label="GitHub — kanderson-ai-dev">
            <GithubIcon />
          </a>
          <StatusPill tone="accent">{dict.nav.openToWork}</StatusPill>
        </nav>
        <button
          type="button"
          className={s.burger}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <i />
          <i />
          <i />
        </button>
      </div>
    </header>
  );
};

/* ---------------- Footer ---------------- */

export const Footer = () => {
  const { dict } = useLang();
  return (
    <footer className={s.footer}>
      <div className={`${s.wrap} ${s.footerInner}`}>
        <span className={s.footerText}>
          {dict.footer.developed} Kaarsten Anderson · 2026
        </span>
        <span className={s.footerLinks}>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub — kanderson-ai-dev">
            GitHub
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn — Kaarsten Anderson">
            LinkedIn
          </a>
          <a href={`mailto:${EMAIL}`} aria-label="Email — contact@kaarstenanderson.com">
            Email
          </a>
        </span>
      </div>
    </footer>
  );
};

/* ---------------- Contact band (end-card style) ---------------- */

export const ContactBand = ({
  kicker,
  titleA,
  titleB,
  text,
  showWork = false,
  showGithub = true,
}: {
  kicker?: string;
  titleA: string;
  titleB?: string;
  text: string;
  showWork?: boolean;
  showGithub?: boolean;
}) => {
  const { dict } = useLang();
  return (
    <section id="contact">
      <EndCard>
        <Kicker>{kicker ?? dict.contact.kicker}</Kicker>
        <div style={{ marginTop: '1.2rem' }}>
          <SplitHeadline
            title={titleA}
            accent={titleB}
            size="clamp(2.2rem, 6vw, 4.4rem)"
          />
        </div>
        <p style={{ color: 'var(--muted)', maxWidth: '56ch', margin: '1.2rem auto 0', fontSize: '1.05rem' }}>{text}</p>
        <div className={s.contactBtns}>
          <Button href={`mailto:${EMAIL}`} variant="primary">
            {dict.contact.primary} →
          </Button>
          {showWork && (
            <Button href="#work" variant="ghost">
              {dict.contact.secondary}
            </Button>
          )}
          {showGithub && (
            <Button href={GITHUB} variant="ghost" external>
              <GithubIcon /> GitHub
            </Button>
          )}
          <Button href={LINKEDIN} variant="ghost" external>
            <LinkedinIcon /> LinkedIn
          </Button>
        </div>
      </EndCard>
    </section>
  );
};
