// Renders clean film stills straight from the Remotion compositions:
// burnSubtitles:false + brackets:false merged into the props, --scale=2.
// Never touches the MP4 masters (burned captions, unreliable seeking).
//
// Usage: node scripts/render-stills.mjs [slug ...]   (default: all)
// Map:   video-studio/stills.json  →  _raw/<slug>/stills/<name>.png
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const STUDIO = join(ROOT, 'video-studio');
const MAP = JSON.parse(readFileSync(join(STUDIO, 'stills.json'), 'utf8'));

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MAP).filter((k) => !k.startsWith('//'));
const tmp = join(tmpdir(), 'stills-props.json');

for (const slug of slugs) {
  const entry = MAP[slug];
  if (!entry) {
    console.error(`unknown slug: ${slug}`);
    process.exitCode = 1;
    continue;
  }
  const fileProps = entry.props ? JSON.parse(readFileSync(join(STUDIO, entry.props), 'utf8')) : {};
  const outDir = join(ROOT, '_raw', slug, 'stills');
  mkdirSync(outDir, { recursive: true });

  for (const s of entry.stills) {
    const props = s.inlineProps
      ? { burnSubtitles: false, ...s.inlineProps }
      : { ...fileProps, burnSubtitles: false, brackets: false };
    writeFileSync(tmp, JSON.stringify(props));
    const out = join(outDir, `${s.name}.png`);
    console.log(`${slug}/${s.name}: ${s.composition} @ frame ${s.frame}`);
    execFileSync(
      process.execPath,
      [
        join(STUDIO, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'),
        'still', 'src/index.ts', s.composition, out,
        `--props=${tmp}`, `--frame=${s.frame}`, '--scale=2', '--overwrite',
      ],
      { cwd: STUDIO, stdio: 'inherit' },
    );
  }
}
rmSync(tmp, { force: true });
console.log('done');
