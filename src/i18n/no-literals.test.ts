// Guards Plan.md §8: every visible string goes through the dictionary or
// ProjectCopy. Greps all .tsx sources for JSX text nodes and literal
// aria-labels; anything with letters that is not allowlisted fails.
import { describe, expect, it } from 'vitest';

const sources = import.meta.glob('../**/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Identical in every language: brand marks, icon glyphs, separators.
const ALLOW = new Set([
  'KA',
  'KA_',
  'vs',
  '404',
  'GitHub',
  'LinkedIn',
  'Email',
  'kaarstenanderson.com',
  'Kaarsten Anderson',
  'Kaarsten Anderson · 2026',
]);
// Whitespace, digits, punctuation, symbols and '_' carry no translatable text.
const SYMBOL_ONLY = /^[\s\p{P}\p{S}\d_]+$/u;

const problems: string[] = [];
for (const [file, src] of Object.entries(sources)) {
  if (file.endsWith('.test.tsx')) continue;
  for (const m of src.matchAll(/aria-label="([^"]+)"/g)) {
    if (!SYMBOL_ONLY.test(m[1]) && !ALLOW.has(m[1].trim())) {
      problems.push(`${file}: literal aria-label "${m[1]}"`);
    }
  }
  for (const m of src.matchAll(/>([^<>{}\n]+)</g)) {
    const text = m[1].trim();
    if (text && !SYMBOL_ONLY.test(text) && !ALLOW.has(text)) {
      problems.push(`${file}: literal JSX text "${text.slice(0, 60)}"`);
    }
  }
}

describe('no loose strings in components (Plan.md §8)', () => {
  it('finds no untranslated JSX text or aria-labels', () => {
    expect(problems).toEqual([]);
  });
});
