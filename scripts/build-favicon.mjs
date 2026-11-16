// Regenerates public/favicon.ico — a real multi-size ICO (16/32/48) packed
// from PNGs rasterized out of favicon.svg, so crawlers and browsers that
// still ask for /favicon.ico get the same KA_ mark.
// Usage: node scripts/build-favicon.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const svg = readFileSync(resolve('public/favicon.svg'));
const SIZES = [16, 32, 48];

// Render large, then let sharp downsample per size for crisp edges.
const pngs = await Promise.all(
  SIZES.map((size) =>
    sharp(svg, { density: 384 })
      .resize(size, size, { kernel: 'lanczos3' })
      .png()
      .toBuffer(),
  ),
);

// ICO container: ICONDIR + one ICONDIRENTRY per image, PNG payloads allowed
// for every size on all modern consumers (Vista+, all crawlers).
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);

const dir = Buffer.alloc(16 * pngs.length);
let offset = 6 + dir.length;
pngs.forEach((png, i) => {
  dir.writeUInt8(SIZES[i], i * 16); // width
  dir.writeUInt8(SIZES[i], i * 16 + 1); // height
  dir.writeUInt8(0, i * 16 + 2); // palette
  dir.writeUInt8(0, i * 16 + 3); // reserved
  dir.writeUInt16LE(1, i * 16 + 4); // planes
  dir.writeUInt16LE(32, i * 16 + 6); // bpp
  dir.writeUInt32LE(png.length, i * 16 + 8);
  dir.writeUInt32LE(offset, i * 16 + 12);
  offset += png.length;
});

const out = resolve('public/favicon.ico');
writeFileSync(out, Buffer.concat([header, dir, ...pngs]));
console.log(`favicon.ico written (${SIZES.join('/')})`);
