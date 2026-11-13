// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { Navbar } from './Layout';

afterEach(cleanup);

const renderNav = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar />
    </MemoryRouter>,
  );

describe('Navbar mega-menu', () => {
  it('toggles aria-expanded and lists both groups with their links', () => {
    renderNav();
    const btn = screen.getByRole('button', { name: /projects/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveAttribute('aria-controls', 'mega-panel');

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    const onDemand = document.getElementById('mega-on-demand');
    const openSource = document.getElementById('mega-open-source');
    expect(onDemand).toHaveAttribute('href', '/projects#on-demand');
    expect(openSource).toHaveAttribute('href', '/projects#open-source');
    expect(onDemand).toHaveTextContent(/on demand/i);
    expect(openSource).toHaveTextContent(/open source/i);

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Navbar burger', () => {
  it('Escape closes the burger and the mega-menu, focus returns to the burger', () => {
    renderNav();
    const burger = screen.getByRole('button', { name: 'Menu' });
    expect(burger).toHaveAttribute('aria-controls', 'primary-nav');

    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    const btn = screen.getByRole('button', { name: /projects/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(burger).toHaveAttribute('aria-expanded', 'false');
    expect(burger).toHaveFocus();
  });
});
