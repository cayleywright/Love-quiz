#!/usr/bin/env node
// Speechify TTS renderer for the continuous EFT script library.
//
// Converts each bracketed script in ../scripts into Speechify-ready SSML and
// calls the Speechify Text-to-Speech API to render an MP3 of the whole journey.
//
// Design choice for guided-audio output:
//   - [Pause.]      -> a silent  <break>  (default 2.5s)
//   - [Long pause.] -> a longer   <break>  (default 8s)
//   - EVERY OTHER bracketed cue is SPOKEN. For a guided tapping audio you *want*
//     the narrator to say the point names ("Eyebrow", "Side of Eye") and the
//     breath/grounding cues ("Take a breath", "Place a hand on your heart").
//     Only the literal pause markers become silent gaps.
//   - "ROUND n — TITLE" headings and the ⸻ dividers become section breaks and
//     are not read aloud.
//
// Zero dependencies — needs Node 18+ (uses global fetch). No npm install.
//
// Usage:
//   export SPEECHIFY_API_KEY=sk_...            # from platform.speechify.ai/api-keys
//   node tools/speechify-tts.mjs                       # render every script -> audio/
//   node tools/speechify-tts.mjs --only 05-calm-from-anxiety
//   node tools/speechify-tts.mjs --voice henry --model simba-english
//   node tools/speechify-tts.mjs --dry-run            # write .ssml only, no API call, no key needed
//   node tools/speechify-tts.mjs --list-voices        # print available voices and exit
//
// Flags:
//   --only <slug>        Render just one script (filename without .md). Repeatable.
//   --voice <id>         Speechify voice_id (default: henry)
//   --model <id>         Model (default: simba-english)
//   --format <fmt>       mp3 | wav | ogg | aac (default: mp3)
//   --rate <r>           Prosody rate: x-slow|slow|medium or a % like -15% (default: slow)
//   --pause <sec>        Seconds for [Pause.] (default: 2.5)
//   --long-pause <sec>   Seconds for [Long pause.] (default: 8)
//   --out <dir>          Output directory (default: audio)
//   --endpoint <url>     API endpoint (default: https://api.sws.speechify.com/v1/audio/speech)
//   --delay <ms>         Delay between API calls (default: 300)
//   --api-key <key>      Override SPEECHIFY_API_KEY
//   --dry-run            Generate SSML only; do not call the API
//   --list-voices        List available voices from the API and exit

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const SCRIPTS_DIR = join(REPO, 'scripts');

// ---- arg parsing -----------------------------------------------------------
function parseArgs(argv) {
  const o = {
    only: [],
    voice: 'henry',
    model: 'simba-english',
    format: 'mp3',
    rate: 'slow',
    pause: 2.5,
    longPause: 8,
    out: 'audio',
    endpoint: 'https://api.sws.speechify.com/v1/audio/speech',
    delay: 300,
    apiKey: process.env.SPEECHIFY_API_KEY || '',
    dryRun: false,
    listVoices: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--only': o.only.push(next()); break;
      case '--voice': o.voice = next(); break;
      case '--model': o.model = next(); break;
      case '--format': o.format = next(); break;
      case '--rate': o.rate = next(); break;
      case '--pause': o.pause = parseFloat(next()); break;
      case '--long-pause': o.longPause = parseFloat(next()); break;
      case '--out': o.out = next(); break;
      case '--endpoint': o.endpoint = next(); break;
      case '--delay': o.delay = parseInt(next(), 10); break;
      case '--api-key': o.apiKey = next(); break;
      case '--dry-run': o.dryRun = true; break;
      case '--list-voices': o.listVoices = true; break;
      case '-h': case '--help': o.help = true; break;
      default:
        console.error(`Unknown flag: ${a}`);
        process.exit(1);
    }
  }
  return o;
}

// ---- SSML conversion -------------------------------------------------------
const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const breakTag = (sec) => `<break time="${sec}s"/>`;

