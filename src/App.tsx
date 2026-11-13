import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Grain, Stage } from './components/primitives';
import { Footer, Navbar } from './components/Layout';
import { Landing } from './pages/Landing';
import { Projects } from './pages/Projects';
import { ProjectPage } from './pages/ProjectPage';
import { NotFound } from './pages/NotFound';
import { langFromPath, titleForPath } from './i18n';
import { scrollToId } from './hooks/useHashScroll';
import layout from './components/layout.module.css';

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.documentElement.lang = langFromPath(pathname);
    document.title = titleForPath(pathname);
    if (hash) {
      scrollToId(hash.slice(1));
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

export const Shell = () => (
  <>
    <ScrollManager />
    <Stage />
    <Grain />
    <div className={layout.shell}>
      <Navbar />
      <main className={layout.main}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/es" element={<Landing />} />
          <Route path="/es/projects" element={<Projects />} />
          <Route path="/es/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
