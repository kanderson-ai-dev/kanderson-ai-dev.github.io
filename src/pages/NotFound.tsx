import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { Reveal, SplitHeadline, Stamp } from '../components/primitives';
import s from './pages.module.css';

export const NotFound = () => {
  const { dict, l } = useLang();
  return (
    <section className={s.hookBand}>
      <div className={`${s.wrap} ${s.hookInner}`}>
        <Reveal>
          <Stamp accent>404</Stamp>
          <div style={{ marginTop: '1.6rem' }}>
            <SplitHeadline title={dict.notFound.titleA} accent={dict.notFound.titleB} as="h1" size="clamp(2.4rem,6vw,4.5rem)" />
          </div>
          <p style={{ color: 'var(--muted)', marginTop: '1.2rem' }}>{dict.notFound.text}</p>
          <p style={{ marginTop: '1.8rem' }}>
            <Link to={l('/')}>← {dict.notFound.back}</Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
};