// Turn one markdown script into an ordered list of SSML chunks (one per round,
// plus the intro). Chunking keeps each API request small and reliable.
function toSsmlChunks(md, opt) {
  const lines = md.split(/\r?\n/);
  const chunks = [];
  let title = '';
  let cur = []; // segments for the current chunk

  const flush = () => {
    if (cur.length) {
      chunks.push(`<speak><prosody rate="${opt.rate}">${cur.join('')}</prosody></speak>`);
      cur = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('# ')) { title = line.slice(2).trim(); continue; }
    if (line.startsWith('## ')) continue;           // subtitle: skip (administrative)
    if (line === '⸻') { cur.push(breakTag(3)); continue; } // divider -> section gap

    // Round heading: start a fresh chunk, no spoken "ROUND n —" text.
    if (/^ROUND\b/i.test(line)) { flush(); cur.push(breakTag(2)); continue; }

    const bracket = line.match(/^\[(.+)\]$/);
    if (bracket) {
      const inner = bracket[1].trim();
      const low = inner.toLowerCase().replace(/[.\s]+$/, '');
      if (low === 'long pause') { cur.push(breakTag(opt.longPause)); continue; }
      if (low === 'pause') { cur.push(breakTag(opt.pause)); continue; }
      // Every other cue (point labels, breath/grounding cues, "Begin tapping",
      // and bracketed spoken lines) is read aloud, with a small settling gap.
      cur.push(`${escapeXml(inner)} ${breakTag(0.9)}`);
      continue;
    }

    // Plain spoken affirmation line — gentle pacing after each.
    cur.push(`${escapeXml(line)} ${breakTag(0.6)}`);
  }
  flush();

  // Announce the title once at the very start of the first chunk, just inside
  // the opening <prosody> tag.
  if (title && chunks.length) {
    const intro = `${escapeXml(title)}. ${breakTag(1.5)}`;
    chunks[0] = chunks[0].replace(/(<prosody\b[^>]*>)/, `$1${intro}`);
  }
  return chunks;
}

// ---- API -------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function synthChunk(ssml, opt) {
  const res = await fetch(opt.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opt.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      input: ssml,
      voice_id: opt.voice,
      model: opt.model,
      audio_format: opt.format,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Speechify API ${res.status} ${res.statusText}: ${body.slice(0, 400)}`);
  }
  const data = await res.json();
  const b64 = data.audio_data || data.audioData || data.audio;
  if (!b64) throw new Error(`No audio_data in response: ${JSON.stringify(data).slice(0, 300)}`);
  return Buffer.from(b64, 'base64');
}

async function listVoices(opt) {
  const url = opt.endpoint.replace(/\/audio\/speech$/, '/voices');
  const res = await fetch(url, { headers: { Authorization: `Bearer ${opt.apiKey}` } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text().catch(() => '')}`);
  return res.json();
}

// ---- main ------------------------------------------------------------------
async function main() {
  const opt = parseArgs(process.argv);

  if (opt.help) {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8')
      .split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'));
    return;
  }

  if (opt.listVoices) {
    if (!opt.apiKey) { console.error('Set SPEECHIFY_API_KEY (or --api-key) first.'); process.exit(1); }
    const voices = await listVoices(opt);
    console.log(JSON.stringify(voices, null, 2));
    return;
  }

  if (!opt.dryRun && !opt.apiKey) {
    console.error([
      'No API key. Set one and re-run, e.g.:',
      '  export SPEECHIFY_API_KEY=sk_...   (from https://platform.speechify.ai/api-keys)',
      '',
      'Or preview the SSML without calling the API:',
      '  node tools/speechify-tts.mjs --dry-run',
    ].join('\n'));
    process.exit(1);
  }

  let files = readdirSync(SCRIPTS_DIR)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort();
  if (opt.only.length) {
    const want = new Set(opt.only.map((s) => s.replace(/\.md$/, '')));
    files = files.filter((f) => want.has(f.replace(/\.md$/, '')));
    if (!files.length) { console.error(`No script matched --only ${opt.only.join(', ')}`); process.exit(1); }
  }

  const outDir = resolve(REPO, opt.out);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const md = readFileSync(join(SCRIPTS_DIR, file), 'utf8');
    const chunks = toSsmlChunks(md, opt);

    // Always write the generated SSML for transparency / re-use in Speechify Studio.
    writeFileSync(join(outDir, `${slug}.ssml`), chunks.join('\n\n'), 'utf8');

    if (opt.dryRun) {
      console.log(`[dry-run] ${slug}: ${chunks.length} chunks -> ${join(opt.out, slug + '.ssml')}`);
      continue;
    }

    process.stdout.write(`${slug}: rendering ${chunks.length} chunks `);
    const parts = [];
    for (let i = 0; i < chunks.length; i++) {
      try {
        parts.push(await synthChunk(chunks[i], opt));
        process.stdout.write('.');
      } catch (err) {
        process.stdout.write('\n');
        console.error(`\n  Failed on chunk ${i + 1}/${chunks.length}: ${err.message}`);
        process.exit(1);
      }
      if (i < chunks.length - 1) await sleep(opt.delay);
    }
    // MP3 frames are self-contained, so byte concatenation plays back fine.
    // (Install ffmpeg if you want sample-accurate, gapless joins.)
    const outPath = join(outDir, `${slug}.${opt.format}`);
    writeFileSync(outPath, Buffer.concat(parts));
    console.log(` -> ${join(opt.out, slug + '.' + opt.format)}`);
  }

  console.log(opt.dryRun ? '\nDry run complete.' : '\nDone.');
}

main().catch((err) => { console.error(err); process.exit(1); });
