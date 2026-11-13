// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { ProjectPage } from './ProjectPage';

// jsdom has no IntersectionObserver (scroll-spy, Reveal) — a no-op stub keeps
// those hooks inert without affecting what is rendered.
beforeAll(() => {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    value: IO,
  });
});

afterEach(cleanup);

const renderPage = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/es/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProjectPage i18n (D-I18N1)', () => {
  it('renders the Spanish copy under /es/projects/<slug>', () => {
    renderPage('/es/projects/langgraph-multiagent-orchestrator');
    expect(
      screen.getByText(/Un equipo de especialistas de IA que redacta tus informes/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/decide quién trabaja/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/solo está disponible en inglés/i),
    ).not.toBeInTheDocument();
  });

  it('renders the English copy under /projects/<slug>', () => {
    renderPage('/projects/langgraph-multiagent-orchestrator');
    expect(
      screen.getByText(/A team of AI specialists that writes your reports/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/decides who works/i)).toBeInTheDocument();
  });
});
