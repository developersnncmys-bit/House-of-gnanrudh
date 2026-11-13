#!/usr/bin/env node
/**
 * In-place image compression for `public/`.
 *
 * - Walks every subdirectory of `public/`
 * - Picks up `.png`, `.jpg`, `.jpeg` files
 * - Resizes to max 1920px on the longest side (keeps aspect ratio,
 *   never upscales — small source images stay at their native size)
 * - PNGs → re-encoded with palette quantization (quality 82) + max
 *   zlib compression. For photo-content PNGs this typically cuts
 *   file size by 60–80%% while staying visually indistinguishable.
 * - JPGs → re-encoded with mozjpeg at quality 78 (progressive).
 * - Skips any file smaller than 200KB (already lean).
 * - Writes back **in place** so no code paths need to change.
 *
 * Run with:
 *   node scripts/compress-images.mjs
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

const MAX_DIMENSION = 1920;
const PNG_QUALITY = 82;
const JPG_QUALITY = 78;
const SKIP_THRESHOLD = 200 * 1024; // leave anything under 200 KB alone

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      yield full;
    }
  }
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function compressOne(file) {
  const stat = await fs.stat(file);
  if (stat.size < SKIP_THRESHOLD) return null;

  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();
  const needsResize =
    (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION;

  let pipeline = img;
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const ext = path.extname(file).toLowerCase();
  if (ext === '.png') {
    pipeline = pipeline.png({
      quality: PNG_QUALITY,
      compressionLevel: 9,
      palette: true,
      effort: 10,
    });
  } else {
    pipeline = pipeline.jpeg({
      quality: JPG_QUALITY,
      mozjpeg: true,
      progressive: true,
    });
  }

  const buf = await pipeline.toBuffer();

  // Only overwrite if we actually saved bytes — otherwise keep the
  // original (sometimes an already-optimal JPEG grows after re-encode).
  if (buf.length >= stat.size) {
    return { file, before: stat.size, after: stat.size, skipped: true };
  }

  await fs.writeFile(file, buf);
  return { file, before: stat.size, after: buf.length, skipped: false };
}

async function main() {
  console.log(`Scanning ${PUBLIC_DIR}…\n`);

  const results = [];
  for await (const file of walk(PUBLIC_DIR)) {
    try {
      const r = await compressOne(file);
      if (r) results.push(r);
    } catch (err) {
      console.error(`  ! ${path.relative(PROJECT_ROOT, file)} — ${err.message}`);
    }
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;

  for (const r of results) {
    const rel = path.relative(PROJECT_ROOT, r.file);
    totalBefore += r.before;
    totalAfter += r.after;
    if (!r.skipped) {
      touched += 1;
      const pct = (100 - (r.after / r.before) * 100).toFixed(0);
      console.log(`  ✓ ${rel.padEnd(60)} ${fmt(r.before)} → ${fmt(r.after)} (-${pct}%)`);
    }
  }

  console.log(
    `\nCompressed ${touched} / ${results.length} files.  ` +
      `Total: ${fmt(totalBefore)} → ${fmt(totalAfter)} ` +
      `(-${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}%)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
